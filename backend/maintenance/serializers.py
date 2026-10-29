from rest_framework import serializers

from technicians.models import Technician

from .models import (MaintenanceHistory, MaintenanceSchedule, MaintenanceTask,
                     WorkOrder, WorkOrderPart)


class MaintenanceScheduleSerializer(serializers.ModelSerializer):
    aircraft_registration = serializers.CharField(source="aircraft.registration_number", read_only=True)

    class Meta:
        model = MaintenanceSchedule
        fields = "__all__"


class MaintenanceTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceTask
        fields = "__all__"
        read_only_fields = ["completed_at"]


class WorkOrderPartSerializer(serializers.ModelSerializer):
    part_name = serializers.CharField(source="spare_part.name", read_only=True)

    class Meta:
        model = WorkOrderPart
        fields = "__all__"

    def validate(self, attrs):
        part = attrs.get("spare_part")
        qty = attrs.get("quantity", 1)
        if self.instance is None and part and qty > part.quantity_in_stock:
            raise serializers.ValidationError(
                {"quantity": f"Only {part.quantity_in_stock} in stock for {part.name}."})
        return attrs


class WorkOrderSerializer(serializers.ModelSerializer):
    aircraft_registration = serializers.CharField(source="aircraft.registration_number", read_only=True)
    assigned_technicians = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Technician.objects.all(), required=False)
    technician_names = serializers.SerializerMethodField()
    tasks = MaintenanceTaskSerializer(many=True, read_only=True)
    parts_used = WorkOrderPartSerializer(many=True, read_only=True)

    class Meta:
        model = WorkOrder
        fields = "__all__"
        read_only_fields = ["order_number", "created_by", "created_at", "completed_at"]

    def get_technician_names(self, obj):
        return [t.name for t in obj.assigned_technicians.all()]


class MaintenanceHistorySerializer(serializers.ModelSerializer):
    aircraft_registration = serializers.CharField(source="aircraft.registration_number", read_only=True)
    order_number = serializers.CharField(source="work_order.order_number", read_only=True)

    class Meta:
        model = MaintenanceHistory
        fields = "__all__"
