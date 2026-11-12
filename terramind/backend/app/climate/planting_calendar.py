"""
TerraMind Planting Window Prediction Engine
Calculates optimal sowing windows, early planting frost penalties,
and late planting heat/drought risks using monthly NASA POWER agroclimatology.
"""

from typing import Dict, Any, List
from app.crops.crop_database import CROP_DATABASE

class PlantingCalendarEngine:
    def __init__(self):
        self.crop_db = CROP_DATABASE

    def generate_crop_calendar(
        self,
        crop_id: str,
        monthly_climate: List[Dict[str, Any]],
        soil_profile: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Determines month-by-month agricultural suitability, identifying
        optimal planting windows, harvest windows, and early/late risks.
        """
        crop = self.crop_db.get(crop_id)
        if not crop:
            return {"error": f"Crop '{crop_id}' not found in database"}

        opt_t_min, opt_t_max = crop["optimal_temp_c"]
        base_temp = crop["base_temp_c"]
        heat_threshold = float(crop.get("heat_stress_threshold_c", 35.0))
        target_planting_months = crop["recommended_planting_months"]
        target_harvest_months = crop["harvest_months"]

        calendar_months = []

        for m in monthly_climate:
            m_name_upper = m["month"].upper()
            t_mean = m["temp_mean_c"]
            t_min = m["temp_min_c"]
            t_max = m["temp_max_c"]
            precip = m["precipitation_mm"]
            frost_risk = m["frost_risk_likely"]

            # Classify month status for this crop
            status = "Dormant / Incompatible"
            suitability_score = 20

            if m_name_upper in target_planting_months:
                status = "Optimal Planting Window"
                suitability_score = 95
            elif m_name_upper in target_harvest_months:
                status = "Harvest Period"
                suitability_score = 90
            elif t_mean >= base_temp and not (frost_risk and crop["frost_tolerance"] == "None"):
                if t_max > heat_threshold:
                    status = "Heat Stress Risk"
                    suitability_score = 50
                else:
                    status = "Active Vegetative Growth"
                    suitability_score = 80
            elif frost_risk:
                status = "Frost / Sub-zero Dormancy"
                suitability_score = 30

            calendar_months.append({
                "month": m["month"],
                "status": status,
                "suitability_score": suitability_score,
                "temp_mean_c": t_mean,
                "temp_min_c": t_min,
                "temp_max_c": t_max,
                "precipitation_mm": precip,
                "is_planting_window": "Planting" in status,
                "is_harvest_window": "Harvest" in status
            })

        # Detailed Risk Breakdown
        early_risks = []
        late_risks = []

        if crop["growing_cycle_type"] == "Winter / Early Spring":
            early_risks.append("Early sowing risk: Excessive pre-winter vegetative growth causes excessive tillering and leaves plants vulnerable to freeze kill.")
            late_risks.append("Delayed planting risk: Poor autumn root establishment delays spring anthesis, shifting grain filling into intense summer heat and drought.")
        else: # Summer crop
            early_risks.append(f"Early sowing risk: Cold soil temperatures (< {base_temp}°C) induce seed rotting, poor seedling emergence, and severe late spring frost kill.")
            late_risks.append(f"Delayed planting risk: Flowering and grain/boll development delayed into extreme summer heat (> {heat_threshold}°C) and autumn rains during harvest.")

        return {
            "crop_id": crop["id"],
            "crop_name": crop["name"],
            "optimal_sowing_window": ", ".join(crop["recommended_planting_months"]),
            "expected_harvest_window": ", ".join(crop["harvest_months"]),
            "growing_season_duration": f"{crop['growing_season_days']} days (~{round(crop['growing_season_days']/30, 1)} months)",
            "monthly_schedule": calendar_months,
            "planting_risk_analysis": {
                "early_planting_risks": early_risks,
                "late_planting_risks": late_risks,
                "critical_soil_temp_c": base_temp,
                "heat_avoidance_threshold_c": heat_threshold
            },
            "scientific_disclaimer": "Planting windows represent statistical multi-year climate modeling; exact in-field planting dates must be confirmed with local short-term 5-day weather forecasts and real-time soil thermometer readings at 5cm seed depth."
        }

