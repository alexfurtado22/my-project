from django.http import HttpResponse


def students(request):
    students = [{"id": 1, "name": "John Doe", "age": 30}]
    return HttpResponse(students)
