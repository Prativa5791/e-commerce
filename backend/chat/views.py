from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ChatRoom, ChatMessage
from .serializers import ChatRoomSerializer, ChatMessageSerializer
from django.db.models import Q


class ChatRoomViewSet(viewsets.ModelViewSet):
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ChatRoom.objects.filter(
            Q(buyer=user) | Q(seller=user)
        ).order_by('-updated_at')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        """Create or get an existing chat room."""
        seller_id = request.data.get('seller')
        product_id = request.data.get('product')

        if not seller_id:
            return Response(
                {'error': 'seller is required'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Determine buyer/seller
        buyer = request.user

        # Check if room already exists
        room_filter = Q(buyer=buyer, seller_id=seller_id)
        if product_id:
            room_filter &= Q(product_id=product_id)
        else:
            room_filter &= Q(product__isnull=True)

        existing = ChatRoom.objects.filter(room_filter).first()
        if existing:
            serializer = self.get_serializer(existing)
            return Response(serializer.data)

        # Create new room
        room = ChatRoom.objects.create(
            buyer=buyer,
            seller_id=seller_id,
            product_id=product_id,
        )
        serializer = self.get_serializer(room)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], url_path='messages')
    def messages(self, request, pk=None):
        """Get all messages in a chat room."""
        room = self.get_object()
        messages = room.messages.all().order_by('created_at')
        serializer = ChatMessageSerializer(messages, many=True)
        # Mark messages as read
        room.messages.filter(is_read=False).exclude(sender=request.user).update(is_read=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='send')
    def send_message(self, request, pk=None):
        """Send a message in a chat room."""
        room = self.get_object()
        message_text = request.data.get('message', '').strip()

        if not message_text:
            return Response(
                {'error': 'Message cannot be empty'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        msg = ChatMessage.objects.create(
            room=room,
            sender=request.user,
            message=message_text,
        )
        # Update room timestamp
        room.save()  # triggers auto_now on updated_at

        serializer = ChatMessageSerializer(msg)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='unread-count')
    def unread_count(self, request):
        """Total unread message count across all rooms."""
        user = request.user
        rooms = ChatRoom.objects.filter(Q(buyer=user) | Q(seller=user))
        total = 0
        for room in rooms:
            total += room.messages.filter(is_read=False).exclude(sender=user).count()
        return Response({'unread_count': total})
