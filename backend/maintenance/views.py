from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from accounts.permissions import ReadAnyWriteManagerUp, get_role

from .models import (MaintenanceHistory, MaintenanceSchedule, MaintenanceTask,
                     WorkOrder, WorkOrderPart)
from .permissions import WorkOrderPermission
from .serializers import (MaintenanceHistorySerializer, MaintenanceScheduleSerializer,
                          MaintenanceTaskSerializer, WorkOrderPartSerializer,
                          WorkOrderSerializer)


class MaintenanceScheduleViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceSchedule.objects.select_related("aircraft")
    serializer_class = MaintenanceScheduleSerializer
    permission_classes = [ReadAnyWriteManagerUp]
    filterset_fields = ["aircraft", "status", "maintenance_type"]
    search_fields = ["title", "aircraft__registration_number"]
    ordering_fields = ["scheduled_date"]

    def list(self, request, *args, **kwargs):
        # Auto-flag past-due scheduled items as OVERDUE
        MaintenanceSchedule.objects.filter(
            status=MaintenanceSchedule.Status.SCHEDULED,
            scheduled_date__lt=timezone.localdate(),
        ).update(status=MaintenanceSchedule.Status.OVERDUE)
        return super().list(request, *args, **kwargs)


class WorkOrderViewSet(viewsets.ModelViewSet):
    queryset = (WorkOrder.objects.select_related("aircraft")
                .prefetch_related("assigned_technicians", "tasks", "parts_used__spare_part"))
    serializer_class = WorkOrderSerializer
    permission_classes = [WorkOrderPermission]
    filterset_fields = ["aircraft", "status", "priority", "assigned_technicians"]
    search_fields = ["order_number", "title", "aircraft__registration_number"]
    ordering_fields = ["created_at", "due_date", "priority"]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        # Technicians may only change status and actual hours
        if get_role(request.user) == "Technician":
            if not set(request.data.keys()) <= {"status", "actual_hours"}:
                raise PermissionDenied("Technicians can only update status and actual_hours.")
        return super().partial_update(request, *args, **kwargs)

    @action(detail=True, methods=["post"])
    def start(self, request, pk=None):
        wo = self.get_object()
        wo.status = WorkOrder.Status.IN_PROGRESS
        wo.save()
        return Response(self.get_serializer(wo).data)

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        wo = self.get_object()
        if "actual_hours" in request.data:
            wo.actual_hours = request.data["actual_hours"]
        wo.status = WorkOrder.Status.COMPLETED
        wo.save()
        return Response(self.get_serializer(wo).data)


class WorkOrderPartViewSet(viewsets.ModelViewSet):
    queryset = WorkOrderPart.objects.select_related("spare_part", "work_order")
    serializer_class = WorkOrderPartSerializer
    permission_classes = [ReadAnyWriteManagerUp]
    filterset_fields = ["work_order", "spare_part"]


class MaintenanceTaskViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceTask.objects.select_related("work_order")
    serializer_class = MaintenanceTaskSerializer
    permission_classes = [WorkOrderPermission]
    filterset_fields = ["work_order", "technician", "is_done"]

    def update(self, request, *args, **kwargs):
        # Technicians: tick tasks only (is_done) on their own work orders
        if get_role(request.user) == "Technician":
            if not set(request.data.keys()) <= {"is_done"}:
                raise PermissionDenied("Technicians can only update is_done.")
        return super().update(request, *args, **kwargs)


class MaintenanceHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only: history rows are created automatically when work orders complete."""
    queryset = MaintenanceHistory.objects.select_related("aircraft", "work_order")
    serializer_class = MaintenanceHistorySerializer
    filterset_fields = ["aircraft"]
    search_fields = ["summary", "aircraft__registration_number"]
    ordering_fields = ["completed_on"]
