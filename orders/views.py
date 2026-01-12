from django.shortcuts import render
from .serializers import OrderSerializer, OrderItemSerializer
from rest_framework import viewsets
from .models import Order,OrderItem

# Create your views here.
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    

    def get_queryset(self):
        return self.queryset
    

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

    def get_queryset(self):
        return self.queryset