from fastapi import APIRouter, BackgroundTasks
from simulation.engine.sim_runner import sim_runner
import uuid

router = APIRouter()

# In-memory store for simulation results (In production, use Redis/PostgreSQL)
sim_store = {}

@router.post("/start")
async def start_simulation(background_tasks: BackgroundTasks):
    """Triggers a baseline simulation run in the background."""
    sim_id = str(uuid.uuid4())
    config = {
        "scenario_name": "Baseline",
        "checkin_counters": 10,
        "security_counters": 5,
        "increase_flights_percent": 0,
        "delay_offset_minutes": 0,
        "sim_duration": 480
    }
    
    # Run simulation as a background task
    def run_task(sid, cfg):
        result = sim_runner(cfg)
        sim_store[sid] = {"status": "COMPLETED", "result": result}

    sim_store[sim_id] = {"status": "RUNNING"}
    background_tasks.add_task(run_task, sim_id, config)
    
    return {"simulation_id": sim_id, "status": "STARTED"}

@router.get("/state/{sim_id}")
async def get_simulation_state(sim_id: str):
    """Returns the results or status of a specific simulation."""
    if sim_id not in sim_store:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return sim_store[sim_id]
