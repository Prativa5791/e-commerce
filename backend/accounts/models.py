from django.contrib.auth.models import AbstractUser
from django.db import models

class UserCreation(AbstractUser):
    mobile = models.BigIntegerField(null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    is_seller = models.BooleanField(default=False)

    def __str__(self):
        return self.username
