"""
TerraMind Climate Risk Analysis Engine
Calculates quantitative risk indices:
- Drought Stress Index (Standardized Precipitation & Aridity Ratio)
- Heat Wave Frequency & Critical Threshold Exceedance
- Frost Hazard Index
- Rainfall Seasonality & Variability Analysis
"""

from typing import Dict, Any, List
import numpy as np

class ClimateRiskAnalyzer:
    def analyze_field_risks(
        self,
        climate_summary: Dict[str, Any],
        monthly_climate: List[Dict[str, Any]],
        soil_profile: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Synthesizes comprehensive climate hazard evaluation for the field.
        """
        annual_precip = float(climate_summary.get("annual_precipitation_mm", 400.0))
        mean_temp = float(climate_summary.get("mean_annual_temp_c", 13.0))

        # 1. Drought Stress Risk
        # Semiarid Anatolia threshold: < 350mm = High, 350-500mm = Moderate, > 500mm = Low
        if annual_precip < 350:
            drought_risk_score = 85
            drought_level = "Severe Drought Risk (Arid/Semiarid)"
            drought_desc = f"Annual precipitation ({annual_precip}mm) is critically constrained. Dryland winter cereals or supplemental drip irrigation required."
        elif annual_precip < 500:
            drought_risk_score = 55
            drought_level = "Moderate Drought Risk"
            drought_desc = f"Annual precipitation ({annual_precip}mm) supports rainfed winter wheat/barley; summer crops require planned irrigation."
        else:
            drought_risk_score = 25
            drought_level = "Low Drought Risk"
            drought_desc = f"Favorable precipitation ({annual_precip}mm) provides adequate moisture buffer for standard field rotations."

        # 2. Heat Stress Risk
        # Count months where max temperature exceeds 33°C
        summer_hot_months = [m for m in monthly_climate if m["temp_max_c"] >= 32.0]
        peak_summer_temp = max(m["temp_max_c"] for m in monthly_climate)
        if len(summer_hot_months) >= 3 or peak_summer_temp > 38.0:
            heat_risk_score = 80
            heat_level = "High Heat Stress Risk"
            heat_desc = f"Peak temperatures reach {peak_summer_temp}°C with {len(summer_hot_months)} months exceeding 32°C. Risk of flower abortion and grain desiccation."
        elif len(summer_hot_months) >= 1:
            heat_risk_score = 45
            heat_level = "Moderate Heat Stress Risk"
            heat_desc = f"Summer peaks around {peak_summer_temp}°C. Heat-tolerant crop varieties and timely irrigation recommended during anthesis."
        else:
            heat_risk_score = 15
            heat_level = "Low Heat Stress Risk"
            heat_desc = f"Temperate summer conditions (max {peak_summer_temp}°C) minimize vegetative scorching."

        # 3. Frost Hazard Risk
        frost_months = [m for m in monthly_climate if m["temp_min_c"] <= 0.0]
        min_winter_temp = min(m["temp_min_c"] for m in monthly_climate)
        if len(frost_months) >= 3 or min_winter_temp < -5.0:
            frost_risk_score = 75
            frost_level = "High Frost Hazard"
            frost_desc = f"Extended sub-zero winter ({min_winter_temp}°C minimum across {len(frost_months)} months). Strict frost-tolerant winter varieties or spring planting required."
        elif len(frost_months) >= 1:
            frost_risk_score = 40
            frost_level = "Moderate Frost Hazard"
            frost_desc = f"Occasional winter frosts ({min_winter_temp}°C). Spring crops should be sown after mid-April."
        else:
            frost_risk_score = 10
            frost_level = "Negligible Frost Hazard"
            frost_desc = "Mild maritime/subtropical winters; year-round double cropping viable."

        # 4. Precipitation Seasonality & Excessive Rain Risk
        # Maximum single month precipitation
        max_monthly_rain = max(m["precipitation_mm"] for m in monthly_climate)
        summer_rain_pct = round(sum(m["precipitation_mm"] for m in monthly_climate if m["month"] in ["Jun", "Jul", "Aug"]) / max(1.0, annual_precip) * 100.0, 1)

        excessive_rain_score = 25 if max_monthly_rain < 90 else 60
        excessive_desc = f"Peak monthly precipitation is {max_monthly_rain}mm. Only {summer_rain_pct}% of precipitation falls during summer, characteristic of Mediterranean/Continental seasonality."

        # Composite Agro-Climate Vulnerability Index (0-100)
        overall_vulnerability = round(
            0.40 * drought_risk_score + 
            0.30 * heat_risk_score + 
            0.20 * frost_risk_score + 
            0.10 * excessive_rain_score, 1
        )

        return {
            "overall_climate_vulnerability_index": overall_vulnerability,
            "vulnerability_classification": "High Climate Vulnerability" if overall_vulnerability > 65 else "Moderate Climate Vulnerability" if overall_vulnerability > 40 else "Favorable Resilient Climate",
            "risk_categories": {
                "drought": {
                    "score": drought_risk_score,
                    "level": drought_level,
                    "description": drought_desc,
                    "key_metric": f"{annual_precip} mm annual precipitation"
                },
                "heat_stress": {
                    "score": heat_risk_score,
                    "level": heat_level,
                    "description": heat_desc,
                    "key_metric": f"{peak_summer_temp}°C peak monthly maximum"
                },
                "frost_hazard": {
                    "score": frost_risk_score,
                    "level": frost_level,
                    "description": frost_desc,
                    "key_metric": f"{min_winter_temp}°C coldest monthly minimum"
                },
                "excessive_rainfall": {
                    "score": excessive_rain_score,
                    "level": "Low Flood / Compaction Risk" if excessive_rain_score < 40 else "Moderate Excessive Rain Risk",
                    "description": excessive_desc,
                    "key_metric": f"{max_monthly_rain} mm maximum single month"
                }
            },
            "scientific_disclaimer": "Climate risk indices reflect long-term historical NASA POWER agroclimatological statistics and do not constitute an active meteorological severe weather alert."
        }

