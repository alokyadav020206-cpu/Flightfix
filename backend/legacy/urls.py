from rest_framework.routers import DefaultRouter
from .views import MaintenanceDatasetViewSet

router = DefaultRouter()
router.register("legacy-maintenance", MaintenanceDatasetViewSet, basename="legacy-maintenance")

urlpatterns = router.urls
