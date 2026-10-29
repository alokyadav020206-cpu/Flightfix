from rest_framework import viewsets

from accounts.permissions import ReadAnyWriteManagerUp

from .models import Technician
from .serializers import TechnicianSerializer


class TechnicianViewSet(viewsets.ModelViewSet):
    queryset = Technician.objects.all()
    serializer_class = TechnicianSerializer
    permission_classes = [ReadAnyWriteManagerUp]
    filterset_fields = ["specialization", "is_available"]
    search_fields = ["name", "employee_id", "specialization"]
