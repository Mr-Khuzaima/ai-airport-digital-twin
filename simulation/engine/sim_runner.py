import simpy
import random
import pandas as pd
import numpy as np
import joblib
import logging
import os
from datetime import datetime, timedelta
try:
    from tensorflow.keras.models import load_model
    HAS_TENSORFLOW = True
except ImportError:
    HAS_TENSORFLOW = False
from typing import List, Dict, Optional

# Configure detailed logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("DigitalTwinEngine")

class MLService:
    """Centralized service for ML model inference."""
    def __init__(self, model_dir: str = "ml_models/saved_models"):
        self.model_dir = model_dir
        try:
            self.delay_model = joblib.load(os.path.join(model_dir, "delay_prediction_model.pkl"))
            self.satisfaction_model = joblib.load(os.path.join(model_dir, "satisfaction_classifier.pkl"))
            if HAS_TENSORFLOW:
                self.traffic_model = load_model(os.path.join(model_dir, "traffic_lstm_model.h5"))
            else:
                self.traffic_model = None
                logger.warning("TensorFlow is not installed. LSTM Traffic Forecaster will use a fallback statistical model.")
            self.traffic_scaler = joblib.load(os.path.join(model_dir, "traffic_scaler.pkl"))
            logger.info("All ML models loaded successfully into Simulation Engine.")
        except Exception as e:
            logger.error(f"Failed to load ML models: {e}")
            raise

    def predict_flight_delay(self, features: Dict) -> float:
        """Calls XGBoost Regressor for delay injection."""
        df = pd.DataFrame([features])
        return float(self.delay_model.predict(df)[0])

    def predict_passenger_satisfaction(self, features: Dict) -> int:
        """Calls XGBoost Classifier for passenger sentiment."""
        df = pd.DataFrame([features])
        return int(self.satisfaction_model.predict(df)[0])

    def get_traffic_load(self) -> int:
        """Calls LSTM for macro-level passenger generation."""
        if HAS_TENSORFLOW and self.traffic_model is not None:
            try:
                # Using a representative sequence for forecasting (12 steps)
                # In production, this would be historical data from the database
                dummy_input = np.zeros((1, 12, 1))
                scaled_pred = self.traffic_model.predict(dummy_input, verbose=0)
                pax_count = self.traffic_scaler.inverse_transform(scaled_pred)[0][0]
                return int(max(pax_count, 100)) # Floor at 100 for simulation viability
            except Exception as e:
                logger.error(f"Error running LSTM prediction: {e}. Using fallback load.")
        
        # Fallback normal distribution for passenger count
        return int(random.normalvariate(150, 30))

class Passenger:
    """Agent representing a traveler with state and satisfaction tracking."""
    def __init__(self, p_id: str, flight: 'Flight'):
        self.p_id = p_id
        self.flight = flight
        self.timestamps = {
            "arrival": 0,
            "checkin_start": 0,
            "checkin_end": 0,
            "security_start": 0,
            "security_end": 0,
            "boarding_start": 0,
            "boarding_end": 0
        }
        self.satisfaction = 1 # 1=Satisfied, 0=Not

class Flight:
    """Entity representing a flight with ML-injected delay."""
    def __init__(self, f_id: str, scheduled_time: float, delay: float):
        self.f_id = f_id
        self.scheduled_time = scheduled_time
        self.actual_time = scheduled_time + delay
        self.delay = delay

class QueueManager:
    """Handles resource allocation and queue metrics."""
    def __init__(self, env: simpy.Environment, name: str, capacity: int):
        self.env = env
        self.name = name
        self.resource = simpy.Resource(env, capacity=capacity)
        self.max_queue_length = 0
        
    def request(self):
        """Monitors queue length before yielding resource."""
        current_queue = len(self.resource.queue)
        if current_queue > self.max_queue_length:
            self.max_queue_length = current_queue
        return self.resource.request()

class Airport:
    """Main System holding resources and processing logic."""
    def __init__(self, env: simpy.Environment, config: Dict, ml: MLService):
        self.env = env
        self.ml = ml
        self.config = config
        
        # Resources (Counters/Lanes)
        self.checkin = QueueManager(env, "Check-in", config.get('checkin_counters', 5))
        self.security = QueueManager(env, "Security", config.get('security_counters', 3))
        self.boarding = QueueManager(env, "Boarding", config.get('boarding_gates', 2))
        
        # Statistics
        self.completed_passengers: List[Passenger] = []
        self.flights: List[Flight] = []

    def passenger_journey(self, passenger: Passenger):
        """Simulation process for the multi-stage passenger flow."""
        passenger.timestamps['arrival'] = self.env.now
        
        # Stage 1: Check-in
        passenger.timestamps['checkin_start'] = self.env.now
        with self.checkin.request() as req:
            yield req
            # Random processing time (3-7 mins)
            yield self.env.timeout(random.uniform(3, 7))
            passenger.timestamps['checkin_end'] = self.env.now

        # Stage 2: Security
        passenger.timestamps['security_start'] = self.env.now
        with self.security.request() as req:
            yield req
            # Random processing time (5-12 mins) + weather impact
            weather_impact = self.config.get('weather_severity', 0) / 10.0
            yield self.env.timeout(random.uniform(5, 12) + weather_impact)
            passenger.timestamps['security_end'] = self.env.now

        # Stage 3: Boarding
        passenger.timestamps['boarding_start'] = self.env.now
        with self.boarding.request() as req:
            yield req
            # Weather can also slow down boarding
            weather_impact = self.config.get('weather_severity', 0) / 20.0
            yield self.env.timeout(random.uniform(1, 3) + weather_impact)
            passenger.timestamps['boarding_end'] = self.env.now

        # Stage 4: Satisfaction Update (ML Call)
        total_wait = (passenger.timestamps['checkin_end'] - passenger.timestamps['checkin_start']) + \
                     (passenger.timestamps['security_end'] - passenger.timestamps['security_start'])
        
        # Mapping real-time state to ML features
        sat_features = {
            'Age': 35, 'Flight Distance': 800, 
            'Departure Delay in Minutes': passenger.flight.delay,
            'Arrival Delay in Minutes': passenger.flight.delay * 0.8,
            'Gender_Male': 1, 'Customer Type_Loyal Customer': 1,
            'Type of Travel_Personal Travel': 0, 'Class_Eco': 1
        }
        passenger.satisfaction = self.ml.predict_passenger_satisfaction(sat_features)
        
        self.completed_passengers.append(passenger)
        logger.info(f"Pax {passenger.p_id} (Flight {passenger.flight.f_id}) completed journey. Satisfied: {passenger.satisfaction}")

def sim_runner(config: Dict):
    """Main entry point for running the Simulation with What-If logic."""
    env = simpy.Environment()
    ml = MLService()
    airport = Airport(env, config, ml)

    # 1. Integration: Traffic Forecast (LSTM) determines passenger load
    base_load = ml.get_traffic_load()
    total_passengers = int(base_load * (1 + config.get('increase_flights_percent', 0) / 100))
    
    # 2. Integration: Flight Generation with Delay Prediction
    def flight_spawner():
        for i in range(max(1, total_passengers // 100)): # Simulating few flights for demo
            # What-If: Apply delay_offset
            base_delay_features = {
                'MONTH': 6, 'DAY_OF_WEEK': 2, 'AIRLINE': 1, 'ORIGIN_AIRPORT': 1,
                'DESTINATION_AIRPORT': 2, 'DISTANCE': 600, 'TAXI_OUT': 0.6,
                'rush_hour': 1, 'is_weekend': 0, 'congestion_score': 0.5
            }
            predicted_delay = ml.predict_flight_delay(base_delay_features)
            final_delay = predicted_delay + config.get('delay_offset_minutes', 0) + config.get('weather_severity', 0) * 0.5
            
            flight = Flight(f"FL-{i}", env.now, final_delay)
            airport.flights.append(flight)
            logger.info(f"Generated Flight {flight.f_id} | ML Delay: {predicted_delay:.1f}m | Final: {final_delay:.1f}m")
            
            # Spawn passengers for this flight
            for p_idx in range(100):
                p = Passenger(f"{flight.f_id}-P{p_idx}", flight)
                env.process(airport.passenger_journey(p))
            
            yield env.timeout(30) # Space flights by 30 mins

    env.process(flight_spawner())
    env.run(until=config.get('sim_duration', 480)) # Default 8 hours

    # Summary Statistics
    avg_sat = np.mean([p.satisfaction for p in airport.completed_passengers]) if airport.completed_passengers else 0
    max_sec_queue = airport.security.max_queue_length
    
    print("\n" + "="*50)
    print(f"  SIMULATION SUMMARY: {config.get('scenario_name', 'Default')}")
    print("="*50)
    print(f"Total Passengers Processed: {len(airport.completed_passengers)}")
    print(f"Average Satisfaction Score: {avg_sat:.2%}")
    print(f"Max Security Queue Size   : {max_sec_queue}")
    print(f"Total Flights Simulated   : {len(airport.flights)}")
    print("="*50 + "\n")
    
    return {
        "avg_satisfaction": float(avg_sat),
        "max_security_queue": int(max_sec_queue),
        "total_processed": len(airport.completed_passengers)
    }

if __name__ == "__main__":
    # Example Baseline Run
    sim_runner({
        "scenario_name": "Baseline",
        "checkin_counters": 10,
        "security_counters": 5,
        "increase_flights_percent": 0,
        "delay_offset_minutes": 0
    })

    # Example What-If Run
    sim_runner({
        "scenario_name": "Stress Test: Reduced Security + 30% Traffic",
        "checkin_counters": 10,
        "security_counters": 2, # Reduced
        "increase_flights_percent": 30, # Increased
        "delay_offset_minutes": 15 # Injected global delay
    })
