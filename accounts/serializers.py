from rest_framework import serializers
from .models import UserCreation
class UserCreationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model=UserCreation
        fields="__all__"
        
