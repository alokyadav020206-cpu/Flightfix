from django.contrib import admin
from .models import MaintenanceDataset


@admin.register(MaintenanceDataset)
class MaintenanceDatasetAdmin(admin.ModelAdmin):
    list_display = (
        "record_id",
        "aircraft_code",
        "model",
        "maintenance_type",
        "technician",
        "priority",
        "status",
        "maintenance_date",
        "cost",
    )
    list_filter = ("priority", "status", "maintenance_type", "model")
    search_fields = ("aircraft_code", "model", "technician", "part_no")
    readonly_fields = [f.name for f in MaintenanceDataset._meta.fields]

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
