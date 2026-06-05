import pandas as pd
import numpy as np
import os
import logging
from typing import Optional

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class FeatureEngineer:
    """
    Advanced Feature Engineering module for AI Airport Digital Twin.
    Generates high-signal features for ML models and variables for What-If simulation scenarios.
    """

    def __init__(self, output_dir: str = "outputs"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def engineer_flight_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Processes Dataset 1 (Flights).
        Focus: Operational bottlenecks and temporal patterns.
        """
        logger.info("Engineering Flight features...")
        
        # 1. rush_hour (Sim: Helps model peak staff requirement)
        # Assuming SCHEDULED_DEPARTURE is in HHMM format (as per standard aviation datasets)
        # If it was scaled by the cleaner, we'd need the raw, but let's assume raw or reconstructed
        if 'SCHEDULED_DEPARTURE' in df.columns:
            # Re-extract hour if needed, or use the DT column if we kept it
            hour = (df['SCHEDULED_DEPARTURE'] // 100).astype(int)
            df['rush_hour'] = ((hour >= 7) & (hour <= 10)) | ((hour >= 16) & (hour <= 19))
            df['rush_hour'] = df['rush_hour'].astype(int)

        # 2. total_delay (Sim: KPI for airport performance)
        if 'DEPARTURE_DELAY' in df.columns and 'ARRIVAL_DELAY' in df.columns:
            df['total_delay'] = df['DEPARTURE_DELAY'] + df['ARRIVAL_DELAY']

        # 3. is_weekend (Sim: Captures leisure vs business traveler behavior)
        if 'DAY_OF_WEEK' in df.columns:
            # 1=Mon, 7=Sun or 0=Sun, 6=Sat depends on source, usually 6,7 are weekends
            df['is_weekend'] = df['DAY_OF_WEEK'].isin([6, 7]).astype(int)

        # 4. congestion_score (Sim: Proxy for queue length and resource pressure)
        # Calculation: Number of flights at the same origin airport in the same hour
        if 'ORIGIN_AIRPORT' in df.columns and 'SCHEDULED_DEPARTURE' in df.columns:
            df['hour'] = df['SCHEDULED_DEPARTURE'] // 100
            congestion = df.groupby(['ORIGIN_AIRPORT', 'YEAR', 'MONTH', 'DAY', 'hour']).size().reset_index(name='flights_per_hour')
            df = df.merge(congestion, on=['ORIGIN_AIRPORT', 'YEAR', 'MONTH', 'DAY', 'hour'], how='left')
            # Normalize to 0-1 scale based on max capacity observed
            df['congestion_score'] = df['flights_per_hour'] / df['flights_per_hour'].max()
            df.drop(columns=['hour', 'flights_per_hour'], inplace=True)

        return df

    def engineer_satisfaction_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Processes Dataset 2 (Satisfaction).
        Focus: Human factors and service sensitivity.
        """
        logger.info("Engineering Satisfaction features...")

        # 1. service_quality_score (Sim: Aggregated agent happiness factor)
        service_cols = [col for col in df.columns if any(x in col for x in ['service', 'Ease', 'Food', 'Cleanliness', 'comfort'])]
        if service_cols:
            df['service_quality_score'] = df[service_cols].mean(axis=1)

        # 2. delay_impact_score (Sim: Weighting factor for how much delay hurts the agent)
        # Logic: Longer flights might make a short delay more tolerable, or vice versa
        if 'Arrival Delay in Minutes' in df.columns and 'Flight Distance' in df.columns:
            # Avoid division by zero
            df['delay_impact_score'] = df['Arrival Delay in Minutes'] / (df['Flight Distance'] + 1)

        # 3. customer_tolerance_index (Sim: Interaction between loyalty and patience)
        # Loyal customers (Customer Type) might have higher/lower tolerance
        if 'Customer Type_Loyal Customer' in df.columns and 'service_quality_score' in df.columns:
            df['customer_tolerance_index'] = df['service_quality_score'] * (df['Customer Type_Loyal Customer'] + 1)

        return df

    def engineer_traffic_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Processes Dataset 3 (Traffic).
        Focus: Macro trends and load forecasting.
        """
        logger.info("Engineering Traffic features...")

        # 1. monthly_growth_rate (Sim: Long-term expansion planning)
        if 'Passenger Count' in df.columns:
            # Ensure chronological order (should be handled by cleaner, but double check)
            df = df.sort_values('Date')
            df['monthly_growth_rate'] = df['Passenger Count'].pct_change().fillna(0)

        # 2. seasonality_index (Sim: Dynamic scaling of counters/staff)
        if 'Passenger Count' in df.columns and 'Month' in df.columns:
            monthly_avg = df.groupby('Month')['Passenger Count'].transform('mean')
            df['seasonality_index'] = df['Passenger Count'] / monthly_avg

        # 3. peak_load_indicator (Sim: Alert system for 'stress-test' scenarios)
        if 'Passenger Count' in df.columns:
            threshold = df['Passenger Count'].quantile(0.9)
            df['peak_load_indicator'] = (df['Passenger Count'] > threshold).astype(int)

        return df

    def run_all(self):
        """
        Loads cleaned data, engineers features, and saves final versions.
        """
        # Mapping input files to their engineering methods
        tasks = [
            ("outputs/flights_cleaned.csv", self.engineer_flight_features, "flights_final.csv"),
            ("outputs/satisfaction_cleaned.csv", self.engineer_satisfaction_features, "satisfaction_final.csv"),
            ("outputs/traffic_cleaned.csv", self.engineer_traffic_features, "traffic_final.csv")
        ]

        for input_file, func, output_name in tasks:
            if os.path.exists(input_file):
                df = pd.read_csv(input_file)
                df = func(df)
                out_path = os.path.join(self.output_dir, output_name)
                df.to_csv(out_path, index=False)
                logger.info(f"Saved: {out_path}")
            else:
                logger.warning(f"File not found: {input_file}. Please run cleaning scripts first.")

if __name__ == "__main__":
    # Note: Using 'outputs' to maintain consistency with the project's existing structure
    # as per previous system corrections.
    engineer = FeatureEngineer(output_dir="outputs")
    engineer.run_all()

    print("\n" + "="*50)
    print("  FEATURE RATIONALE FOR DIGITAL TWIN")
    print("="*50)
    print("1. rush_hour & congestion_score: Critical for 'What-If' scenarios. Allows users to ")
    print("   simulate what happens when traffic doubles during peak hours.")
    print("2. customer_tolerance_index: Helps the Simulation Engine decide which passengers ")
    print("   are likely to miss connections or complain in the 'Virtual Airport'.")
    print("3. seasonality_index: Drives the macro-demand forecast, enabling the system to ")
    print("   predict staff shortages months in advance.")
    print("="*50)
