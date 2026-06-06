from enum import Enum
from dataclasses import dataclass, field
from typing import List, Optional

class FlightStatus(Enum):
    SCHEDULED = "SCHEDULED"
    ARRIVED = "ARRIVED"
    BOARDING = "BOARDING"
    DEPARTED = "DEPARTED"
    DELAYED = "DELAYED"
    CANCELLED = "CANCELLED"

class Flight:
    """
    Production-grade Flight entity.
    Tracks state, delays, and congestion impact for the Digital Twin.
    """
    def __init__(self, f_id: str, scheduled_time: float, base_delay: float = 0.0):
        self.f_id = f_id
        self.scheduled_time = scheduled_time
        self.delay = base_delay
        self.status = FlightStatus.SCHEDULED
        self.gate_id: Optional[str] = None
        self.passengers: List = []
        self.congestion_impact = 0.0 # Calculated metric based on airport load

    @property
    def actual_time(self) -> float:
        return self.scheduled_time + self.delay

    def update_status(self, new_status: FlightStatus):
        self.status = new_status

    def inject_delay(self, minutes: float):
        self.delay += minutes
        if self.delay > 0:
            self.status = FlightStatus.DELAYED

    def __repr__(self):
        return f"<Flight {self.f_id} | Status: {self.status.value} | Actual: {self.actual_time:.1f}>"
