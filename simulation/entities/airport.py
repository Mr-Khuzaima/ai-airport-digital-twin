import simpy
from typing import Dict, List, Optional
from ..services.gate_manager import GateManager
from ..services.queue_manager import QueueManager
from .flight import Flight

class Airport:
    """
    Central Digital Twin orchestrator.
    Manages global capacity, active entities, and shared resources.
    """
    def __init__(self, env: simpy.Environment, config: Dict):
        self.env = env
        self.name = config.get("airport_name", "International Hub")
        self.capacity = config.get("airport_capacity", 1000)
        
        # Managers
        self.gate_manager = GateManager(env, num_gates=config.get("num_gates", 10))
        self.checkin_service = QueueManager(env, "Check-in", config.get("checkin_counters", 5))
        self.security_service = QueueManager(env, "Security", config.get("security_lanes", 3))
        
        # State tracking
        self.active_flights: Dict[str, Flight] = {}
        self.total_passenger_count = 0
        self.logs: List[str] = []

    def register_flight(self, flight: Flight):
        self.active_flights[flight.f_id] = flight
        self.log(f"Flight {flight.f_id} registered at {self.env.now:.1f}")

    def remove_flight(self, flight_id: str):
        if flight_id in self.active_flights:
            del self.active_flights[flight_id]
            self.log(f"Flight {flight_id} departed/removed at {self.env.now:.1f}")

    def log(self, message: str):
        self.logs.append(f"[{self.env.now:.1f}] {message}")

    def get_active_load(self) -> float:
        """Returns airport congestion score (0.0 - 1.0)."""
        return len(self.active_flights) / self.capacity
