from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserCreation

User = get_user_model()

class UserCreationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = UserCreation
        fields = ["username", "email", "mobile", "password", "is_seller"]
        read_only_fields = ["is_seller"]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = UserCreation.objects.create_user(password=password, **validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

