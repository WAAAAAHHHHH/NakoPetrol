"""
Germelon — Global Agricultural Intelligence & Decision-Support Platform
NASA Space Apps Challenge 2026: Field Shift: Adapting Farms with NASA Data
Backend Application Server
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router

app = FastAPI(
    title="Germelon — Global Agricultural Intelligence Platform API",
    description="Scientific decision-support platform integrating NASA POWER agroclimatology, SoilGrids pedology, and remote sensing for climate-resilient farming worldwide.",
    version="1.0.0"
)

# Enable CORS for local Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/health")
def health_check():
    return {
        "status": "nominal",
        "platform": "Germelon Global Agricultural Intelligence System",
        "challenge": "NASA Space Apps Challenge 2026 | Field Shift: Adapting Farms with NASA Data",
        "version": "1.0.0",
        "data_feeds": {
            "nasa_power_climatology": "active",
            "soilgrids_pedology": "active",
            "modis_sentinel_ndvi": "active",
            "crop_recommendation_engine": "active",
            "what_if_simulator": "active",
            "ai_advisor": "active"
        }
    }
