from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_image = serializers.ReadOnlyField(source='product.image_url')

    class Meta:
        model = OrderItem
        fields = [
            'id', 'order', 'product', 'product_name', 'product_image',
            'quantity', 'price_at_purchase',
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'status', 'total_price',
            'payment_method', 'payment_status',
            'shipping_name', 'shipping_address', 'shipping_phone',
            'tracking_number', 'estimated_delivery',
            'ordered_at', 'confirmed_at', 'shipped_at',
            'delivered_at', 'updated_at', 'items',
        ]
        read_only_fields = [
            'id', 'user', 'ordered_at', 'confirmed_at',
            'shipped_at', 'delivered_at', 'updated_at',
        ]


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


class OrderStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=[
        'Pending', 'Confirmed', 'Processing',
        'Shipped', 'Out for Delivery', 'Delivered', 'Canceled',
    ])
    tracking_number = serializers.CharField(required=False, allow_blank=True, default='')
    estimated_delivery = serializers.DateField(required=False, allow_null=True, default=None)