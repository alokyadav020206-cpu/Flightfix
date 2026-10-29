from django.contrib import admin

from .models import (MaintenanceHistory, MaintenanceSchedule, MaintenanceTask,
                     WorkOrder, WorkOrderPart)

for model in (MaintenanceSchedule, WorkOrder, WorkOrderPart, MaintenanceTask, MaintenanceHistory):
    admin.site.register(model)
