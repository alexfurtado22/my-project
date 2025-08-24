# blogs/urls.py
from rest_framework_nested import routers
from .views import ArticleViewSet, CommentViewSet

router = routers.DefaultRouter()
router.register(r"articles", ArticleViewSet, basename="article")

articles_router = routers.NestedDefaultRouter(router, r"articles", lookup="article")
articles_router.register(r"comments", CommentViewSet, basename="article-comments")

urlpatterns = router.urls + articles_router.urls
