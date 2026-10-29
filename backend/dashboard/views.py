from django.db.models import Count, F
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView

from aircraft.models import Aircraft
from inventory.models import SparePart
from maintenance.models import MaintenanceSchedule, WorkOrder
from technicians.models import Technician


class DashboardView(APIView):
    def get(self, request):
        today = timezone.localdate()
        aircraft_by_status = dict(
            Aircraft.objects.values_list("status").annotate(n=Count("id")))
        orders_by_status = dict(
            WorkOrder.objects.values_list("status").annotate(n=Count("id")))
        recent = WorkOrder.objects.select_related("aircraft")[:5]

        return Response({
            "aircraft": {
                "total": Aircraft.objects.count(),
                "by_status": aircraft_by_status,
            },
            "work_orders": {
                "total": WorkOrder.objects.count(),
                "by_status": orders_by_status,
                "critical_open": WorkOrder.objects.filter(
                    priority="CRITICAL").exclude(status__in=["COMPLETED", "CANCELLED"]).count(),
            },
            "schedules": {
                "upcoming": MaintenanceSchedule.objects.filter(
                    status="SCHEDULED", scheduled_date__gte=today).count(),
                "overdue": MaintenanceSchedule.objects.filter(
                    status__in=["SCHEDULED", "OVERDUE"], scheduled_date__lt=today).count(),
            },
            "inventory": {
                "total_parts": SparePart.objects.count(),
                "low_stock": SparePart.objects.filter(
                    quantity_in_stock__lte=F("reorder_level")).count(),
            },
            "technicians": {
                "total": Technician.objects.count(),
                "available": Technician.objects.filter(is_available=True).count(),
            },
            "recent_work_orders": [
                {"id": w.id, "order_number": w.order_number, "title": w.title,
                 "aircraft": w.aircraft.registration_number,
                 "status": w.status, "priority": w.priority}
                for w in recent
            ],
        })
