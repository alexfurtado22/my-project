from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UserProfile, Student


@admin.register(UserProfile)
class CustomUserAdmin(UserAdmin):
    model = UserProfile

    # Customize list display etc
    list_display = ("username", "email", "is_staff", "is_active")
    list_filter = ("is_staff", "is_active")
    search_fields = ("username", "email")
    ordering = ("username",)

    # Override fieldsets: copy default and make changes if needed
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "email")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "email", "password1", "password2"),
            },
        ),
    )


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("student_id", "name", "branch", "creator")
    search_fields = ("student_id", "name", "branch", "creator__username")
    list_filter = ("branch",)
