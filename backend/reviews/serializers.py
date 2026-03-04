from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source="product.name")
    user_username = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = Review
        fields = ["id", "product", "product_name", "user", "user_username", "rating", "comment", "created_at"]
        read_only_fields = ["id", "user", "user_username", "created_at"]