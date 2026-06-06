from dataclasses import dataclass, field
from typing import Dict

class Passenger:
    """
    Passenger agent with real-time state and satisfaction tracking.
    Stores historical wait times for ML re-training and feature engineering.
    """
    def __init__(self, p_id: str, flight_id: str, arrival_time: float):
        self.p_id = p_id
        self.flight_id = flight_id
        self.arrival_time = arrival_time
        self.current_stage = "ARRIVED"
        self.satisfaction_score = 1.0 # Normalized 0.0 to 1.0
        
        # Performance tracking
        self.stage_timestamps = {}
        self.wait_times: Dict[str, float] = {
            "checkin": 0.0,
            "security": 0.0,
            "boarding": 0.0
        }

    def start_stage(self, stage_name: str, time: float):
        self.current_stage = stage_name.upper()
        self.stage_timestamps[f"{stage_name}_start"] = time

    def end_stage(self, stage_name: str, time: float):
        start_time = self.stage_timestamps.get(f"{stage_name}_start", time)
        self.wait_times[stage_name] = time - start_time
        self.stage_timestamps[f"{stage_name}_end"] = time

    def get_total_wait(self) -> float:
        return sum(self.wait_times.values())

    def __repr__(self):
        return f"<Passenger {self.p_id} | Stage: {self.current_stage} | Wait: {self.get_total_wait():.1f}m>"
