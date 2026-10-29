from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (MaintenanceHistoryViewSet, MaintenanceScheduleViewSet,
                    MaintenanceTaskViewSet, WorkOrderPartViewSet, WorkOrderViewSet)

router = DefaultRouter()
router.register("maintenance-schedules", MaintenanceScheduleViewSet, basename="schedule")
router.register("work-orders", WorkOrderViewSet, basename="workorder")
router.register("work-order-parts", WorkOrderPartViewSet, basename="workorderpart")
router.register("tasks", MaintenanceTaskViewSet, basename="task")
router.register("maintenance-history", MaintenanceHistoryViewSet, basename="history")

urlpatterns = [path("", include(router.urls))]
