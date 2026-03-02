from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'price', 'original_price',
            'description', 'image_url', 'rating', 'reviews_count',
            'badge', 'in_stock', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']