import pandas as pd
import numpy as np
import os
import logging
import joblib
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from typing import Tuple, Dict

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class FlightDelayTrainer:
    """
    Production-level training pipeline for Flight Delay Prediction.
    Uses XGBoost Regression to predict ARRIVAL_DELAY.
    """

    def __init__(self, data_path: str, model_save_path: str):
        self.data_path = data_path
        self.model_save_path = model_save_path
        self.model = None

    def load_and_prepare_data(self) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
        """
        Loads the dataset and performs train-test split.
        """
        logger.info(f"Loading data from {self.data_path}...")
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Data file not found at {self.data_path}")

        df = pd.read_csv(self.data_path)
        
        # Define features and target
        target = 'ARRIVAL_DELAY'
        X = df.drop(columns=[target])
        y = df[target]

        # Train/Test split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        logger.info(f"Data split complete. Train shape: {X_train.shape}, Test shape: {X_test.shape}")
        return X_train, X_test, y_train, y_test

    def train_model(self, X_train: pd.DataFrame, y_train: pd.Series):
        """
        Trains the XGBoost Regressor.
        """
        logger.info("Starting model training with XGBoost...")
        
        # Initialize XGBoost Regressor with baseline production hyperparameters
        self.model = xgb.XGBRegressor(
            n_estimators=1000,
            learning_rate=0.05,
            max_depth=6,
            subsample=0.8,
            colsample_bytree=0.8,
            n_jobs=-1,
            random_state=42,
            objective='reg:squarederror'
        )

        self.model.fit(
            X_train, 
            y_train,
            eval_set=[(X_train, y_train)],
            verbose=100
        )
        logger.info("Model training complete.")

    def evaluate_model(self, X_test: pd.DataFrame, y_test: pd.Series) -> Dict[str, float]:
        """
        Evaluates the model on test data and prints metrics.
        """
        logger.info("Evaluating model...")
        predictions = self.model.predict(X_test)
        
        mae = mean_absolute_error(y_test, predictions)
        rmse = np.sqrt(mean_squared_error(y_test, predictions))
        r2 = r2_score(y_test, predictions)
        
        metrics = {
            "MAE": mae,
            "RMSE": rmse,
            "R2": r2
        }
        
        print("\n" + "="*30)
        print("  MODEL PERFORMANCE METRICS")
        print("="*30)
        for name, value in metrics.items():
            print(f"{name:4}: {value:.4f}")
        print("="*30 + "\n")
        
        return metrics

    def print_feature_importance(self, X_train: pd.DataFrame):
        """
        Prints the importance of each feature.
        """
        importance = self.model.feature_importances_
        feature_names = X_train.columns
        
        feature_importance_df = pd.DataFrame({
            'Feature': feature_names,
            'Importance': importance
        }).sort_values(by='Importance', ascending=False)
        
        print("TOP FEATURES FOR DELAY PREDICTION:")
        print(feature_importance_df.to_string(index=False))
        print("\n")

    def save_model(self):
        """
        Persists the trained model to disk.
        """
        os.makedirs(os.path.dirname(self.model_save_path), exist_ok=True)
        joblib.dump(self.model, self.model_save_path)
        logger.info(f"Model saved successfully at {self.model_save_path}")

    def run(self):
        """
        Executes the full training lifecycle.
        """
        try:
            X_train, X_test, y_train, y_test = self.load_and_prepare_data()
            self.train_model(X_train, y_train)
            self.evaluate_model(X_test, y_test)
            self.print_feature_importance(X_train)
            self.save_model()
        except Exception as e:
            logger.error(f"Training pipeline failed: {e}")
            raise

if __name__ == "__main__":
    # Paths assuming script is run from project root
    DATA_INPUT = "outputs/flight_delay_model_data.csv"
    MODEL_OUTPUT = "ml_models/saved_models/delay_prediction_model.pkl"
    
    # Path correction for relative execution
    if not os.path.exists(DATA_INPUT) and os.path.exists("../outputs/flight_delay_model_data.csv"):
        DATA_INPUT = "../outputs/flight_delay_model_data.csv"
        MODEL_OUTPUT = "../ml_models/saved_models/delay_prediction_model.pkl"

    trainer = FlightDelayTrainer(DATA_INPUT, MODEL_OUTPUT)
    trainer.run()
