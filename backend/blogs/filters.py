import django_filters
from .models import Article, Comment


class ArticleFilter(django_filters.FilterSet):
    """Custom FilterSet for case-insensitive filtering on Articles."""

    # Maps ?username=... to a case-insensitive search on the creator's username
    username = django_filters.CharFilter(
        field_name="creator__username", lookup_expr="icontains"
    )
    title = django_filters.CharFilter(field_name="title", lookup_expr="icontains")

    class Meta:
        model = Article
        fields = ["username", "title"]


class CommentFilter(django_filters.FilterSet):
    """Custom FilterSet for case-insensitive filtering on Comments."""

    username = django_filters.CharFilter(
        field_name="creator__username", lookup_expr="icontains"
    )

    class Meta:
        model = Comment
        fields = ["username"]
