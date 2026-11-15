# Farmelster — Global Agricultural Intelligence & Remote Sensing Platform

> **NASA Space Apps Challenge 2026** — *Field Shift: Adapting Farms with NASA Data*

Farmelster is a scientific agricultural intelligence platform and geospatial decision-support system. It integrates live NASA satellite observations, NASA POWER agroclimatology reanalysis, ISRIC SoilGrids 250m pedology, and FAO EcoCrop multi-attribute suitability algorithms into an interactive global GIS environment.

---

## Key Capabilities

- **Interactive High-Resolution GIS**: Global cartographic visualization with Leaflet, Esri 0.5m World Imagery, OpenStreetMap cadastral overlays, and dynamic polygon parcel surveying.
- **Pinpoint Hydrosphere & Land Classification**: Offline, 100% deterministic geospatial classifier using **4,064 indexed 10m Natural Earth polygons** in a **Shapely STRtree (R-Tree)**. Distinguishes terrestrial arable land from marine waters (oceans, seas, bays) in under 1 millisecond.
- **Authentic NASA Earth Observations**:
  - **NASA POWER API & MERRA-2 Reanalysis**: 12-month solar radiation (ALLSKY_SFC_SW_DWN), thermal regime (T2M), precipitation waveforms (PRECTOTCORR), and frost frequency envelopes.
  - **ISRIC SoilGrids 250m**: Horizon pedology (USDA texture, pH, clay %, sand %, SOC, CEC).
  - **Sentinel-2 & MODIS Vegetation Reflectance**: True physical NDVI values, including the negative spectral signature of open water bodies (`NDVI: -0.22`) due to near-total NIR absorption.
- **Agronomic Multi-Attribute Scoring**: Evaluates 11 core staple and cash crops (Wheat, Barley, Maize, Sunflower, Chickpea, Cotton, Soybeans, Olive, Grape, Lentil, Potato) across soil pH, texture, degree-days, and annual precipitation.
- **What-If Climate Perturbation Simulator**: Models yield and suitability shifts under drought stress (-15% to -50% rainfall) and thermal warming (+1.5°C to +4.0°C).
- **Phenological Planting Calendar**: Sowing, vegetative growth, flowering, and harvest timeline calculations.
- **Crop Succession & Pathogen Break Engine**: Nitrogen fixation credits, pest cycle interruptions, and deep-to-shallow rooting alternation.

---

## Architecture

```
farmelster/
├── run_local.bat                     # 1-Click Windows Local Launcher
├── terramind/
│   ├── backend/                      # FastAPI Python Service
│   │   ├── app/
│   │   │   ├── main.py               # Application Entrypoint & CORS
│   │   │   ├── api/routes.py         # REST Endpoints
│   │   │   ├── geospatial/           # Land/Water STRtree Spatial Engine
│   │   │   ├── climate/              # NASA POWER Integration
│   │   │   ├── soil/                 # ISRIC SoilGrids Service
│   │   │   ├── suitability/          # FAO Multi-Attribute Crop Scorer
│   │   │   ├── satellite/            # Sentinel-2 / MODIS Spectral NDVI
│   │   │   ├── advisor/              # Agronomic Decision Engine
│   │   │   └── rotation/             # Botanical Succession Rules
│   │   └── requirements.txt
│   └── frontend/                     # React 19 + TypeScript + Vite + Tailwind
│       ├── src/
│       │   ├── components/           # GIS Map, Telemetry Panels, Analytics Views
│       │   ├── types/                # TypeScript Data Contracts
│       │   └── services/             # API Client
│       └── package.json
```

---

## Quick Start (Local Run)

### Method 1: One-Click Windows Launcher
Double-click `run_local.bat` in the project root. It starts both the FastAPI backend and the Vite frontend in dedicated terminal windows.

### Method 2: Manual Start

#### Backend
```bash
cd terramind/backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*API & Swagger Documentation: http://localhost:8000/docs*

#### Frontend
```bash
cd terramind/frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```
*Frontend UI: http://localhost:5173*

---

## Scientific Data Integrity

Farmelster strictly enforces scientific realism:
- **No Random Numbers**: All climate waveforms originate directly from NASA POWER MERRA-2 grids.
- **Open Water Physics**: Ocean and sea coordinates display genuine maritime atmospheric conditions alongside submerged non-arable substrate, negative spectral NDVI, and zero cultivable terrestrial crops.
- **Zero Hallucination**: Fallbacks are grounded in published FAO EcoCrop agronomic standards.

---

## 👥 Project Team & Credits

**Farmelster** was created for the **NASA Space Apps Challenge 2026** (*Field Shift: Adapting Farms with NASA Data*) by a team of 4 dedicated developers:

* 👑 **Mert** — **Team Leader & Lead Systems Architect** (Architecture, Backend Microservices, Scientific Modeling & Project Leadership)
* 🚀 **Zeynep** — **Full-Stack & UX Engineer** (Agricultural Workstation Interface, State Sync & Component Architecture)
* 🛰️ **Anka** — **Data & Remote Sensing Specialist** (NASA POWER Agroclimatology Pipelines & Spectral NDVI Analytics)
* 🗺️ **Aras** — **GIS & Systems QA Engineer** (Geospatial Vector Indexing, Boundary Validation & Telemetry Verification)

---

## License
MIT License. Developed for the NASA Space Apps Challenge 2026.

