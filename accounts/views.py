from .models import UserCreation    
from .serializers import UserCreationSerializer ,LoginSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
from rest_framework.permissions import AllowAny

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
        return Response({
            'id':user.id,
            'username': user.username,
            'email': user.email,
            'message': 'User created successfully!!!'
        }, status=status.HTTP_201_CREATED)
    

    @action(detail=False, methods=['post'], url_path='login',permission_classes=[AllowAny])
    def login(self,request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token':token.key,
                'user': {'id': user.id, 'username':user.username}
            })
        return Response({'error':'Invalid credentials'},
                        status=status.HTTP_401_UNAUTHORIZED)