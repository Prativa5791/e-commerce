# from django.views.generic.edit import CreateView
# from django.urls import reverse_lazy
# from .forms import UserCreationForm
# from .models import UserCreation

# class UserCreationView(CreateView):
#     model = UserCreation
#     form_class = UserCreationForm
#     template_name = 'accounts/user_creation.html'
#     success_url = reverse_lazy('login')

from rest_framework import generics
from .models import UserCreation    
from .serializers import UserCreationSerializer 
from rest_framework import viewsets
from rest_framework.decorators import action

class UserCreationViewSet(viewsets.ModelViewSet):
    queryset = UserCreation.objects.all()
    serializer_class = UserCreationSerializer
    
    # If you only want creation now, disable other actions:
    http_method_names = ['post']