from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class UserProfile(AbstractUser):
    email = models.EmailField(
        unique=True, verbose_name="Email address", help_text="Required. Must be unique."
    )

    USERNAME_FIELD = "username"  # Keep username as login field
    REQUIRED_FIELDS = ["email"]  # Email required for superusers

    @property
    def student_count(self):
        # Avoid None if no related name set
        return getattr(self, "students", []).count()

    def __str__(self):
        return f"{self.username} ({self.email})"


class Student(models.Model):
    student_id = models.CharField(max_length=10)
    name = models.CharField(max_length=50)
    branch = models.CharField(max_length=50)
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="students"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
