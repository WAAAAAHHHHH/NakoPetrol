"""
TerraMind Crop Suitability Scoring Engine
Evaluates multi-attribute agronomic compatibility across climate, soil chemistry,
water budget, and regional risk factors.
Transparent, non-black-box algorithmic scoring normalized to 0-100.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

from app.crops.crop_database import CROP_DATABASE

class ScoringWeights(BaseModel):
    weight_climate_temp: float = Field(default=0.30, ge=0.0, le=1.0)
    weight_water: float = Field(default=0.30, ge=0.0, le=1.0)
    weight_soil: float = Field(default=0.25, ge=0.0, le=1.0)
    weight_risk: float = Field(default=0.15, ge=0.0, le=1.0)

class CropSuitabilityEngine:
    def __init__(self, crop_db: Optional[Dict[str, Dict[str, Any]]] = None):
        self.crop_db = crop_db or CROP_DATABASE

    def evaluate_field_crops(
        self,
        climate_summary: Dict[str, Any],
        monthly_climate: List[Dict[str, Any]],
        soil_properties: Dict[str, Any],
        irrigation_available: bool = False,
        weights: Optional[ScoringWeights] = None
    ) -> List[Dict[str, Any]]:
        """
        Evaluates all crops against the field's climate and soil profile.
        Returns a ranked list of crops with full component scores and plain-language reasoning.
        """
        weights = weights or ScoringWeights()
        results = []

        annual_precip = float(climate_summary.get("annual_precipitation_mm", 400.0))
        mean_annual_temp = float(climate_summary.get("mean_annual_temp_c", 13.0))
        frost_months = int(climate_summary.get("frost_months_count", 2))

        field_ph = float(soil_properties.get("ph_h2o", 7.2))
        field_texture = str(soil_properties.get("usda_texture", "Loam"))
        field_clay = float(soil_properties.get("clay_pct", 30.0))
        field_drainage = str(soil_properties.get("drainage_class", "Well drained"))

        for crop_id, crop in self.crop_db.items():
            score_data = self._calculate_crop_score(
                crop=crop,
                annual_precip=annual_precip,
                mean_temp=mean_annual_temp,
                frost_months=frost_months,
                field_ph=field_ph,
                field_texture=field_texture,
                field_clay=field_clay,
                field_drainage=field_drainage,
                irrigation_available=irrigation_available,
                monthly_climate=monthly_climate,
                weights=weights
            )
            results.append(score_data)

        # Sort descending by overall suitability score
        results.sort(key=lambda x: x["overall_score"], reverse=True)

        for rank, item in enumerate(results, start=1):
            item["rank"] = rank

        return results

    def _calculate_crop_score(
        self,
        crop: Dict[str, Any],
        annual_precip: float,
        mean_temp: float,
        frost_months: int,
        field_ph: float,
        field_texture: str,
        field_clay: float,
        field_drainage: str,
        irrigation_available: bool,
        monthly_climate: List[Dict[str, Any]],
        weights: ScoringWeights
    ) -> Dict[str, Any]:
        """Calculates component sub-scores and synthesized narrative for a single crop."""
        
        # 1. Temperature Compatibility (0 - 100)
        opt_t_min, opt_t_max = crop["optimal_temp_c"]
        abs_t_min, abs_t_max = crop["absolute_temp_limits_c"]

        # Evaluate temperatures during crop's active growing season
        growing_type = crop["growing_cycle_type"]
        if "Winter" in growing_type:
            # Active vegetative in spring months (Mar-May)
            relevant_months = [m for m in monthly_climate if m["month"] in ["Mar", "Apr", "May"]]
        else:
            # Summer crop (May-Aug)
            relevant_months = [m for m in monthly_climate if m["month"] in ["May", "Jun", "Jul", "Aug"]]

        if relevant_months:
            season_mean_temp = sum(m["temp_mean_c"] for m in relevant_months) / len(relevant_months)
            season_max_temp = max(m["temp_max_c"] for m in relevant_months)
        else:
            season_mean_temp = mean_temp
            season_max_temp = mean_temp + 8.0

        if opt_t_min <= season_mean_temp <= opt_t_max:
            temp_score = 95.0
        elif abs_t_min <= season_mean_temp < opt_t_min:
            deficit = opt_t_min - season_mean_temp
            temp_score = max(30.0, 95.0 - (deficit * 8.0))
        elif opt_t_max < season_mean_temp <= abs_t_max:
            surplus = season_mean_temp - opt_t_max
            temp_score = max(30.0, 95.0 - (surplus * 10.0))
        else:
            temp_score = 15.0

        # Heat wave penalty if max temp exceeds heat stress threshold
        heat_threshold = float(crop.get("heat_stress_threshold_c", 35.0))
        if season_max_temp > heat_threshold:
            heat_penalty = min(25.0, (season_max_temp - heat_threshold) * 4.0)
            temp_score = max(10.0, temp_score - heat_penalty)

        # 2. Water Availability & Precipitation Compatibility (0 - 100)
        min_water_req, max_water_req = crop["water_requirement_mm"]
        effective_water = annual_precip if not irrigation_available else max(annual_precip, max_water_req * 0.95)

        if min_water_req <= effective_water <= max_water_req * 1.3:
            water_score = 95.0
        elif effective_water < min_water_req:
            deficit_pct = (min_water_req - effective_water) / min_water_req
            if crop["drought_tolerance"] in ["Very High", "Exceptional"]:
                # Drought-hardy crops (barley, lentils, chickpeas) penalized less
                water_score = max(35.0, 95.0 - (deficit_pct * 60.0))
            else:
                water_score = max(10.0, 95.0 - (deficit_pct * 110.0))
        else: # Excess water
            surplus_pct = (effective_water - (max_water_req * 1.3)) / max_water_req
            water_score = max(40.0, 95.0 - (surplus_pct * 40.0))

        # Paddy rice requires standing water
        if crop["id"] == "rice" and not irrigation_available:
            water_score = 5.0

        # 3. Soil Compatibility (0 - 100)
        # pH sub-score
        ideal_ph_min, ideal_ph_max = crop["ideal_ph_range"]
        accept_ph_min, accept_ph_max = crop["acceptable_ph_range"]

        if ideal_ph_min <= field_ph <= ideal_ph_max:
            ph_score = 95.0
        elif accept_ph_min <= field_ph <= accept_ph_max:
            ph_score = 75.0
        else:
            ph_score = max(20.0, 60.0 - abs(field_ph - 7.0) * 20.0)

        # Texture sub-score
        preferred_textures = crop["preferred_textures"]
        if any(field_texture.lower() in pt.lower() for pt in preferred_textures):
            texture_score = 95.0
        elif "Loam" in field_texture:
            texture_score = 80.0
        elif "Clay" in field_texture and crop["id"] in ["rice", "cotton", "wheat"]:
            texture_score = 85.0
        elif "Clay" in field_texture and crop["id"] in ["potatoes", "chickpeas"]:
            texture_score = 45.0  # Heavy clay impairs tuber expansion and legume root aeration
        else:
            texture_score = 65.0

        soil_score = round(0.55 * ph_score + 0.45 * texture_score, 1)

        # 4. Climate Risk Assessment (0 - 100 scale, higher is safer)
        risk_score = 85.0
        risks_identified = []

        if not irrigation_available and effective_water < min_water_req:
            deficit_mm = round(min_water_req - effective_water)
            risks_identified.append(f"Water Deficit Risk: Rainfed precipitation ({annual_precip}mm) falls short of crop need ({min_water_req}mm) by ~{deficit_mm}mm.")
            risk_score -= 25.0

        if frost_months > 2 and crop["frost_tolerance"] == "None":
            risks_identified.append("Frost Risk: Region experiences regular sub-zero winter temperatures; crop requires strict frost-free spring planting.")
            risk_score -= 15.0

        if season_max_temp >= heat_threshold:
            risks_identified.append(f"Heat Stress Risk: Peak summer temperatures (~{round(season_max_temp, 1)}°C) exceed crop sensitivity threshold ({heat_threshold}°C).")
            risk_score -= 15.0

        if "Clay" in field_texture and crop["id"] in ["potatoes", "chickpeas"]:
            risks_identified.append(f"Soil Drainage Risk: Heavy clay texture ({field_clay}%) increases risk of root rot and compaction.")
            risk_score -= 15.0

        risk_score = max(10.0, min(100.0, risk_score))

        # Overall Weighted Composite Score (0 - 100)
        overall_score = (
            weights.weight_climate_temp * temp_score +
            weights.weight_water * water_score +
            weights.weight_soil * soil_score +
            weights.weight_risk * risk_score
        )
        overall_score = round(max(0.0, min(100.0, overall_score)), 1)

        # Natural-language agronomic explanation
        reasons = []
        if temp_score >= 80:
            reasons.append(f"Thermal conditions align well with optimal vegetative growth ({opt_t_min}-{opt_t_max}°C).")
        else:
            reasons.append(f"Temperature profile presents thermal divergence from optimal requirements.")

        if water_score >= 80:
            reasons.append("Available moisture is adequate for expected crop evapotranspiration.")
        elif irrigation_available:
            reasons.append("Supplemental irrigation successfully bridges rainfed moisture deficits.")
        else:
            reasons.append(f"Severe rainfed water deficit: seasonal demand ({min_water_req}mm) exceeds precipitation ({annual_precip}mm).")

        if soil_score >= 80:
            reasons.append(f"Soil reaction (pH {field_ph}) and {field_texture} texture provide supportive rooting conditions.")
        else:
            reasons.append(f"Soil pH ({field_ph}) or texture may impose nutrient availability constraints.")

        # Recommended Planting Period
        planting_months = ", ".join(crop["recommended_planting_months"])

        # Explicit Limiting Factors Breakdown
        limiting_factors = []
        if water_score < 80:
            limiting_factors.append({
                "factor": "Water Deficit",
                "penalty_pts": round(95.0 - water_score, 1),
                "description": f"Annual precipitation ({round(annual_precip)}mm) is below optimal moisture need ({min_water_req}-{max_water_req}mm).",
                "category": "water"
            })
        if temp_score < 80:
            limiting_factors.append({
                "factor": "Thermal Divergence",
                "penalty_pts": round(95.0 - temp_score, 1),
                "description": f"Growing season mean temperature deviates from optimal range ({opt_t_min}-{opt_t_max}°C).",
                "category": "thermal"
            })
        if ph_score < 85:
            limiting_factors.append({
                "factor": "Soil pH Constraint",
                "penalty_pts": round(95.0 - ph_score, 1),
                "description": f"Field pH of {field_ph} is outside ideal range ({ideal_ph_min}-{ideal_ph_max}), impacting micronutrient availability.",
                "category": "soil"
            })
        if texture_score < 85:
            limiting_factors.append({
                "factor": "Texture Compatibility",
                "penalty_pts": round(95.0 - texture_score, 1),
                "description": f"{field_texture} texture presents physical rooting or drainage friction for this cultivar.",
                "category": "soil"
            })
        if not limiting_factors:
            limiting_factors.append({
                "factor": "Optimal Baseline",
                "penalty_pts": 0.0,
                "description": "No major environmental bottlenecks detected for this cultivar under baseline conditions.",
                "category": "general"
            })

        # Water Efficiency & Resilience Classification
        drought_tol = crop.get("drought_tolerance", "Moderate")
        if drought_tol in ["Exceptional", "Very High"]:
            water_eff = "Superior Drought Hardiness"
            resilience_class = "High Resilience"
        elif drought_tol == "High":
            water_eff = "Moderate-High Water Efficiency"
            resilience_class = "Resilient"
        elif drought_tol == "Moderate":
            water_eff = "Standard Evapotranspiration Need"
            resilience_class = "Moderate Resilience"
        else:
            water_eff = "High Water Demand (Vulnerable to Drought)"
            resilience_class = "Drought Vulnerable"

        return {
            "crop_id": crop["id"],
            "name": crop["name"],
            "scientific_name": crop["scientific_name"],
            "category": crop["category"],
            "icon": crop["icon"],
            "overall_score": overall_score,
            "component_scores": {
                "climate_temperature": round(temp_score, 1),
                "water_availability": round(water_score, 1),
                "soil_compatibility": round(soil_score, 1),
                "climate_risk_safety": round(risk_score, 1)
            },
            "limiting_factors": limiting_factors,
            "water_efficiency_rating": water_eff,
            "resilience_classification": resilience_class,
            "parameters": {
                "water_required_mm": f"{min_water_req}-{max_water_req} mm",
                "optimal_temp_c": f"{opt_t_min}-{opt_t_max} °C",
                "ideal_ph": f"{ideal_ph_min}-{ideal_ph_max}",
                "growing_season_days": crop["growing_season_days"],
                "drought_tolerance": crop["drought_tolerance"],
                "frost_tolerance": crop["frost_tolerance"]
            },
            "recommended_planting_period": planting_months,
            "harvest_period": ", ".join(crop["harvest_months"]),
            "reasons": reasons,
            "identified_risks": risks_identified if risks_identified else ["No severe environmental limiting factors identified under normal management."],
            "rotation_advice": crop["rotation_benefits"][0] if crop["rotation_benefits"] else "Follow balanced rotation cycle."
        }

