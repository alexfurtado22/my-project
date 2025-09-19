# backend/api/ml_utils.py

import warnings
import yfinance as yf
from datetime import datetime
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
from django.conf import settings
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model
from pathlib import Path
from sklearn.metrics import (
    mean_squared_error,
    r2_score,
    mean_absolute_error,
    mean_absolute_percentage_error,
)

# Setup
warnings.filterwarnings("ignore")
plt.switch_backend("Agg")
sns.set_theme(style="whitegrid", palette="muted", font_scale=1.2)


def perform_prediction(ticker: str) -> dict:
    try:
        # --- Parameters ---
        seq_length = 100
        model_path = os.path.join(
            Path(settings.BASE_DIR).parent, "Resources", "stock_prediction_model.keras"
        )

        # --- 1. Download Data ---
        now = datetime.now()
        start = datetime(now.year - 10, now.month, now.day)
        df = yf.download(ticker, start=start, end=now, auto_adjust=True, progress=False)
        if df.empty:
            raise ValueError(f"No data found for ticker: {ticker}")

        close_prices = df["Close"].values.reshape(-1, 1)

        # --- 2. Scale Data ---
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(close_prices)

        # --- 3. Load Model ---
        model = load_model(model_path)

        # --- 4. Prepare Data ---
        x_data, y_data = [], []
        for i in range(seq_length, len(scaled_data)):
            x_data.append(scaled_data[i - seq_length : i, 0])
            y_data.append(scaled_data[i, 0])

        x_data = np.array(x_data).reshape(-1, seq_length, 1)
        y_data = np.array(y_data)

        # --- 5. Predict ---
        predicted_scaled = model.predict(x_data)
        predicted_prices = scaler.inverse_transform(predicted_scaled).flatten()
        actual_prices = scaler.inverse_transform(y_data.reshape(-1, 1)).flatten()

        # --- 6. Metrics ---
        mse = mean_squared_error(actual_prices, predicted_prices)
        rmse = np.sqrt(mse)
        r2 = r2_score(actual_prices, predicted_prices)

        metrics = {
            "mse": round(mse, 4),
            "rmse": round(rmse, 4),
            "r2": round(r2, 4),
        }

        # --- 7. Save Plots ---
        output_dir = os.path.join(settings.MEDIA_ROOT, "plots", ticker)
        os.makedirs(output_dir, exist_ok=True)

        plot_paths = {}

        # 1) Prediction Plot
        plt.figure(figsize=(14, 7))
        sns.lineplot(
            x=df.index[seq_length:], y=actual_prices, label="Actual", color="blue"
        )
        sns.lineplot(
            x=df.index[seq_length:],
            y=predicted_prices,
            label="Predicted",
            color="red",
            linestyle="--",
        )
        plt.title(f"{ticker} Stock Price Prediction")
        plt.xlabel("Date")
        plt.ylabel("Price (USD)")
        plt.legend()
        plt.tight_layout()
        prediction_path = os.path.join(output_dir, "prediction_plot.png")
        plt.savefig(prediction_path)
        plt.close()
        plot_paths["prediction_plot_path"] = f"plots/{ticker}/prediction_plot.png"

        # 2) Residuals Plot
        residuals = actual_prices - predicted_prices
        plt.figure(figsize=(14, 5))
        sns.lineplot(x=df.index[seq_length:], y=residuals, color="purple")
        plt.axhline(0, color="black", linestyle="--")
        plt.title(f"{ticker} Residuals (Actual - Predicted)")
        plt.xlabel("Date")
        plt.ylabel("Residual (USD)")
        plt.tight_layout()
        residuals_path = os.path.join(output_dir, "residuals_plot.png")
        plt.savefig(residuals_path)
        plt.close()
        plot_paths["residuals_plot_path"] = f"plots/{ticker}/residuals_plot.png"

        # 3) Residuals Distribution
        plt.figure(figsize=(10, 5))
        sns.histplot(
            residuals, kde=True, bins=30, color="teal", edgecolor="black", alpha=0.6
        )
        plt.axvline(0, color="red", linestyle="--", linewidth=2, label="Zero Error")
        plt.title(f"{ticker} Residuals Distribution")
        plt.xlabel("Residual (USD)")
        plt.ylabel("Frequency")
        plt.legend()
        plt.tight_layout()
        dist_path = os.path.join(output_dir, "residuals_distribution.png")
        plt.savefig(dist_path)
        plt.close()
        plot_paths["residuals_distribution_path"] = (
            f"plots/{ticker}/residuals_distribution.png"
        )

        return {"metrics": metrics, "plots": plot_paths}

    except Exception as e:
        raise e
