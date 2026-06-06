import simpy
import logging

class QueueManager:
    """
    Advanced Resource Manager for SimPy.
    Supports Priority Queueing for Emergency/VIP flights and tracks bottlenecks.
    """
    def __init__(self, env: simpy.Environment, name: str, capacity: int):
        self.env = env
        self.name = name
        self.capacity = capacity
        # Use PriorityResource to support emergency flights or priority boarding
        self.resource = simpy.PriorityResource(env, capacity=capacity)
        
        # Metrics for Digital Twin Analytics
        self.max_queue_length = 0
        self.total_wait_time = 0.0
        self.processed_agents = 0

    def request(self, priority: int = 1):
        """
        Request the resource. 
        Lower priority value = higher priority (0 is highest).
        """
        # Capture queue metrics before entering
        current_q = len(self.resource.queue)
        if current_q > self.max_queue_length:
            self.max_queue_length = current_q
            
        return self.resource.request(priority=priority)

    def report_metrics(self) -> dict:
        return {
            "name": self.name,
            "max_queue": self.max_queue_length,
            "avg_wait": self.total_wait_time / max(1, self.processed_agents),
            "throughput": self.processed_agents
        }
