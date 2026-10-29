from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import TechnicianViewSet

router = DefaultRouter()
router.register("technicians", TechnicianViewSet, basename="technician")

urlpatterns = [path("", include(router.urls))]
