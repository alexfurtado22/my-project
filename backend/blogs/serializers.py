from rest_framework import serializers
from .models import Article, Comment


class CommentSerializer(serializers.ModelSerializer):
    creator_username = serializers.CharField(source="creator.username", read_only=True)

    class Meta:
        model = Comment
        fields = "__all__"
        extra_kwargs = {
            "creator": {"read_only": True},  # creator is set by the view
        }


class ArticleSerializer(serializers.ModelSerializer):
    creator_username = serializers.CharField(source="creator.username", read_only=True)
    comments = CommentSerializer(many=True, read_only=True)  # nested comments

    class Meta:
        model = Article
        fields = "__all__"
        extra_kwargs = {
            "creator": {"read_only": True},  # creator is set by the view
        }
