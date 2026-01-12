from .models import UserCreation
from django import forms
class UserCreationForm(forms.ModelForm):
    class Meta:
        model = UserCreation
        fields = ['username', 'email', 'mobile', 'password']
        widgets = {
            'password': forms.PasswordInput(),
        }
        