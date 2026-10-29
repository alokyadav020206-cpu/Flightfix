from django.db.models import F
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import ReadAnyWriteManagerUp

from .models import SparePart
from .serializers import SparePartSerializer


class SparePartViewSet(viewsets.ModelViewSet):
    queryset = SparePart.objects.all()
    serializer_class = SparePartSerializer
    permission_classes = [ReadAnyWriteManagerUp]
    filterset_fields = ["category", "supplier"]
    search_fields = ["part_number", "name", "category", "supplier"]
    ordering_fields = ["name", "quantity_in_stock", "unit_price"]

    @action(detail=False, methods=["get"])
    def low_stock(self, request):
        qs = self.get_queryset().filter(quantity_in_stock__lte=F("reorder_level"))
        return Response(self.get_serializer(qs, many=True).data)
