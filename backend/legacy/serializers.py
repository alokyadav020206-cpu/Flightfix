from rest_framework import serializers
from .models import MaintenanceDataset


class MaintenanceDatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceDataset
        fields = "__all__"
