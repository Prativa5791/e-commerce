from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product
from django.db import transaction



class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    price_at_purchase = serializers.ReadOnlyField()
    class Meta:
        model = OrderItem
        fields = ['product','product_name','quantity','price_at_purchase']



class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    total_price = serializers.ReadOnlyField()
    user = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Order
        fields = ['id','user','status','total_price','ordered_at','items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')


        with transaction.atomic():
            order = Order.objects.create(total_price=0, **validated_data)

            running_total = 0

            for item in items_data:
                product = item['product']
                quantity = item['quantity']


                current_price = product.price
                line_total = current_price * quantity
                running_total += line_total

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity,
                    price_at_purchase=current_price
                )

            order.total_price = running_total
            order.save()
        return order
