from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from students.models import Student
from .serializers import StudentSerializer
from api.pagination import SmallResultsSetPagination
from api.filters import StudentFilter
from api.permissions import IsOwnerOrReadOnly  # 👈 Import your custom permission


class StudentViewSet(viewsets.ModelViewSet):
    """
    A secure and feature-rich ViewSet for Students that combines advanced
    filtering, global search, and object-level permissions.
    """

    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    pagination_class = SmallResultsSetPagination

    # --- Apply the stronger, object-level permission class ---
    permission_classes = [IsOwnerOrReadOnly]  # 👈 SECURITY FIX

    # --- Full-featured filtering, search, and ordering ---
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = StudentFilter
    search_fields = ["name", "student_id", "branch", "creator__username"]
    ordering_fields = ["created_at", "branch", "creator__username"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """Optimized queryset to prefetch the creator for performance."""
        user = self.request.user
        base_qs = self.queryset.select_related("creator")

        if not user.is_authenticated:
            return base_qs.none()

        if user.is_staff:
            return base_qs

        return base_qs.filter(creator=user)

    def perform_create(self, serializer):
        """Securely assigns the creator on record creation."""
        serializer.save(creator=self.request.user)
