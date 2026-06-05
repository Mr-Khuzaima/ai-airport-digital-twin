import pandas as pd
import numpy as np
import os
import logging
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from typing import List

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SatisfactionDataCleaner:
    """
    Pipeline for Passenger Satisfaction dataset.
    Optimizes for Binary Classification (ML) and Demographic Analysis (Simulation Agent Profiling).
    """
    
    def __init__(self, input_path: str, output_path: str):
        self.input_path = input_path
        self.output_path = output_path
        self.scaler = StandardScaler()
        
    def load_data(self) -> pd.DataFrame:
        logger.info(f"Loading satisfaction data from {self.input_path}...")
        return pd.read_csv(self.input_path)

    def handle_missing_values(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Strategy:
        - Arrival Delay in Minutes is the only column with significant NaNs.
        - We fill with 0, assuming if no delay recorded, the delay was effectively zero.
        """
        logger.info("Handling missing values...")
        df['Arrival Delay in Minutes'] = df['Arrival Delay in Minutes'].fillna(0)
        return df

    def fix_data_types(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Ensures categorical columns are strings and numeric are float64.
        """
        logger.info("Fixing data types...")
        cat_cols = ['Gender', 'Customer Type', 'Type of Travel', 'Class', 'satisfaction']
        for col in cat_cols:
            if col in df.columns:
                df[col] = df[col].astype(str)
        
        # Remove the 'Unnamed: 0' and 'id' if they exist as they are not features
        redundant = ['Unnamed: 0', 'id']
        df = df.drop(columns=[c for c in redundant if c in df.columns])
        
        return df

    def encode_and_scale(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Strategy:
        - One-Hot Encoding for small category sets (Gender, Class, etc.).
        - Scaling Age and Flight Distance.
        """
        logger.info("One-hot encoding and scaling...")
        
        # Binary target encoding
        if 'satisfaction' in df.columns:
            df['satisfaction'] = df['satisfaction'].map({'satisfied': 1, 'neutral or dissatisfied': 0})
            
        # One-hot encoding for multi-class categorical features
        cols_to_encode = ['Gender', 'Customer Type', 'Type of Travel', 'Class']
        df = pd.get_dummies(df, columns=cols_to_encode, drop_first=True)
        
        # Scale numeric features
        numeric_features = ['Age', 'Flight Distance', 'Departure Delay in Minutes', 'Arrival Delay in Minutes']
        df[numeric_features] = self.scaler.fit_transform(df[numeric_features])
        
        return df

    def run_pipeline(self):
        try:
            df = self.load_data()
            df = df.drop_duplicates()
            df = self.handle_missing_values(df)
            df = self.fix_data_types(df)
            df = self.encode_and_scale(df)
            
            os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
            df.to_csv(self.output_path, index=False)
            logger.info(f"Successfully saved cleaned satisfaction data to {self.output_path}")
            
        except Exception as e:
            logger.error(f"Pipeline failed: {e}")
            raise

if __name__ == "__main__":
    INPUT = "datasets/dataset_2_train.csv"
<<<<<<< HEAD
    OUTPUT = "outputs/satisfaction_cleaned.csv"
=======
    OUTPUT = "datasets/processed/satisfaction_cleaned.csv"
>>>>>>> 33975e16b9d24662f05736cae0a148dcbdcc471c
    
    # Check alternate paths
    if not os.path.exists(INPUT) and os.path.exists("../datasets/dataset_2_train.csv"):
        INPUT = "../datasets/dataset_2_train.csv"
<<<<<<< HEAD
        OUTPUT = "../outputs/satisfaction_cleaned.csv"
=======
        OUTPUT = "../datasets/processed/satisfaction_cleaned.csv"
>>>>>>> 33975e16b9d24662f05736cae0a148dcbdcc471c
        
    cleaner = SatisfactionDataCleaner(INPUT, OUTPUT)
    cleaner.run_pipeline()

    print("\n--- TRANSFORMATION SUMMARY (Dataset 2) ---")
    print("1. Missing Arrival Delays filled with 0: Critical for keeping sample size intact.")
    print("2. ID columns dropped: Prevents 'id-leakage' where model memorizes row index.")
    print("3. One-Hot Encoding: Allows linear and distance-based models to interpret 'Class' and 'Gender'.")
    print("4. Target Binarization: Converts satisfaction into a 0/1 signal for classification.")
    print("5. Normalization: Ensures 'Age' and 'Flight Distance' share a similar range.")
