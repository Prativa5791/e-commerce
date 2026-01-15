from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .serializers import ReviewSerializer
from .models import Review

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)
    
    def perform_create(self,serializer):
        serializer.save(user=self.request.user)