import numpy as np
import random
import pandas as pd

def generate_airport_data(n_flights, delay_factor):
    """
    Generates synthetic flight data based on operational parameters.
    Returns a DataFrame of simulated flight events.
    """
    flights = []
    for i in range(n_flights):
        # Base delay logic with random noise
        base_noise = random.uniform(0, 10)
        injected_delay = base_noise + (delay_factor * random.random())
        
        status = "On Time" if injected_delay < 15 else "Delayed"
        
        flights.append({
            "Flight ID": f"AI-{1000 + i}",
            "Delay (min)": round(injected_delay, 1),
            "Status": status
        })
    
    return pd.DataFrame(flights)

def calculate_congestion(n_flights, security_counters):
    """
    Calculates the Airport Congestion Index.
    Ratio of flight load to security throughput capacity.
    """
    # Baseline: 1 counter handles ~10 flights effectively per cycle
    capacity = security_counters * 10
    congestion_index = (n_flights / capacity) * 100
    return round(congestion_index, 1)

def calculate_average_delay(base_delay, delay_factor):
    """
    Simulates the mean delay across the airport hub.
    """
    # Simple linear relationship with stochastic noise
    avg_delay = (base_delay * 0.4) + (delay_factor * 0.7) + random.uniform(0, 3)
    return round(avg_delay, 1)

def calculate_satisfaction(avg_delay, congestion):
    """
    AI model proxy for Passenger Satisfaction.
    Inverse relationship with wait times and crowd density.
    """
    # Penalty calculation
    penalty = (avg_delay * 1.5) + (congestion * 0.4)
    score = 100 - penalty
    return max(0, round(score, 1))

def simulate_flights(n):
    """
    Quick helper for real-time log generation.
    """
    return generate_airport_data(n, 10).head(5)
