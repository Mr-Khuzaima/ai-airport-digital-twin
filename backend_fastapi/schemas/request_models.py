from pydantic import BaseModel, Field
from typing import Optional

class DelayInput(BaseModel):
    # Features for Delay Prediction
    MONTH: int = Field(..., ge=1, le=12)
    DAY_OF_WEEK: int = Field(..., ge=1, le=7)
    AIRLINE: int
    ORIGIN_AIRPORT: int
    DESTINATION_AIRPORT: int
    DISTANCE: float
    TAXI_OUT: float
    rush_hour: int = Field(..., ge=0, le=1)
    is_weekend: int = Field(..., ge=0, le=1)
    congestion_score: float = Field(..., ge=0, le=1)

class SatisfactionInput(BaseModel):
    Age: int
    Flight_Distance: float
    Departure_Delay: float
    Arrival_Delay: float
    Gender_Male: int
    Loyal_Customer: int
    Personal_Travel: int
    Class_Eco: int

class PredictionRequest(DelayInput):
    """Alias for backward compatibility if needed."""
    pass

class SatisfactionRequest(SatisfactionInput):
    """Alias for backward compatibility if needed."""
    pass

class SimulationRequest(BaseModel):
    scenario_name: str = "Baseline"
    sim_duration: int = 480 # 8 hours

class WhatIfRequest(BaseModel):
    scenario_name: str = "What-If Scenario"
    increase_flights_percent: float = 0.0
    security_counters: int = 5
    delay_offset_minutes: float = 0.0
    checkin_counters: int = 10
    sim_duration: int = 480
