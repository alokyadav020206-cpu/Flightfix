from django.contrib.auth.models import Group, User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .permissions import ROLES, get_role


class RoleTokenSerializer(TokenObtainPairSerializer):
    """Login response: access + refresh tokens + user info with role."""

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "role": get_role(self.user),
        }
        return data


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=6)
    role = serializers.ChoiceField(choices=ROLES, required=False)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name",
                  "password", "role", "is_active"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["role"] = get_role(instance)
        return data

    def _set_role(self, user, role):
        if role:
            user.groups.set(Group.objects.filter(name=role))

    def create(self, validated_data):
        role = validated_data.pop("role", "Technician")
        password = validated_data.pop("password", None)
        if not password:
            raise serializers.ValidationError({"password": "This field is required."})
        user = User.objects.create_user(password=password, **validated_data)
        self._set_role(user, role)
        return user

    def update(self, instance, validated_data):
        role = validated_data.pop("role", None)
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        self._set_role(instance, role)
        return instance
