"""
TerraMind What-If Scenario Simulator
Interactive agronomic perturbation model:
- Precipitation anomalies (-50% to +50%)
- Temperature shifts (-3°C to +5°C)
- Planting date delays (-30 to +45 days)
- Irrigation regimes (Rainfed, Deficit Irrigation, Full Irrigation)
Computes comparative impact deltas on crop suitability, water deficits, and heat risks.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

from app.crops.crop_database import CROP_DATABASE

class ScenarioParams(BaseModel):
    scenario_name: str = "Scenario A"
    crop_id: str = "wheat"
    rainfall_change_pct: float = Field(default=0.0, ge=-60.0, le=100.0, description="Percentage shift in annual rainfall")
    temperature_shift_c: float = Field(default=0.0, ge=-5.0, le=7.0, description="Temperature anomaly in degrees Celsius")
    planting_delay_days: int = Field(default=0, ge=-45, le=60, description="Shift in sowing date in days")
    irrigation_mode: str = Field(default="rainfed", description="'rainfed', 'deficit', or 'full'")

class WhatIfSimulator:
    def __init__(self):
        self.crop_db = CROP_DATABASE

    def simulate_scenarios(
        self,
        base_climate_summary: Dict[str, Any],
        base_monthly: List[Dict[str, Any]],
        soil_profile: Dict[str, Any],
        scenarios: List[ScenarioParams]
    ) -> Dict[str, Any]:
        """
        Simulates multiple agricultural scenarios and computes quantitative comparative deltas.
        """
        results = []
        base_precip = float(base_climate_summary.get("annual_precipitation_mm", 400.0))
        base_temp = float(base_climate_summary.get("mean_annual_temp_c", 13.0))

        for sc in scenarios:
            crop = self.crop_db.get(sc.crop_id.lower(), self.crop_db["wheat"])
            min_water, max_water = crop["water_requirement_mm"]
            opt_t_min, opt_t_max = crop["optimal_temp_c"]
            heat_threshold = float(crop.get("heat_stress_threshold_c", 35.0))

            # Adjusted precipitation
            adj_precip = round(base_precip * (1.0 + sc.rainfall_change_pct / 100.0), 1)

            # Effective water under irrigation mode
            if sc.irrigation_mode == "full":
                effective_water = max(adj_precip, max_water)
                water_deficit_mm = 0.0
            elif sc.irrigation_mode == "deficit":
                effective_water = max(adj_precip, min_water)
                water_deficit_mm = max(0.0, min_water - effective_water)
            else: # rainfed
                effective_water = adj_precip
                water_deficit_mm = max(0.0, min_water - effective_water)

            # Adjusted temperature
            adj_temp = round(base_temp + sc.temperature_shift_c, 1)

            # Water suitability score (0-100)
            if effective_water >= min_water:
                sim_water_score = 95.0
            else:
                deficit_ratio = (min_water - effective_water) / min_water
                sim_water_score = max(10.0, 95.0 - (deficit_ratio * 100.0))

            # Temperature suitability score (0-100)
            if opt_t_min <= adj_temp <= opt_t_max:
                sim_temp_score = 95.0
            else:
                dev = min(abs(adj_temp - opt_t_min), abs(adj_temp - opt_t_max))
                sim_temp_score = max(20.0, 95.0 - (dev * 12.0))

            # Planting delay penalty
            delay_penalty = 0.0
            delay_impact_note = "Normal planting calendar maintained."
            if sc.planting_delay_days > 20:
                delay_penalty = min(25.0, (sc.planting_delay_days - 20) * 0.8)
                delay_impact_note = f"Planting delayed by {sc.planting_delay_days} days shifts grain filling into summer heat stress and increases moisture loss."
            elif sc.planting_delay_days < -15:
                delay_penalty = min(20.0, abs(sc.planting_delay_days + 15) * 0.7)
                delay_impact_note = f"Early sowing by {abs(sc.planting_delay_days)} days elevates late spring frost exposure."

            # Simulated overall suitability score
            sim_overall = round(max(0.0, min(100.0, 0.45 * sim_water_score + 0.40 * sim_temp_score + 0.15 * 85.0 - delay_penalty)), 1)

            # Heat stress risk evaluation
            effective_peak_heat = max(m["temp_max_c"] for m in base_monthly) + sc.temperature_shift_c
            heat_risk_elevated = effective_peak_heat >= heat_threshold

            # Key management challenges
            challenges = []
            if water_deficit_mm > 50:
                challenges.append(f"Water Deficit: ~{round(water_deficit_mm)} mm shortfall threatens canopy leaf area and seed set.")
            if heat_risk_elevated:
                challenges.append(f"Extreme Heat: Peak temperatures ({round(effective_peak_heat, 1)}°C) cross {crop['name']} heat tolerance threshold ({heat_threshold}°C).")
            if sc.irrigation_mode == "rainfed" and sc.rainfall_change_pct < -20:
                challenges.append("Drought Vulnerability: Significant precipitation reduction requires shifting to more drought-resilient legumes or barley.")
            if not challenges:
                challenges.append("Favorable environmental conditions; standard nutrient and pest management recommended.")

            results.append({
                "scenario_name": sc.scenario_name,
                "crop_id": crop["id"],
                "crop_name": crop["name"],
                "parameters_applied": {
                    "rainfall_change_pct": f"{sc.rainfall_change_pct:+.1f}%",
                    "adjusted_annual_rainfall_mm": adj_precip,
                    "temperature_shift_c": f"{sc.temperature_shift_c:+.1f} °C",
                    "adjusted_mean_temp_c": adj_temp,
                    "planting_delay_days": f"{sc.planting_delay_days:+d} days",
                    "irrigation_mode": sc.irrigation_mode.capitalize()
                },
                "simulated_metrics": {
                    "overall_suitability_score": sim_overall,
                    "water_satisfaction_score": round(sim_water_score, 1),
                    "temperature_compatibility_score": round(sim_temp_score, 1),
                    "water_deficit_mm": round(water_deficit_mm, 1),
                    "peak_summer_temp_c": round(effective_peak_heat, 1)
                },
                "delay_impact_analysis": delay_impact_note,
                "key_management_challenges": challenges
            })

        return {
            "baseline_reference": {
                "annual_precipitation_mm": base_precip,
                "mean_annual_temp_c": base_temp
            },
            "scenarios_evaluated": results,
            "scientific_disclaimer": "Simulations apply empirical agronomic stress response functions; results represent comparative scenario trends, not guaranteed financial yields."
        }

