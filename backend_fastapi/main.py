from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend_fastapi.routes import simulate, ml_predict, what_if, repo_stats

app = FastAPI(
    title="AI Airport Digital Twin API",
    description="Backend API for airport simulation, delay prediction, and what-if analysis.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(simulate.router, prefix="/simulate", tags=["Simulation"])
app.include_router(ml_predict.router, prefix="/predict", tags=["ML Predictions"])
app.include_router(what_if.router, prefix="/whatif", tags=["What-If Analysis"])
app.include_router(repo_stats.router, prefix="/repo", tags=["Repository Stats"])

@app.get("/")
async def root():
    return {"message": "AI Airport Digital Twin API is online"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
