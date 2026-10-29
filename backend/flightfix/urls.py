from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    # OpenAPI & Swagger UI
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    # API Endpoints
    path("api/", include("accounts.urls")),
    path("api/", include("aircraft.urls")),
    path("api/", include("technicians.urls")),
    path("api/", include("inventory.urls")),
    path("api/", include("maintenance.urls")),
    path("api/", include("dashboard.urls")),
    path("api/", include("legacy.urls")),
]
