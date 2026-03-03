from django.db import models
from django.conf import settings

CATEGORY_CHOICES = [
    ('Electronics', 'Electronics'),
    ('Fashion', 'Fashion'),
    ('Home & Living', 'Home & Living'),
    ('Sports', 'Sports'),
    ('Beauty', 'Beauty'),
    ('Other', 'Other'),
]

BADGE_CHOICES = [
    ('Best Seller', 'Best Seller'),
    ('New', 'New'),
    ('Sale', 'Sale'),
    ('Premium', 'Premium'),
]


class Product(models.Model):
    CATEGORY_CHOICES = CATEGORY_CHOICES  # Make accessible on the class too

    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Other')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    description = models.TextField(blank=True)
    image_url = models.URLField(max_length=500, blank=True)
    rating = models.FloatField(default=0.0)
    reviews_count = models.IntegerField(default=0)
    badge = models.CharField(max_length=20, choices=BADGE_CHOICES, null=True, blank=True)
    in_stock = models.BooleanField(default=True)
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name
