from django.db import models

# Create your models here.
class Product(models.Model):
    product = models.CharField(max_length=10)