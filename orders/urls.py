from django.urls import include,path
from rest_framework.routers import DefaultRouter
from views import OrderViewSet, OrderItemViewSet


router = DefaultRouter()
router.register(r"orders", OrderViewSet)
router.register(r"orderitems", OrderItemViewSet)


urlpatterns = ['',include(router.urls)]