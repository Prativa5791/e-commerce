from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    readonly_fields = ['price_at_purchase']
    extra = 1

# orders/admin.py

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    readonly_fields = ['total_price', 'ordered_at']

    def save_related(self, request, form, formsets, change):
        # 1. Save the Order and the Items first
        super().save_related(request, form, formsets, change)
        
        # 2. Calculate the total from the items
        running_total = 0
        order = form.instance
        
        for item in order.items.all():
            # Automatically grab the price from the Product if not set
            if not item.price_at_purchase:
                item.price_at_purchase = item.product.price
                item.save()
            running_total += (item.price_at_purchase * item.quantity)
        
        # 3. Save the final total back to the order
        order.total_price = running_total
        order.save()