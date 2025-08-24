import django_filters
from students.models import Student  # Or whatever your model is


class StudentFilter(django_filters.FilterSet):
    # This filter allows case-insensitive partial matching for the branch.
    # The URL parameter will be ?branch=...
    branch = django_filters.CharFilter(field_name="branch", lookup_expr="icontains")

    # This filter maps a 'username' URL parameter to the related creator's username.
    # It also uses case-insensitive partial matching.
    # The URL parameter will be ?username=...
    username = django_filters.CharFilter(
        field_name="creator__username", lookup_expr="icontains"
    )

    class Meta:
        model = Student
        # List all fields you want to filter on.
        # The ones defined above will use the custom behavior.
        # Any other fields listed here would get default (exact match) behavior.
        fields = ["branch", "username"]
