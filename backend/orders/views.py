from .serializers import OrderSerializer, OrderItemSerializer, CheckoutSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Order, OrderItem
from products.models import Product
from decimal import Decimal


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-ordered_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='checkout')
    def checkout(self, request):
        """
        Accept cart items, create an Order + OrderItems.
        Expects: { items: [{product_id, quantity}], shipping_name, shipping_address, payment_method }
        """
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        cart_items = data['items']
        if not cart_items:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch products and calculate total from DB prices (not client-supplied)
        product_ids = [item['product_id'] for item in cart_items]
        products = Product.objects.filter(id__in=product_ids)
        product_map = {p.id: p for p in products}

        # Validate all products exist
        for item in cart_items:
            if item['product_id'] not in product_map:
                return Response(
                    {'error': f"Product {item['product_id']} not found"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Calculate total
        total = Decimal('0.00')
        order_items_data = []
        for item in cart_items:
            product = product_map[item['product_id']]
            subtotal = product.price * item['quantity']
            total += subtotal
            order_items_data.append({
                'product': product,
                'quantity': item['quantity'],
                'price_at_purchase': product.price,
            })

        # Create order
        payment_method = data.get('payment_method', 'cod')
        payment_status = 'paid' if payment_method in ('esewa', 'khalti') else 'unpaid'

        order = Order.objects.create(
            user=request.user,
            total_price=total,
            status='Pending',
            payment_method=payment_method,
            payment_status=payment_status,
        )

        # Create order items
        for oi in order_items_data:
            OrderItem.objects.create(order=order, **oi)

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return OrderItem.objects.filter(order__user=self.request.user)