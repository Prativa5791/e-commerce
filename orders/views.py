from .serializers import OrderSerializer
from rest_framework import viewsets
from .models import Order
from rest_framework.permissions import IsAuthenticated
# Create your views here.
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().prefetch_related('items').order_by('-ordered_at')
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
