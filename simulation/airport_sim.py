import simpy
import random
import pandas as pd
import numpy as np
import joblib
import logging
import os
from tensorflow.keras.models import load_model
from typing import List, Dict

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(message)s')
logger = logging.getLogger("AirportSim")

class MLIntergrator:
    """Handles loading and inference for the 3 core ML models."""
    def __init__(self, model_dir: str = "ml_models/saved_models"):
        self.model_dir = model_dir
        self.delay_model = joblib.load(os.path.join(model_dir, "delay_prediction_model.pkl"))
        self.satisfaction_model = joblib.load(os.path.join(model_dir, "satisfaction_classifier.pkl"))
        self.traffic_model = load_model(os.path.join(model_dir, "traffic_lstm_model.h5"))
        self.traffic_scaler = joblib.load(os.path.join(model_dir, "traffic_scaler.pkl"))

    def predict_delay(self, flight_features: Dict) -> float:
        df = pd.DataFrame([flight_features])
        # Ensure feature alignment with training
        return self.delay_model.predict(df)[0]

    def predict_satisfaction(self, passenger_features: Dict) -> int:
        df = pd.DataFrame([passenger_features])
        return self.satisfaction_model.predict(df)[0]

    def get_traffic_forecast(self) -> float:
        # Simplified: Use a dummy sequence of 12 steps for the LSTM demo
        # In production, this would pull the last 12 months from the DB
        dummy_seq = np.zeros((1, 12, 1))
        pred = self.traffic_model.predict(dummy_seq, verbose=0)
        return self.traffic_scaler.inverse_transform(pred)[0][0]

class Passenger:
    """Individual agent in the simulation."""
    def __init__(self, p_id, flight):
        self.p_id = p_id
        self.flight = flight
        self.arrival_time = 0
        self.wait_checkin = 0
        self.wait_security = 0
        self.wait_boarding = 0
        self.satisfied = 1 # Initial state

class Flight:
    """Flight event with ML-injected delay."""
    def __init__(self, f_id, scheduled_time, delay):
        self.f_id = f_id
        self.scheduled_time = scheduled_time
        self.actual_time = scheduled_time + delay
        self.passengers = []

class AirportSimulation:
    """The Discrete Event Simulation Engine."""
    def __init__(self, env, num_checkin, num_security, num_boarding, ml_tools):
        self.env = env
        self.checkin = simpy.Resource(env, num_checkin)
        self.security = simpy.Resource(env, num_security)
        self.boarding = simpy.Resource(env, num_boarding)
        self.ml = ml_tools
        self.stats = {"wait_times": [], "satisfaction": []}

    def process_passenger(self, passenger):
        """The life-cycle of a passenger in the airport."""
        passenger.arrival_time = self.env.now
        
        # 1. Check-in
        with self.checkin.request() as request:
            yield request
            wait = self.env.now - passenger.arrival_time
            passenger.wait_checkin = wait
            yield self.env.timeout(random.uniform(2, 5)) # Processing time

        # 2. Security
        start_sec = self.env.now
        with self.security.request() as request:
            yield request
            passenger.wait_security = self.env.now - start_sec
            yield self.env.timeout(random.uniform(5, 10))

        # 3. Boarding
        start_board = self.env.now
        with self.boarding.request() as request:
            yield request
            passenger.wait_boarding = self.env.now - start_board
            yield self.env.timeout(random.uniform(1, 3))

        # 4. ML Satisfaction Check
        # Generate dummy features for satisfaction model based on wait times
        p_features = {
            'Age': 30, 'Flight Distance': 1000, 
            'Departure Delay in Minutes': passenger.flight.actual_time - passenger.flight.scheduled_time,
            'Arrival Delay in Minutes': 10,
            'Gender_Male': 1, 'Customer Type_Loyal Customer': 1,
            'Type of Travel_Personal Travel': 0, 'Class_Eco': 1
            # Note: In real sim, we'd map more features from the cleaned dataset schema
        }
        passenger.satisfied = self.ml.predict_satisfaction(p_features)
        
        self.stats["wait_times"].append(passenger.wait_checkin + passenger.wait_security)
        self.stats["satisfaction"].append(passenger.satisfied)
        logger.info(f"Passenger {passenger.p_id} boarded. Wait: {passenger.wait_security:.1f}m. Happy: {passenger.satisfied}")

def flight_generator(env, airport, ml):
    """Generates flight arrivals and their passengers."""
    f_id = 0
    while True:
        # Use ML to predict delay for this flight context
        f_features = {
            'MONTH': 6, 'DAY_OF_WEEK': 1, 'AIRLINE': 1, 
            'ORIGIN_AIRPORT': 1, 'DESTINATION_AIRPORT': 2,
            'DISTANCE': 500, 'TAXI_OUT': 0.5, 'rush_hour': 1, 
            'is_weekend': 0, 'congestion_score': 0.8
        }
        delay = ml.predict_delay(f_features)
        
        # Create flight
        sched_time = env.now + random.uniform(30, 60)
        flight = Flight(f"FL{f_id}", sched_time, delay)
        logger.info(f"Flight {flight.f_id} scheduled for {flight.scheduled_time:.1f}. Predicted Delay: {delay:.1f}m")

        # Generate passengers based on traffic forecast
        num_pax = int(ml.get_traffic_forecast() / 100) # Scaling for simulation speed
        for i in range(num_pax):
            p = Passenger(f"P{f_id}-{i}", flight)
            env.process(airport.process_passenger(p))
        
        f_id += 1
        yield env.timeout(60) # New flight every hour

def run_simulation(config):
    """Entry point for What-If scenarios."""
    print("\n" + "="*50)
    print(f"RUNNING SIMULATION: {config['name']}")
    print("="*50)
    
    env = simpy.Environment()
    ml = MLIntergrator()
    airport = AirportSimulation(
        env, 
        num_checkin=config['checkin_counters'], 
        num_security=config['security_lanes'], 
        num_boarding=5, 
        ml_tools=ml
    )
    
    env.process(flight_generator(env, airport, ml))
    env.run(until=config['duration'])
    
    avg_wait = np.mean(airport.stats["wait_times"])
    sat_rate = np.mean(airport.stats["satisfaction"]) * 100
    print(f"\nRESULTS for {config['name']}:")
    print(f"Average Wait Time: {avg_wait:.2f} minutes")
    print(f"Passenger Satisfaction Rate: {sat_rate:.1f}%")

if __name__ == "__main__":
    # Scenario 1: Baseline
    run_simulation({
        "name": "Baseline Operations",
        "checkin_counters": 10,
        "security_lanes": 5,
        "duration": 300 # 5 hours
    })

    # Scenario 2: Reduced Resources (What-If)
    run_simulation({
        "name": "Reduced Security (Stress Test)",
        "checkin_counters": 10,
        "security_lanes": 2, # Reduced from 5
        "duration": 300
    })
