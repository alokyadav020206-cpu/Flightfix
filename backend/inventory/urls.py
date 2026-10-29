from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import SparePartViewSet

router = DefaultRouter()
router.register("spare-parts", SparePartViewSet, basename="sparepart")

urlpatterns = [path("", include(router.urls))]
