import simpy
from typing import Dict, Optional

class GateManager:
    """
    Infrastructure service for managing flight-to-gate allocations.
    Prevents gate conflicts and monitors infrastructure utilization.
    """
    def __init__(self, env: simpy.Environment, num_gates: int):
        self.env = env
        self.num_gates = num_gates
        self.resource = simpy.Resource(env, capacity=num_gates)
        self.gate_assignments: Dict[str, str] = {} # Flight ID -> Gate ID

    def assign_gate(self, flight_id: str):
        """
        Assigns an available gate to a flight.
        In a real twin, this would involve complex logic (e.g., Gate Size vs Aircraft Type).
        """
        request = self.resource.request()
        return request

    def release_gate(self, flight_id: str):
        """Releases the gate back to the pool."""
        if flight_id in self.gate_assignments:
            del self.gate_assignments[flight_id]

    def get_utilization(self) -> float:
        return self.resource.count / self.num_gates
