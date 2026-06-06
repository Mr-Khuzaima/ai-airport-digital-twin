import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from utils.simulation import (
    generate_airport_data,
    calculate_congestion,
    calculate_average_delay,
    calculate_satisfaction
)

# --- GOOGLE-GRADE UI CONFIGURATION ---
st.set_page_config(
    page_title="AI Airport Digital Twin",
    page_icon="✈️",
    layout="wide"
)

# --- APP HEADER ---
st.title("✈️ AI Airport Digital Twin Simulation System")
st.markdown("---")

# --- SIDEBAR (WHAT-IF ANALYSIS) ---
st.sidebar.header("🕹️ What-If Analysis Controls")
st.sidebar.info("Adjust parameters to see real-time impact on airport KPIs.")

flights_increase = st.sidebar.slider("Increase Flights %", 0, 100, 20)
security_counters = st.sidebar.slider("Security Counters", 1, 20, 5)
delay_factor = st.sidebar.slider("Delay Factor (minutes)", 0, 120, 30)

# --- SIMULATION ENGINE ---
base_flights = 50
total_flights = int(base_flights * (1 + flights_increase / 100))

# Execute logic from utils/simulation.py
congestion_idx = calculate_congestion(total_flights, security_counters)
avg_delay = calculate_average_delay(15, delay_factor)
satisfaction_score = calculate_satisfaction(avg_delay, congestion_idx)
flight_logs = generate_airport_data(total_flights, delay_factor).head(5)

# --- MAIN DASHBOARD METRICS ---
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric("Total Flights", total_flights, f"{flights_increase}%")
with col2:
    st.metric("Avg Delay", f"{avg_delay}m", f"{delay_factor}m bias")
with col3:
    st.metric("Congestion Index", congestion_idx)
with col4:
    st.metric("Satisfaction Score", f"{satisfaction_score}%")

st.markdown("---")

# --- VISUALIZATION SECTION ---
st.subheader("📊 Operational Resource Analysis")
viz_col1, viz_col2 = st.columns([2, 1])

with viz_col1:
    # Prepare data for bar chart
    capacity = security_counters * 10
    chart_data = pd.DataFrame({
        "Category": ["Flight Load", "System Capacity", "Congestion"],
        "Value": [total_flights, capacity, congestion_idx]
    })
    
    fig, ax = plt.subplots(figsize=(10, 5))
    sns.barplot(data=chart_data, x="Category", y="Value", palette="mako", ax=ax)
    ax.set_ylabel("Metric Value")
    ax.grid(axis='y', linestyle='--', alpha=0.7)
    st.pyplot(fig)

with viz_col2:
    st.subheader("🧠 AI Insights")
    if congestion_idx > 200:
        st.error("🚨 **CRITICAL OVERLOAD**\n\nThe airport infrastructure is failing to meet demand. Immediate resource scaling required.")
    elif congestion_idx > 120:
        st.warning("⚠️ **MODERATE CONGESTION**\n\nIncreased wait times detected. Consider opening additional security lanes to stabilize satisfaction.")
    else:
        st.success("✅ **OPTIMAL OPERATIONS**\n\nResources are perfectly balanced. High efficiency and passenger comfort levels maintained.")

st.markdown("---")

# --- SIMULATION LOGS ---
st.subheader("✈️ Real-Time Simulation Sample")
st.dataframe(flight_logs, use_container_width=True)

# --- FOOTER ---
st.markdown(
    """
    <div style='text-align: center; color: #888; font-size: 0.8em; margin-top: 50px;'>
        AI Airport Digital Twin • Final Year Project Deployment Version • Built with Streamlit
    </div>
    """,
    unsafe_with_html=True
)
