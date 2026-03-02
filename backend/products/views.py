from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Product.objects.all()
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        in_stock = self.request.query_params.get('in_stock')

        if category and category != 'All':
            qs = qs.filter(category=category)
        if search:
            qs = qs.filter(name__icontains=search)
        if in_stock is not None:
            qs = qs.filter(in_stock=in_stock.lower() == 'true')
        return qs
