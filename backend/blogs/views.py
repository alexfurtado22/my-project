# blogs/views.py
from rest_framework import viewsets
from .models import Article, Comment
from .serializers import ArticleSerializer, CommentSerializer


from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from .filters import ArticleFilter, CommentFilter  # 👈 Import your custom filters


from .permissions import IsOwnerOrReadOnly


class ArticleViewSet(viewsets.ModelViewSet):
    """
    Article CRUD with filtering, searching, ordering,
    and restricted modification to owners only.
    """

    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsOwnerOrReadOnly]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = ArticleFilter  # 👈 USE THE CUSTOM FILTER
    search_fields = ["title", "content"]
    ordering_fields = ["created_at", "title"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return self.queryset.select_related("creator").prefetch_related(
            "comments__creator"
        )

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class CommentViewSet(viewsets.ModelViewSet):
    """
    Comments nested under Articles.
    Only allows modification by owner.
    """

    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsOwnerOrReadOnly]

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = CommentFilter  # 👈 USE THE CUSTOM FILTER
    ordering_fields = ["created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        # Filter comments for the given article_pk from URL
        article_pk = self.kwargs["article_pk"]
        return self.queryset.filter(article_id=article_pk).select_related("creator")

    def perform_create(self, serializer):
        article_pk = self.kwargs["article_pk"]
        serializer.save(creator=self.request.user, article_id=article_pk)
