from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import ReviewSerializer
from .models import Review
from django.db.models import Avg


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Review.objects.all()
        product_id = self.request.query_params.get('product')
        if product_id:
            qs = qs.filter(product_id=product_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='product/(?P<product_id>[^/.]+)')
    def product_reviews(self, request, product_id=None):
        """Get all reviews for a specific product."""
        reviews = Review.objects.filter(product_id=product_id)
        avg_rating = reviews.aggregate(avg=Avg('rating'))['avg'] or 0
        serializer = self.get_serializer(reviews, many=True)
        return Response({
            'reviews': serializer.data,
            'count': reviews.count(),
            'average_rating': round(avg_rating, 1),
        })

    @action(detail=False, methods=['get'], url_path='my-reviews')
    def my_reviews(self, request):
        """Get all reviews by the current user."""
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        reviews = Review.objects.filter(user=request.user)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
