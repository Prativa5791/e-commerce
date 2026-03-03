from .serializers import (
    OrderSerializer, OrderItemSerializer,
    CheckoutSerializer, OrderStatusUpdateSerializer,
)
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import Order, OrderItem
from products.models import Product
from decimal import Decimal
from django.utils import timezone
from django.db.models import Sum, Count


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Admin/staff see all orders
        if user.is_staff or user.is_superuser:
            return Order.objects.all().order_by('-ordered_at')
        # Sellers see orders that contain their products (if needed in future)
        return Order.objects.filter(user=user).order_by('-ordered_at')

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
            shipping_name=data.get('shipping_name', ''),
            shipping_address=data.get('shipping_address', ''),
            shipping_phone=data.get('shipping_phone', ''),
        )

        # Create order items
        for oi in order_items_data:
            OrderItem.objects.create(order=order, **oi)

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        """
        Update order status (for admin/seller).
        """
        order = self.get_object()
        user = request.user

        # Only admin/staff can update status
        if not (user.is_staff or user.is_superuser or user.is_seller):
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = OrderStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        new_status = data['status']
        now = timezone.now()

        # Set timestamps based on status
        if new_status == 'Confirmed' and not order.confirmed_at:
            order.confirmed_at = now
        elif new_status == 'Shipped' and not order.shipped_at:
            order.shipped_at = now
            if not order.confirmed_at:
                order.confirmed_at = now
        elif new_status == 'Delivered' and not order.delivered_at:
            order.delivered_at = now
            if not order.shipped_at:
                order.shipped_at = now

        order.status = new_status

        if data.get('tracking_number'):
            order.tracking_number = data['tracking_number']
        if data.get('estimated_delivery'):
            order.estimated_delivery = data['estimated_delivery']

        order.save()
        return Response(OrderSerializer(order).data)

    @action(detail=False, methods=['get'], url_path='all-orders')
    def all_orders(self, request):
        """Admin endpoint to get ALL orders from all users."""
        user = request.user
        if not (user.is_staff or user.is_superuser or getattr(user, 'is_seller', False)):
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN,
            )
        orders = Order.objects.all().order_by('-ordered_at')
        return Response(OrderSerializer(orders, many=True).data)

    @action(detail=False, methods=['get'], url_path='analytics')
    def analytics(self, request):
        """Admin analytics endpoint."""
        user = request.user
        if not (user.is_staff or user.is_superuser or getattr(user, 'is_seller', False)):
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN,
            )

        all_orders = Order.objects.all()
        total_revenue = all_orders.aggregate(total=Sum('total_price'))['total'] or 0
        total_orders = all_orders.count()
        pending_orders = all_orders.filter(status='Pending').count()
        delivered_orders = all_orders.filter(status='Delivered').count()
        canceled_orders = all_orders.filter(status='Canceled').count()

        # Revenue by status
        status_breakdown = {}
        for s in ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Canceled']:
            qs = all_orders.filter(status=s)
            status_breakdown[s] = {
                'count': qs.count(),
                'revenue': float(qs.aggregate(total=Sum('total_price'))['total'] or 0),
            }

        # Recent orders
        recent = OrderSerializer(all_orders[:10], many=True).data

        return Response({
            'total_revenue': float(total_revenue),
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'delivered_orders': delivered_orders,
            'canceled_orders': canceled_orders,
            'status_breakdown': status_breakdown,
            'recent_orders': recent,
        })


class OrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return OrderItem.objects.filter(order__user=self.request.user)