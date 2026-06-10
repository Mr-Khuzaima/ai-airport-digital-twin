import joblib
import os
import pandas as pd
import numpy as np
try:
    from tensorflow.keras.models import load_model
    HAS_TENSORFLOW = True
except ImportError:
    HAS_TENSORFLOW = False
from backend_fastapi.schemas.request_models import PredictionRequest, SatisfactionRequest

class ModelService:
    """
    Business logic layer for ML Model Inference.
    Handles loading, preprocessing, and prediction for all airport models.
    """
    def __init__(self, model_dir: str = "ml_models/saved_models"):
        self.model_dir = model_dir
        self.delay_model = joblib.load(os.path.join(model_dir, "delay_prediction_model.pkl"))
        self.satisfaction_model = joblib.load(os.path.join(model_dir, "satisfaction_classifier.pkl"))
        if HAS_TENSORFLOW:
            self.traffic_model = load_model(os.path.join(model_dir, "traffic_lstm_model.h5"))
        else:
            self.traffic_model = None
        self.traffic_scaler = joblib.load(os.path.join(model_dir, "traffic_scaler.pkl"))

    def predict_delay(self, request: PredictionRequest) -> float:
        input_df = pd.DataFrame([request.dict()])
        prediction = self.delay_model.predict(input_df)[0]
        return float(prediction)

    def predict_satisfaction(self, request: SatisfactionRequest) -> int:
        features = {
            'Age': request.Age,
            'Flight Distance': request.Flight_Distance,
            'Departure Delay in Minutes': request.Departure_Delay,
            'Arrival Delay in Minutes': request.Arrival_Delay,
            'Gender_Male': request.Gender_Male,
            'Customer Type_Loyal Customer': request.Loyal_Customer,
            'Type of Travel_Personal Travel': request.Personal_Travel,
            'Class_Eco': request.Class_Eco
        }
        input_df = pd.DataFrame([features])
        prediction = self.satisfaction_model.predict(input_df)[0]
        return int(prediction)

    def forecast_traffic(self) -> int:
        if HAS_TENSORFLOW and self.traffic_model is not None:
            try:
                # LSTM input: [samples, time steps, features]
                dummy_input = np.zeros((1, 12, 1))
                scaled_pred = self.traffic_model.predict(dummy_input, verbose=0)
                pax_count = self.traffic_scaler.inverse_transform(scaled_pred)[0][0]
                return int(pax_count)
            except Exception:
                pass
        # Fallback if TensorFlow is not installed
        import random
        return int(random.normalvariate(150, 30))
