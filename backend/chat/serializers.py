from rest_framework import serializers
from .models import ChatRoom, ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.ReadOnlyField(source='sender.username')

    class Meta:
        model = ChatMessage
        fields = ['id', 'room', 'sender', 'sender_username', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'sender', 'sender_username', 'is_read', 'created_at']


class ChatRoomSerializer(serializers.ModelSerializer):
    buyer_username = serializers.ReadOnlyField(source='buyer.username')
    seller_username = serializers.ReadOnlyField(source='seller.username')
    product_name = serializers.ReadOnlyField(source='product.name')
    product_image = serializers.ReadOnlyField(source='product.image_url')
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = [
            'id', 'buyer', 'buyer_username', 'seller', 'seller_username',
            'product', 'product_name', 'product_image',
            'last_message', 'unread_count',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_last_message(self, obj):
        msg = obj.messages.order_by('-created_at').first()
        if msg:
            return {
                'message': msg.message[:100],
                'sender_username': msg.sender.username,
                'created_at': msg.created_at.isoformat(),
                'is_read': msg.is_read,
            }
        return None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0
