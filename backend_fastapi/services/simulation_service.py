import uuid
from typing import Dict, Any
from simulation.engine.sim_runner import sim_runner
from backend_fastapi.schemas.request_models import SimulationRequest, WhatIfRequest

class SimulationService:
    """
    Business logic layer for Simulation Orchestration.
    Wraps the SimPy engine and manages background state.
    """
    def __init__(self):
        # In-memory store (Replace with Redis in production)
        self.sim_store: Dict[str, Any] = {}

    def start_simulation(self, request: SimulationRequest) -> str:
        sim_id = str(uuid.uuid4())
        config = {
            "scenario_name": request.scenario_name,
            "sim_duration": request.sim_duration,
            "checkin_counters": 10,
            "security_counters": 5,
            "increase_flights_percent": 0,
            "delay_offset_minutes": 0
        }
        
        self.sim_store[sim_id] = {"status": "RUNNING", "config": config}
        
        # This will be called by a background task in the route
        return sim_id

    def execute_simulation_task(self, sim_id: str):
        """Heavy-lifting simulation execution."""
        if sim_id in self.sim_store:
            config = self.sim_store[sim_id]["config"]
            result = sim_runner(config)
            self.sim_store[sim_id]["status"] = "COMPLETED"
            self.sim_store[sim_id]["result"] = result

    def run_what_if_scenario(self, request: WhatIfRequest) -> Dict[str, Any]:
        """Direct execution for synchronous What-If responses."""
        config = request.dict()
        results = sim_runner(config)
        return {
            "scenario": request.scenario_name,
            "metrics": results,
            "message": "What-If analysis successfully completed."
        }

    def get_simulation_state(self, sim_id: str) -> Optional[Dict[str, Any]]:
        return self.sim_store.get(sim_id)
