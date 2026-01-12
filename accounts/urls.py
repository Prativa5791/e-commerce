from django.urls import path, include
from django.contrib.auth import views as auth_views
from rest_framework.routers import DefaultRouter
from .views import UserCreationViewSet
router = DefaultRouter()
router.register(r'users', UserCreationViewSet, basename='usercreation')
urlpatterns = [path("",include(router.urls))]
    

# urlpatterns = [
#     path('', UserCreationView.as_view(), name='user_register'),
#     path('login/', auth_views.LoginView.as_view(template_name='accounts/login.html'), name='login'),
#     path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    
# ]