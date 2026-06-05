import pandas as pd
import numpy as np
import os
import logging
from typing import Optional

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class TrafficDataCleaner:
    """
    Pipeline for Passenger Traffic Time Series.
    Optimizes for LSTM/Prophet Forecasting (ML) and Seasonal Traffic Simulation.
    """
    
    def __init__(self, input_path: str, output_path: str):
        self.input_path = input_path
        self.output_path = output_path
        
    def load_data(self) -> pd.DataFrame:
        logger.info(f"Loading traffic data from {self.input_path}...")
        return pd.read_csv(self.input_path)

    def handle_missing_values(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Strategy:
        - Time series require continuity. We check for missing months.
        - If a month is missing, we could interpolate, but first we check if any 'Passenger Count' is NaN.
        """
        logger.info("Handling missing values...")
        initial_len = len(df)
        df = df.dropna(subset=['Passenger Count', 'Activity Period'])
        if len(df) < initial_len:
            logger.warning(f"Dropped {initial_len - len(df)} rows with missing critical time-series data.")
        return df

    def fix_data_types(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Converts 'Activity Period' (YYYYMM) to proper datetime objects.
        """
        logger.info("Converting activity period to datetime...")
        df['Date'] = pd.to_datetime(df['Activity Period'].astype(str), format='%Y%m')
        
        # Sort by date - critical for time series
        df = df.sort_values('Date')
        
        return df

    def feature_engineering(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Extracts temporal features that help ML models capture seasonality.
        """
        logger.info("Engineering temporal features...")
        df['Year'] = df['Date'].dt.year
        df['Month'] = df['Date'].dt.month
        df['Quarter'] = df['Date'].dt.quarter
        
        return df

    def aggregate_for_simulation(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Aggregates traffic by Date and Region for easier simulation scenario loading.
        """
        logger.info("Aggregating traffic for macro-level simulation...")
        # We keep the raw data but also provide a grouped version in the same file or a separate one
        # Here we just ensure the regions/airlines are cleaned strings
        df['GEO Region'] = df['GEO Region'].str.strip()
        df['Operating Airline'] = df['Operating Airline'].str.strip()
        
        return df

    def run_pipeline(self):
        try:
            df = self.load_data()
            df = df.drop_duplicates()
            df = self.handle_missing_values(df)
            df = self.fix_data_types(df)
            df = self.feature_engineering(df)
            df = self.aggregate_for_simulation(df)
            
            os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
            df.to_csv(self.output_path, index=False)
            logger.info(f"Successfully saved cleaned traffic data to {self.output_path}")
            
        except Exception as e:
            logger.error(f"Pipeline failed: {e}")
            raise

if __name__ == "__main__":
    INPUT = "datasets/dataset_3_passenger_traffic.csv"
<<<<<<< HEAD
    OUTPUT = "outputs/traffic_cleaned.csv"
    
    if not os.path.exists(INPUT) and os.path.exists("../datasets/dataset_3_passenger_traffic.csv"):
        INPUT = "../datasets/dataset_3_passenger_traffic.csv"
        OUTPUT = "../outputs/traffic_cleaned.csv"
=======
    OUTPUT = "datasets/processed/traffic_cleaned.csv"
    
    if not os.path.exists(INPUT) and os.path.exists("../datasets/dataset_3_passenger_traffic.csv"):
        INPUT = "../datasets/dataset_3_passenger_traffic.csv"
        OUTPUT = "../datasets/processed/traffic_cleaned.csv"
>>>>>>> 33975e16b9d24662f05736cae0a148dcbdcc471c
        
    cleaner = TrafficDataCleaner(INPUT, OUTPUT)
    cleaner.run_pipeline()

    print("\n--- TRANSFORMATION SUMMARY (Dataset 3) ---")
    print("1. Activity Period Conversion: Transforms YYYYMM int into DateTime objects for time-aware forecasting.")
    print("2. Temporal Feature Extraction: Creates Month/Year/Quarter columns to capture annual seasonality.")
    print("3. Time-Sorting: Ensures the dataframe is ordered chronologically (required for LSTM training).")
    print("4. String Normalization: Strips whitespace from Regional and Airline names for consistent grouping.")
    print("5. Aggregation Ready: Formats data such that it can be easily sliced for 'International vs Domestic' simulations.")
