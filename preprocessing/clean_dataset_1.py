import pandas as pd
import numpy as np
import os
import logging
from sklearn.preprocessing import LabelEncoder, StandardScaler
from typing import List, Tuple

# Setup logging for production traceability
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class FlightDataCleaner:
    """
    Production-grade pipeline for cleaning Flight Operations data.
    Focuses on preparing data for Delay Prediction (ML) and Queue Modeling (Simulation).
    """
    
    def __init__(self, input_path: str, output_path: str):
        self.input_path = input_path
        self.output_path = output_path
        self.label_encoders = {}
        self.scaler = StandardScaler()
        
    def load_data(self) -> pd.DataFrame:
        logger.info(f"Loading dataset from {self.input_path}...")
        # In a real production environment with 500MB+, we might use dask or chunks
        # For this scope, we use pandas with optimized dtypes
        return pd.read_csv(self.input_path, low_memory=False)

    def handle_missing_values(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Strategy:
        - Drop rows where critical target info (ARRIVAL_DELAY) is missing.
        - Fill minor missing values in TAXI_OUT/IN with median (robust to outliers).
        - Cancellation reasons are filled with 'N/A' as they are categorical.
        """
        logger.info("Handling missing values...")
        
        # Drop rows with missing arrival delay as it's often the target for ML
        df = df.dropna(subset=['ARRIVAL_DELAY'])
        
        # Fill taxi times with median
        df['TAXI_OUT'] = df['TAXI_OUT'].fillna(df['TAXI_OUT'].median())
        df['TAXI_IN'] = df['TAXI_IN'].fillna(df['TAXI_IN'].median())
        
        # Fill air time based on distance/speed proxy or simply median for simulation baseline
        df['AIR_TIME'] = df['AIR_TIME'].fillna(df['AIR_TIME'].median())
        
        # Fill delay components with 0 (if no delay reported, delay is 0)
        delay_cols = ['AIR_SYSTEM_DELAY', 'SECURITY_DELAY', 'AIRLINE_DELAY', 'LATE_AIRCRAFT_DELAY', 'WEATHER_DELAY']
        df[delay_cols] = df[delay_cols].fillna(0)
        
        return df

    def fix_types_and_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Fixes datetime objects and removes redundant columns.
        """
        logger.info("Fixing data types and feature engineering...")
        
        # Create a consolidated Timestamp for time-series analysis in simulation
        df['SCHEDULED_DEPARTURE_DT'] = pd.to_datetime(
            df[['YEAR', 'MONTH', 'DAY']].assign(hour=df['SCHEDULED_DEPARTURE'] // 100, 
                                               minute=df['SCHEDULED_DEPARTURE'] % 100),
            errors='coerce'
        )
        
        # Drop rows with invalid dates (rare)
        df = df.dropna(subset=['SCHEDULED_DEPARTURE_DT'])
        
        return df

    def encode_and_scale(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Strategy:
        - Label Encoding for high-cardinality airports/airlines (efficient for XGBoost).
        - Scaling numeric features for linear models or neural networks.
        """
        logger.info("Encoding categorical variables and scaling numeric features...")
        
        categorical_cols = ['AIRLINE', 'ORIGIN_AIRPORT', 'DESTINATION_AIRPORT']
        for col in categorical_cols:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))
            self.label_encoders[col] = le
            
        numeric_cols = ['DISTANCE', 'TAXI_OUT', 'SCHEDULED_TIME']
        df[numeric_cols] = self.scaler.fit_transform(df[numeric_cols])
        
        return df

    def run_pipeline(self):
        """
        Executes the full cleaning workflow.
        """
        try:
            df = self.load_data()
            df = df.drop_duplicates()
            df = self.handle_missing_values(df)
            df = self.fix_types_and_features(df)
            df = self.encode_and_scale(df)
            
            # Ensure output directory exists
            os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
            
            df.to_csv(self.output_path, index=False)
            logger.info(f"Successfully saved cleaned data to {self.output_path}")
            
        except Exception as e:
            logger.error(f"Pipeline failed: {e}")
            raise

if __name__ == "__main__":
    INPUT = "datasets/dataset_1_flights.csv"
    OUTPUT = "outputs/flights_cleaned.csv"
    
    # Check alternate paths
    if not os.path.exists(INPUT) and os.path.exists("../datasets/dataset_1_flights.csv"):
        INPUT = "../datasets/dataset_1_flights.csv"
        OUTPUT = "../outputs/flights_cleaned.csv"
        
    cleaner = FlightDataCleaner(INPUT, OUTPUT)
    cleaner.run_pipeline()

    print("\n--- TRANSFORMATION SUMMARY (Dataset 1) ---")
    print("1. Rows with missing ARRIVAL_DELAY dropped: Essential for supervised learning targets.")
    print("2. TAXI_IN/OUT medians applied: Prevents bias in simulation queue wait-time calculations.")
    print("3. Datetime synthesis: Converts Year/Month/Day/Time into a single object for scheduling simulations.")
    print("4. Label Encoding: Reduces memory footprint for high-cardinality airport IDs.")
    print("5. StandardScaler: Ensures 'Distance' doesn't numerically dominate 'Taxi Time' in ML models.")
