from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AircraftViewSet

router = DefaultRouter()
router.register("aircraft", AircraftViewSet, basename="aircraft")

urlpatterns = [path("", include(router.urls))]
