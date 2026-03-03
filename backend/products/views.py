from .models import Product
from .serializers import ProductSerializer
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum, Count


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Product.objects.all()
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        in_stock = self.request.query_params.get('in_stock')
        seller_only = self.request.query_params.get('seller_only')

        if category and category != 'All':
            qs = qs.filter(category=category)
        if search:
            qs = qs.filter(name__icontains=search)
        if in_stock is not None:
            qs = qs.filter(in_stock=in_stock.lower() == 'true')
        if seller_only and self.request.user.is_authenticated:
            qs = qs.filter(seller=self.request.user)
        return qs

    @action(detail=False, methods=['get'], url_path='analytics')
    def analytics(self, request):
        """Product analytics for admin dashboard."""
        if not (request.user.is_staff or request.user.is_superuser or getattr(request.user, 'is_seller', False)):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        total_products = Product.objects.count()
        in_stock = Product.objects.filter(in_stock=True).count()
        out_of_stock = Product.objects.filter(in_stock=False).count()

        # Category breakdown
        categories = {}
        for cat_code, cat_label in Product.CATEGORY_CHOICES:
            count = Product.objects.filter(category=cat_code).count()
            categories[cat_label] = count

        return Response({
            'total_products': total_products,
            'in_stock': in_stock,
            'out_of_stock': out_of_stock,
            'categories': categories,
        })
