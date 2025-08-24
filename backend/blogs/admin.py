from django.contrib import admin
from .models import Article, Comment


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "creator", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("title", "content")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("article", "creator", "created_at", "updated_at")
    list_filter = ("created_at", "updated_at")
    search_fields = ("content", "creator__username")
