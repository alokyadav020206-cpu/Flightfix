from rest_framework import serializers

from .models import SparePart


class SparePartSerializer(serializers.ModelSerializer):
    is_low_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = SparePart
        fields = "__all__"
