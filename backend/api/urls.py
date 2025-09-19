# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet
from .views import StockPredictionView  # ✅ Import the new view
from .views import PredictNextDayAPIView

router = DefaultRouter()
router.register(r"students", StudentViewSet, basename="student")

urlpatterns = [
    path("", include(router.urls)),
    # ✅ Add the new path for the stock prediction view
    path("predict-stock/", StockPredictionView.as_view(), name="predict-stock"),
    path("predict/", PredictNextDayAPIView.as_view(), name="predict-next-day"),
]
