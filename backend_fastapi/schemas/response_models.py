from pydantic import BaseModel
from typing import Dict, Any, Optional

class PredictionResponse(BaseModel):
    predicted_delay_minutes: Optional[float] = None
    satisfied: Optional[int] = None

class SimulationMetrics(BaseModel):
    avg_satisfaction: float
    max_security_queue: int
    total_processed: int

class SimulationResponse(BaseModel):
    simulation_id: str
    status: str
    result: Optional[SimulationMetrics] = None

class WhatIfResponse(BaseModel):
    scenario: str
    metrics: SimulationMetrics
    message: str
