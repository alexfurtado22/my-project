from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from students.models import Student
from .serializers import StudentSerializer
from api.pagination import SmallResultsSetPagination
from api.filters import StudentFilter
from api.permissions import IsOwnerOrReadOnly  # 👈 Import your custom permission
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TickerSerializer
from django.conf import settings
from .ml_utils import perform_prediction
import warnings
import os
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model

warnings.filterwarnings("ignore")


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


# backend/api/views.py


class StockPredictionView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = TickerSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        ticker = serializer.validated_data["ticker"]

        try:
            result = perform_prediction(ticker)

            # Build URLs for each plot
            plot_urls = {
                key.replace("_path", "_url"): request.build_absolute_uri(
                    f"{settings.MEDIA_URL}{path}"
                )
                for key, path in result["plots"].items()
            }

            response_data = {
                "metrics": result["metrics"],
                "plots": plot_urls,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PredictNextDayAPIView(APIView):
    def get(self, request):
        ticker = request.GET.get("ticker", "MSFT").upper().strip()

        seq_length = 100
        model_path = os.path.join(
            Path(settings.BASE_DIR).parent, "Resources", "stock_prediction_model.keras"
        )

        if not os.path.exists(model_path):
            return Response(
                {"error": f"Model file not found at {model_path}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            # --- 1) Download data ---
            end = datetime.now()
            start = end - timedelta(days=365 * 2)
            df = yf.download(
                ticker, start=start, end=end, auto_adjust=True, progress=False
            )

            if df.empty or len(df) < seq_length:
                return Response(
                    {
                        "error": f"Not enough data for {ticker} to form sequence of {seq_length} days."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # --- 2) Prepare sequence ---
            df = df[["Close"]].dropna()
            scaler = MinMaxScaler(feature_range=(0, 1))
            scaled = scaler.fit_transform(df)
            last_sequence = scaled[-seq_length:]
            x_input = np.reshape(last_sequence, (1, seq_length, 1))

            # --- 3) Load model + predict ---
            model = load_model(model_path)
            predicted_scaled = model.predict(x_input, verbose=0)
            predicted_price = scaler.inverse_transform(predicted_scaled)[0][0]

            # --- 4) Company info + prediction date ---
            info = yf.Ticker(ticker).info
            company_name = info.get("longName", "Unknown Company")
            last_date = df.index[-1]
            prediction_date = last_date + pd.tseries.offsets.BDay(1)

            # --- 5) Return JSON ---
            return Response(
                {
                    "ticker": ticker,
                    "company_name": company_name,
                    "predicted_price": round(float(predicted_price), 2),
                    "prediction_date": prediction_date.strftime("%Y-%m-%d"),
                    "last_close_price": round(df["Close"].iloc[-1], 2),
                    "last_close_date": last_date.strftime("%Y-%m-%d"),
                }
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
