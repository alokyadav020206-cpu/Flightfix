from rest_framework import viewsets

from accounts.permissions import ReadAnyWriteManagerUp

from .models import Aircraft
from .serializers import AircraftSerializer


class AircraftViewSet(viewsets.ModelViewSet):
    queryset = Aircraft.objects.all()
    serializer_class = AircraftSerializer
    permission_classes = [ReadAnyWriteManagerUp]
    filterset_fields = ["status", "manufacturer"]
    search_fields = ["registration_number", "model", "manufacturer", "serial_number"]
    ordering_fields = ["registration_number", "total_flight_hours", "last_maintenance_date"]
