from rest_framework import serializers
from .models import Review
from products.models import Product

class ReviewSerializer(serializers.Serializer):
    product_name = serializers.ReadOnlyField(source="product.name")
    user_username = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = Review
        fields = ["id", "product", "product_name", "user_username", "rating", "comment", "created_at"]
        read_only_fields = ["created_at"]