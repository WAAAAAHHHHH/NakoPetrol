# 🛰️ FARMELSTER — NASA SPACE APPS CHALLENGE 2026
## Official 7-Slide Presentation Deck & Judge Pitch Script

> **Challenge**: Field Shift: Adapting Farms with NASA Data  
> **Platform**: [farmelster.com](https://farmelster.com)  
> **Source Code**: [github.com/WAAAAAHHHHH/NakoPetrol](https://github.com/WAAAAAHHHHH/NakoPetrol)  
> **Interactive Slide Deck**: Open [`presentation/index.html`](./index.html) in any browser (Supports Fullscreen `F`, Arrow Keys `←` `→`, Spacebar)  
> **Team**: 4-Student Engineering Group (Mert, Zeynep, Anka, Aras)

---

### 📋 Slide Overview (7 Slides Total)

1. **Slide 1**: Title, NASA Challenge Context & Team Introduction
2. **Slide 2**: The Real-World Agricultural Crisis (The Climate Problem)
3. **Slide 3**: The Solution & Data Pipeline (NASA POWER + SoilGrids + Sentinel-2)
4. **Slide 4**: Scientific Crop Suitability Engine (Multi-Attribute Utility Theory)
5. **Slide 5**: Phenological Planting Calendar & Thermal GDD Frost Windows
6. **Slide 6**: What-If Climate Simulator & Exportable Field Dossier (PDF)
7. **Slide 7**: Production Deployment, Open-Access GIS & Student Team Vision

---

## 🎤 Detailed Slide-by-Slide Pitch & Talking Points

### 🌟 SLIDE 1: Title & Challenge Hook
* **Title**: **FARMELSTER — Global Agricultural Intelligence & Remote Sensing Platform**
* **Subtitle**: *Bridging NASA Earth Observations, Soil Physics, and Climate Modeling for Smallholder Resilience.*
* **Pill**: NASA Space Apps Challenge 2026 — *Field Shift*
* **Team**: 4 High-School / University Students led by Mert.
* **Speaker Script (Mert / Team)**:
  > *"Distinguished NASA Space Apps judges and members, welcome. We are a team of four students who built **Farmelster** for the 2026 challenge 'Field Shift: Adapting Farms with NASA Data'. Over 500 million smallholder farms worldwide are experiencing unprecedented weather volatility. Farmelster translates complex NASA Earth Observation data, satellite orbits, and soil physics into actionable agronomic intelligence that any farmer or researcher can use in seconds. You can explore our live production build right now at farmelster.com."*

---

### 📉 SLIDE 2: The Global Agricultural Crisis
* **Title**: **The Challenge: Blind Farming in a Volatile Climate**
* **Key Pillars**:
  1. **Static Legacy Advice**: Traditional multi-generational calendars fail under rapid microclimate shifts.
  2. **Data Fragmentation**: NASA POWER, ISRIC SoilGrids, and Copernicus Sentinel data live in separate, inaccessible scientific repositories.
  3. **Water Stress & Groundwater Depletion**: 70% of global freshwater is consumed by agriculture; inefficient irrigation causes devastating crop loss.
* **Speaker Script**:
  > *"Farmers today are effectively flying blind. Generational planting wisdom passed down for decades no longer holds because local temperatures and precipitation patterns are shifting faster than traditional knowledge can adapt. NASA and space agencies capture petabytes of high-value remote sensing telemetry every day, but smallholders and agronomists don't have the time or GIS tooling to process raw HDF5 or NetCDF files. Farmelster solves this data gap."*

---

### 🛰️ SLIDE 3: Instant Digital Twins from Orbit to Subsoil
* **Title**: **NASA & Earth Observation Architecture**
* **Key Integrations**:
  - **NASA POWER MERRA-2**: 30-year daily temperature curves ($T2M$, $T2M_{min}$, $T2M_{max}$), precipitation ($PRECTOTCORR$), solar radiation ($ALLSKY\_SW$), and humidity ($RH2M$).
  - **ISRIC SoilGrids 250m**: 6 depth horizons down to 200cm — pH, USDA sand/clay/silt texture, cation exchange capacity (CEC), bulk density, and soil organic carbon.
  - **Sentinel-2 & MODIS (NDVI)**: Live calculation using exact spectral reflectance formula:
    $$\text{NDVI} = \frac{\text{NIR} - \text{Red}}{\text{NIR} + \text{Red}}$$
* **Speaker Script**:
  > *"When a user selects or clicks any coordinate on Earth in Farmelster, our backend synthesizes a complete digital twin in seconds. We query NASA POWER's MERRA-2 assimilation for 30-year historical weather patterns and solar insolation. Concurrently, we probe ISRIC SoilGrids at 250-meter resolution for soil geochemistry down to two meters deep. Finally, we calculate true optical NDVI from Sentinel-2 bands to track vegetative vitality and canopy moisture stress. No mocked numbers, no synthetic placeholders—pure physics."*

---

### 🌾 SLIDE 4: Scientific Crop Suitability Engine (MAUT)
* **Title**: **Multi-Attribute Utility Theory (MAUT) Scoring**
* **Agronomic Formula**:
  $$\text{Suitability Score} = w_T \cdot C_{\text{temp}} + w_W \cdot C_{\text{water}} + w_S \cdot C_{\text{soil}} + w_R \cdot C_{\text{risk}}$$
* **Evaluated Crops (11)**: Wheat, Barley, Maize, Sunflower, Chickpea, Cotton, Soybeans, Olive, Grape, Lentil, Potato.
* **Speaker Script**:
  > *"Rather than relying on AI hallucinations or arbitrary rankings, Farmelster calculates crop recommendations using Multi-Attribute Utility Theory (MAUT) grounded in peer-reviewed FAO EcoCrop biological thresholds. We evaluate 11 key food crops against local soil pH, salinity tolerances, seasonal rainfall, and temperature limits. A field in arid Harran will rightfully prioritize heat-tolerant Cotton and Chickpea, while the Central Anatolian steppe in Konya selects for drought-hardy winter Wheat and Barley. Every coordinate yields a distinct, scientifically verified result."*

---

### 📅 SLIDE 5: Phenological Planting Calendar & Thermal GDD
* **Title**: **Phenology & Frost Protection**
* **Key Features**:
  1. **Growing Degree Days (GDD)**: $\sum \max(0, T_{\text{mean}} - T_{\text{base}})$ tracking accumulated biological heat units.
  2. **NASA 30-Year Frost Window**: Evaluates daily minimums to pinpoint safe spring planting and autumn freeze boundaries with a 90% statistical safety margin.
  3. **4-Stage Phenology Timeline**: Sowing, Vegetative Growth, Flowering (Critical Pollination Window), and Harvest.
* **Speaker Script**:
  > *"Crops don't grow according to calendar months; they grow according to thermal degree days. Farmelster calculates local Growing Degree Days and pairs them with 30 years of NASA frost telemetry. This generates an interactive planting calendar showing farmers the exact biological windows for sowing, vegetative canopy development, flowering, and harvest, protecting crops from devastating spring frosts and untimely autumn rains."*

---

### 🎛️ SLIDE 6: What-If Climate Lab & Exportable Field Dossier (PDF)
* **Title**: **Resilience Simulation & Farmer Decision Support**
* **Capabilities**:
  - **Dynamic Anomaly Sliders**: Simulate -50% to +50% precipitation changes, -3°C to +5°C temperature rises, sowing date shifts, and irrigation regimes.
  - **Crop Succession & Pathogen Breaks**: Calculates biological nitrogen fixation credits and breaks pest life-cycles through botanical family alternation.
  - **Official Field Dossier (PDF)**: Printable, export-ready dossier compiling climate curves, soil horizons, and crop advisories for bank loans, cooperatives, and agronomic extensions.
* **Speaker Script**:
  > *"Farmelster gives farmers foresight. With our What-If Climate Simulator, users can simulate IPCC-level drought or heat scenarios and observe how crop viability responds before planting a single seed. We also recommend crop rotation strategies—such as alternating deep-taproot legumes with shallow-root grains to fix nitrogen and break pest life-cycles. When planning is complete, the farmer can click 'Export Dossier' to print a comprehensive agronomic PDF ready for field hands or agricultural financing."*

---

### 🚀 SLIDE 7: Global Scalability & The Student Team
* **Title**: **Built by Students, Designed for the Planet**
* **Architecture & Open Science**:
  - Live in production on Vercel Serverless with FastAPI Python backends.
  - Natural Earth deterministic spatial index: accurately distinguishes terrestrial agricultural soil from open marine waters (e.g. Aegean, Mediterranean, Sea of Marmara).
* **The Team**:
  - 👑 **Mert** — **Team Leader**: Architecture, backend services, scientific modeling, and project coordination.
  - 💻 **Zeynep** — **Student Developer**: Frontend user interface, workstation layout, and interactive components.
  - 📊 **Anka** — **Student Developer**: NASA POWER climatology research, NDVI spectral equations, and crop databases.
  - 🗺️ **Aras** — **Student Developer**: GIS coordinate indexing, boundary validation, and end-to-end bug hunting.
* **Closing Script**:
  > *"We built Farmelster as four students driven to show that NASA open data can tangibly safeguard global food security. Farmelster is live, completely open-access, and requires zero paid GIS licenses. We invite the NASA committee to visit farmelster.com and test any field on Earth. Thank you!"*
