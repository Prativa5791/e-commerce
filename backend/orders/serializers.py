from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'product_name', 'quantity', 'price_at_purchase']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Order
        fields = ['id', 'user', 'status', 'total_price', 'payment_method', 'payment_status', 'ordered_at', 'items']


class CheckoutItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class CheckoutSerializer(serializers.Serializer):
    items = CheckoutItemSerializer(many=True)
    shipping_name = serializers.CharField(max_length=200, required=False, default='')
    shipping_address = serializers.CharField(max_length=500, required=False, default='')
    shipping_phone = serializers.CharField(max_length=20, required=False, default='')
    payment_method = serializers.ChoiceField(
        choices=['cod', 'esewa', 'khalti'],
        default='cod',
    )
    payment_token = serializers.CharField(required=False, default='', allow_blank=True)