from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .permissions import IsAdmin, get_role
from .serializers import RoleTokenSerializer, UserSerializer


class LoginView(TokenObtainPairView):
    serializer_class = RoleTokenSerializer


class MeView(APIView):
    def get(self, request):
        u = request.user
        return Response({"id": u.id, "username": u.username, "email": u.email,
                         "role": get_role(u)})


class UserViewSet(viewsets.ModelViewSet):
    """Admin-only user management."""
    queryset = User.objects.all().order_by("id")
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    search_fields = ["username", "email", "first_name", "last_name"]
