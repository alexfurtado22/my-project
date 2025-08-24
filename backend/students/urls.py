from django.urls import path
from students.views import students


urlpatterns = [
    path("", students),
]
