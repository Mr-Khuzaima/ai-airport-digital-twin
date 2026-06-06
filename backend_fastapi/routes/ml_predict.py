from fastapi import APIRouter, HTTPException
import joblib
import os
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
from backend_fastapi.schemas.request_models import DelayInput, SatisfactionInput

router = APIRouter()

# Model paths
MODEL_DIR = "ml_models/saved_models"
DELAY_MODEL_PATH = os.path.join(MODEL_DIR, "delay_prediction_model.pkl")
SATISFACTION_MODEL_PATH = os.path.join(MODEL_DIR, "satisfaction_classifier.pkl")

# Load models at startup
try:
    delay_model = joblib.load(DELAY_MODEL_PATH)
    satisfaction_model = joblib.load(SATISFACTION_MODEL_PATH)
except Exception as e:
    print(f"Error loading ML models: {e}")

@router.post("/delay")
async def predict_delay(data: DelayInput):
    """Predicts flight arrival delay based on operational context."""
    try:
        input_df = pd.DataFrame([data.dict()])
        # Rename columns if needed to match training set exactly
        prediction = delay_model.predict(input_df)[0]
        return {"predicted_delay_minutes": float(prediction)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/satisfaction")
async def predict_satisfaction(data: SatisfactionInput):
    """Predicts passenger satisfaction (0=Unhappy, 1=Happy)."""
    try:
        # Map pydantic field names to model feature names if they differ
        features = {
            'Age': data.Age,
            'Flight Distance': data.Flight_Distance,
            'Departure Delay in Minutes': data.Departure_Delay,
            'Arrival Delay in Minutes': data.Arrival_Delay,
            'Gender_Male': data.Gender_Male,
            'Customer Type_Loyal Customer': data.Loyal_Customer,
            'Type of Travel_Personal Travel': data.Personal_Travel,
            'Class_Eco': data.Class_Eco
        }
        input_df = pd.DataFrame([features])
        prediction = satisfaction_model.predict(input_df)[0]
        return {"satisfied": int(prediction)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
