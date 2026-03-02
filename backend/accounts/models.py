from django.contrib.auth.models import AbstractUser
from django.db import models

class UserCreation(AbstractUser):
    mobile = models.BigIntegerField(null=True, blank=True)

    def __str__(self):
        return self.username
