from fastapi import APIRouter
from pydantic import BaseModel
from simulation.engine.sim_runner import sim_runner

router = APIRouter()

class WhatIfRequest(BaseModel):
    scenario_name: str = "What-If Scenario"
    increase_flights_percent: float = 0
    security_counters: int = 5
    delay_offset_minutes: float = 0
    checkin_counters: int = 10
    weather_severity: float = 0

@router.post("/run")
async def run_what_if(data: WhatIfRequest):
    """
    Executes a custom 'What-If' simulation scenario and returns results immediately.
    Ideal for real-time comparison on the dashboard.
    """
    config = data.dict()
    config["sim_duration"] = 480 # Standard 8-hour window
    
    try:
        results = sim_runner(config)
        return {
            "scenario": data.scenario_name,
            "metrics": results,
            "message": "Simulation successfully executed"
        }
    except Exception as e:
        return {"error": str(e)}
