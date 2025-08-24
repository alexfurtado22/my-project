from rest_framework import serializers
from students.models import Student


class StudentSerializer(serializers.ModelSerializer):
    creator_username = serializers.SerializerMethodField()

    class Meta:
        model = Student
        exclude = ["creator"]  # hides the raw FK from API
        extra_kwargs = {"creator": {"read_only": True}}

    def get_creator_username(self, obj):
        # Will not cause extra queries because of select_related("creator")
        return obj.creator.username if obj.creator else None
