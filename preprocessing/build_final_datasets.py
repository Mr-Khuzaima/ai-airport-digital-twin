import pandas as pd
import numpy as np
import os
import logging
from sklearn.model_selection import train_test_split

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class FinalPipeline:
    """
    Final Stage: Consolidates engineered features into specialized datasets
    ready for Model Training and Simulation playback.
    """

    def __init__(self, input_dir: str = "outputs", output_dir: str = "outputs"):
        # We use 'outputs' to maintain consistency with previous steps
        self.input_dir = input_dir
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def prepare_delay_data(self):
        """
        Target: Regression/XGBoost for Delay Prediction.
        """
        logger.info("Preparing Flight Delay model data...")
        path = os.path.join(self.input_dir, "flights_final.csv")
        if os.path.exists(path):
            df = pd.read_csv(path)
            
            # Selection of optimal features for predictive simulation
            features = [
                'MONTH', 'DAY_OF_WEEK', 'AIRLINE', 'ORIGIN_AIRPORT', 'DESTINATION_AIRPORT',
                'DISTANCE', 'TAXI_OUT', 'rush_hour', 'is_weekend', 'congestion_score',
                'ARRIVAL_DELAY' # Target
            ]
            
            # Filter only necessary features and drop any residual NaNs
            final_df = df[features].dropna()
            
            out_path = os.path.join(self.output_dir, "flight_delay_model_data.csv")
            final_df.to_csv(out_path, index=False)
            logger.info(f"Saved Flight Delay data: {out_path}")
        else:
            logger.error(f"Source file not found: {path}")

    def prepare_satisfaction_data(self):
        """
        Target: Classification for Passenger Sentiment.
        Includes Train/Test split for production validation.
        """
        logger.info("Preparing Passenger Satisfaction model data...")
        path = os.path.join(self.input_dir, "satisfaction_final.csv")
        if os.path.exists(path):
            df = pd.read_csv(path)
            
            # The satisfaction dataset is already cleaned and encoded.
            # We ensure all engineered scores are present and rows are clean.
            final_df = df.dropna()
            
            # Save the full ML-ready set
            out_path = os.path.join(self.output_dir, "passenger_satisfaction_model_data.csv")
            final_df.to_csv(out_path, index=False)
            
            # Perform a standard 80/20 split for immediate training readiness
            train, test = train_test_split(final_df, test_size=0.2, random_state=42)
            
            train.to_csv(os.path.join(self.output_dir, "satisfaction_train.csv"), index=False)
            test.to_csv(os.path.join(self.output_dir, "satisfaction_test.csv"), index=False)
            logger.info(f"Saved Satisfaction data (Full/Train/Test) in {self.output_dir}")
        else:
            logger.error(f"Source file not found: {path}")

    def prepare_forecasting_data(self):
        """
        Target: LSTM Time-Series for Traffic Forecasting.
        Ensures strict chronological alignment and aggregation.
        """
        logger.info("Preparing Traffic Forecasting (LSTM) data...")
        path = os.path.join(self.input_dir, "traffic_final.csv")
        if os.path.exists(path):
            df = pd.read_csv(path)
            
            # LSTM needs sequential values. We aggregate by Date to get a clean time-series.
            ts_data = df.groupby('Date').agg({
                'Passenger Count': 'sum',
                'monthly_growth_rate': 'mean',
                'seasonality_index': 'mean',
                'peak_load_indicator': 'max'
            }).reset_index()
            
            # Ensure chronological order is preserved
            ts_data = ts_data.sort_values('Date')
            
            out_path = os.path.join(self.output_dir, "passenger_forecasting_data.csv")
            ts_data.to_csv(out_path, index=False)
            logger.info(f"Saved Forecasting data: {out_path}")
        else:
            logger.error(f"Source file not found: {path}")

    def run(self):
        """Execute the full synthesis pipeline."""
        try:
            self.prepare_delay_data()
            self.prepare_satisfaction_data()
            self.prepare_forecasting_data()
            logger.info("Final dataset synthesis complete.")
        except Exception as e:
            logger.error(f"Synthesis failed: {e}")
            raise

if __name__ == "__main__":
    # Pointing to 'outputs' as the data lake
    pipeline = FinalPipeline(input_dir="outputs", output_dir="outputs")
    pipeline.run()

    print("\n" + "="*50)
    print("  ML-READY DATASETS GENERATED")
    print("="*50)
    print("1. flight_delay_model_data.csv: Optimized for XGBoost Regression.")
    print("2. satisfaction_train/test.csv: Ready for Gradient Boosting Classification.")
    print("3. passenger_forecasting_data.csv: Formatted for LSTM Sequential Training.")
    print("="*50)
