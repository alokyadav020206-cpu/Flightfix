from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets

from .models import MaintenanceDataset
from .serializers import MaintenanceDatasetSerializer


class MaintenanceDatasetViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only API for historical maintenance records (50,000 rows).
    Supports search, filtering, and ordering.
    """
    queryset = MaintenanceDataset.objects.all().order_by("-maintenance_date", "-record_id")
    serializer_class = MaintenanceDatasetSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["aircraft_code", "model", "maintenance_type", "priority", "status", "technician"]
    search_fields = ["aircraft_code", "model", "maintenance_type", "technician", "part_no"]
    ordering_fields = ["record_id", "maintenance_date", "flight_hours", "cost", "priority"]
