# FARMELSTER — NASA SPACE APPS CHALLENGE 2026
## Official 7-Page Presentation Deck & Judge Pitch Guide

> **Challenge**: Field Shift: Adapting Farms with NASA Data  
> **Platform**: [farmelster.com](https://farmelster.com)  
> **Source Code**: [github.com/WAAAAAHHHHH/NakoPetrol](https://github.com/WAAAAAHHHHH/NakoPetrol)  
> **Interactive Slide Deck**: Open [`presentation/index.html`](./index.html) in any browser (Supports Fullscreen with `F`, Arrow Keys `<-` `->`, Spacebar)  
> **Structure**: Exactly 7 Pages Total (Pages 1-6: App Features, Page 7: Team Credits & Field Dossier)  
> **Team**: 4-Student Engineering Group (Mert, Zeynep, Anka, Aras)

---

### The 7 Pages Overview

1. **Page 1**: **Global Agricultural GIS & Interactive Digital Twin** (`assets/shot_dashboard.png`)
2. **Page 2**: **NASA POWER 30-Year Climatology & Historical Risk Matrix** (`assets/shot_climate.png`)
3. **Page 3**: **ISRIC SoilGrids 250m Deep Subsurface Profiling** (`assets/shot_soil.png`)
4. **Page 4**: **Sentinel-2 & MODIS Optical Vegetation Index (NDVI)** (`assets/shot_satellite.png`)
5. **Page 5**: **Scientific Crop Suitability Engine (Multi-Attribute Utility Theory)** (`assets/shot_crops.png`)
6. **Page 6**: **Thermal Planting Calendar & What-If Climate Simulator** (`assets/shot_calendar.png`)
7. **Page 7**: **Built by Students, Designed for the Planet (Credits & Printable Field Dossier)** (`assets/shot_dossier.png`)

---

## Detailed Page-by-Page Pitch & Talking Points

### PAGE 1: Global Agricultural GIS & Interactive Digital Twin
* **Title**: **Global GIS & Interactive Field Digital Twin**
* **Visual**: Live Workstation Dashboard Interface screenshot (`assets/shot_dashboard.png`).
* **Speaker Script (Mert / Team)**:
  > "Distinguished NASA Space Apps committee members, welcome to Farmelster. Built for the 2026 challenge 'Field Shift: Adapting Farms with NASA Data', Farmelster is an open-access geospatial intelligence platform. As shown on the right, users can select benchmark agricultural parcels (like Konya, Thrace, Harran, Çukurova, and Bordeaux) or click anywhere on Earth to generate a custom polygon. Our backend features deterministic Natural Earth spatial indexing to separate terrestrial farmland from marine water bodies with an 800-meter coastal buffer. In seconds, Farmelster connects satellite orbits and soil physics to build an instant agronomic digital twin."

---

### PAGE 2: NASA POWER 30-Year Climatology & Risk Matrix
* **Title**: **NASA POWER 30-Year Climatology & Risk Matrix**
* **Visual**: Live Climate Intelligence & 30-Year Historical Risk Waveforms screenshot (`assets/shot_climate.png`).
* **Speaker Script**:
  > "Traditional farming relies on generational habits that are no longer reliable under accelerating microclimate shifts. As demonstrated in our Climate Intelligence view, Farmelster pulls 30 years of daily NASA MERRA-2 assimilation data: 2-meter air temperatures, precipitation curves, solar radiation, and relative humidity. We calculate extreme risk probabilities—such as heatwave duration above 35°C, prolonged drought spells, and spring frost risk—giving farmers empirical climate baselines rather than guesswork."

---

### PAGE 3: ISRIC SoilGrids 250m Deep Subsurface Profiling
* **Title**: **ISRIC SoilGrids 250m Deep Subsurface Profiling**
* **Visual**: Live SoilGrids 250m Resolution Profile screenshot (`assets/shot_soil.png`).
* **Speaker Script**:
  > "Crop adaptation begins below the surface. On Page 3, our Soil Intelligence engine queries ISRIC SoilGrids at 250-meter global resolution. We retrieve soil pH, cation exchange capacity (CEC), bulk density, and organic carbon across six standardized depth horizons down to two meters deep. Furthermore, we compute the USDA soil texture triangle—precise percentages of clay, sand, and silt—enabling growers to identify soil water retention limits and root penetration barriers before sowing."

---

### PAGE 4: Sentinel-2 & MODIS Optical Vegetation Index (NDVI)
* **Title**: **Sentinel-2 & MODIS Optical Vegetation Index**
* **Visual**: Live Sentinel-2 Optical NDVI & Surface Reflectance screenshot (`assets/shot_satellite.png`).
* **Speaker Script**:
  > "To evaluate live vegetative vigor, Farmelster taps into Copernicus Sentinel-2 multispectral instruments. We calculate true optical Normalized Difference Vegetation Index using the formula (NIR - Red) / (NIR + Red) at 10-meter spatial resolution. This differentiates dense chlorophyll canopies from dry scrubland or open water, and tracks shortwave infrared anomalies to detect crop moisture deficit up to two weeks before visual leaf wilting occurs."

---

### PAGE 5: Scientific Crop Suitability Engine (MAUT)
* **Title**: **Scientific Crop Suitability Engine (MAUT)**
* **Visual**: Live Multi-Attribute Crop Planning & Suitability Rankings screenshot (`assets/shot_crops.png`).
* **Speaker Script**:
  > "Instead of arbitrary recommendations, Farmelster evaluates 11 staple global crops (Wheat, Barley, Maize, Sunflower, Chickpea, Cotton, Soybeans, Olive, Grape, Lentil, Potato) using Multi-Attribute Utility Theory (MAUT). The engine pairs local NASA climate waveforms and SoilGrids chemistry with peer-reviewed FAO EcoCrop biological thresholds. As seen on screen, scores shift realistically across geographies: arid Harran favors Cotton and Chickpea, while the Central Anatolian steppe in Konya selects for drought-hardy winter grains."

---

### PAGE 6: Thermal Planting Calendar & What-If Climate Simulator
* **Title**: **Thermal Planting Calendar & Scenario Simulator**
* **Visual**: Live Phenological Sowing & Harvest Calendar screenshot (`assets/shot_calendar.png`).
* **Speaker Script**:
  > "Plants don't follow calendar months; they follow thermal degree days. Farmelster calculates Growing Degree Days (GDD) above base temperature and combines them with 30-year NASA frost probability curves to graph optimal Sowing, Vegetative, Flowering, and Harvest windows. Simultaneously, growers can stress-test their acreage against future IPCC climate anomalies using our What-If Climate Simulator—adjusting rainfall by -50% to +50% and testing temperature spikes to evaluate crop resilience before planting a single seed."

---

### PAGE 7: Built by Students, Designed for the Planet (Credits & Field Dossier)
* **Title**: **Built by Students, Designed for the Planet**
* **Visual**: Live Field Dossier Diagnostic Report modal (`assets/shot_dossier.png`).
* **Team**:
  - **Mert** — **Team Leader**: Overall architecture, Python FastAPI backend, and scientific scoring algorithms.
  - **Zeynep** — **Student Developer**: React 19 interface, responsive workstation layout, and interactive UX.
  - **Anka** — **Student Developer**: NASA POWER climatology research, NDVI spectral equations, and crop databases.
  - **Aras** — **Student Developer**: GIS coordinate indexing, boundary validation, and end-to-end bug hunting.
* **Speaker Script**:
  > "Farmelster was conceived and crafted for the NASA Space Apps Challenge 2026 by a team of four students led by Mert. With a single click on 'Export Dossier', agronomists and farmers can compile all of this intelligence into an official printable PDF report. Farmelster is live in production today at farmelster.com, completely open-source and free for all growers worldwide. Thank you, NASA Space Apps committee!"
