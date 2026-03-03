from .models import UserCreation
from .serializers import UserCreationSerializer, LoginSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated


class UserCreationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserCreation.objects.all().order_by('-date_joined')

    def get_serializer_class(self):
        if self.action == 'register':
            return UserCreationSerializer
        if self.action == 'login':
            return LoginSerializer
        return UserCreationSerializer

    @action(detail=False, methods=['post'], url_path='register', permission_classes=[AllowAny])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_seller': user.is_seller,
                'is_staff': user.is_staff,
            },
            'message': 'User created successfully!!!'
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='login', permission_classes=[AllowAny])
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_seller': user.is_seller,
                    'is_staff': user.is_staff,
                }
            })
        return Response({'error': 'Invalid credentials'},
                        status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['get'], url_path='me', permission_classes=[IsAuthenticated])
    def me(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_seller': user.is_seller,
            'is_staff': user.is_staff,
        })

    @action(detail=False, methods=['get'], url_path='all-users', permission_classes=[IsAuthenticated])
    def all_users(self, request):
        """Admin endpoint to list all users."""
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        users = UserCreation.objects.all().order_by('-date_joined')
        data = [{
            'id': u.id,
            'username': u.username,
            'email': u.email,
            'is_seller': u.is_seller,
            'is_staff': u.is_staff,
            'is_active': u.is_active,
            'date_joined': u.date_joined.isoformat(),
        } for u in users]
        return Response(data)

    @action(detail=True, methods=['patch'], url_path='toggle-seller', permission_classes=[IsAuthenticated])
    def toggle_seller(self, request, pk=None):
        """Admin endpoint to toggle seller status."""
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        try:
            user = UserCreation.objects.get(pk=pk)
            user.is_seller = not user.is_seller
            user.save()
            return Response({
                'id': user.id,
                'username': user.username,
                'is_seller': user.is_seller,
            })
        except UserCreation.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
