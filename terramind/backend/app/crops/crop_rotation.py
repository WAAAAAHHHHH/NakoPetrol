"""
TerraMind Crop Rotation Intelligence Engine
Evaluates botanical family succession, soil nutrient dynamics, biological nitrogen fixation,
and soil-borne pathogen cycles (Fusarium, Nematodes, Verticillium, Rhizoctonia).
"""

from typing import Dict, Any, List
from app.crops.crop_database import CROP_DATABASE

class CropRotationAdvisor:
    def __init__(self):
        self.crop_db = CROP_DATABASE

    def evaluate_rotation(self, previous_crop_id: str, field_soil: Dict[str, Any], irrigation_available: bool = False) -> Dict[str, Any]:
        """
        Analyzes previous crop family and generates ranked, scientifically justified
        crop rotation alternatives for the upcoming season.
        """
        prev_crop = self.crop_db.get(previous_crop_id.lower())
        if not prev_crop:
            prev_crop = self.crop_db["wheat"]

        prev_family = prev_crop["crop_family"]
        recommendations = []
        cautions = []

        # Analyze biological impact of previous crop
        if "Poaceae" in prev_family: # Wheat, Barley, Corn, Rice
            soil_impact = (
                f"Previous {prev_crop['name']} extracted substantial soil nitrogen and left fibrous root residue. "
                "Successive cereal monoculture increases risk of foot rot (Oculimacula yallundae) and root rot (Bipolaris sorokiniana)."
            )
            cautions.append("Avoid back-to-back cereal planting if possible to prevent soil nutrient exhaustion and fungal build-up.")

            # Top rotation recommendations: Nitrogen-fixing Legumes and Deep-taproot Oilseeds
            recommendations.append({
                "crop_id": "chickpeas",
                "name": "Chickpeas",
                "rotation_rank": 1,
                "strategy": "Biological Nitrogen Fixation & Soil Restoration",
                "agronomic_benefit": "Fabaceae legume breaks cereal fungal root diseases and biologically fixes 40-70 kg N/ha, replenishing soil fertility for following crops.",
                "water_fit": "Well-suited for dryland rainfed rotation."
            })
            recommendations.append({
                "crop_id": "lentils",
                "name": "Red / Green Lentils",
                "rotation_rank": 2,
                "strategy": "Pulse Nitrogen Restitution",
                "agronomic_benefit": "Symbiotic Rhizobium fixation enriches topsoil nitrates, requires minimal water, and matures early.",
                "water_fit": "Excellent for semiarid winter-spring rotation."
            })
            recommendations.append({
                "crop_id": "sunflower",
                "name": "Oilseed Sunflower",
                "rotation_rank": 3,
                "strategy": "Deep Soil Moisture & Taproot Profile Restructuring",
                "agronomic_benefit": "Deep 1.8m taproot extracts deep subsoil nutrients that shallow cereal roots could not reach, restructuring dense subsoil.",
                "water_fit": "Moderate water demand; extracts residual deep moisture."
            })
            if irrigation_available:
                recommendations.append({
                    "crop_id": "soybean",
                    "name": "Soybean",
                    "rotation_rank": 4,
                    "strategy": "High-Value Irrigated Legume Rotation",
                    "agronomic_benefit": "Highest nitrogen-fixing capability among annual legumes; enriches soil while providing high market value.",
                    "water_fit": "Requires irrigation in semiarid zones."
                })

        elif "Fabaceae" in prev_family: # Chickpeas, Lentils, Soybean
            soil_impact = (
                f"Previous {prev_crop['name']} left residual biologically fixed nitrogen (estimated 40-80 kg N/ha) "
                "and broke fungal cereal cycles. Soil is primed for nutrient-demanding crops."
            )
            recommendations.append({
                "crop_id": "wheat",
                "name": "Winter Wheat",
                "rotation_rank": 1,
                "strategy": "High-Yield Cereal Capitalization",
                "agronomic_benefit": "Winter wheat directly utilizes the residual soil nitrates left by the pulse legume, reducing synthetic fertilizer costs and maximizing grain protein.",
                "water_fit": "Classic Mediterranean/Anatolian dryland rotation pairing."
            })
            recommendations.append({
                "crop_id": "barley",
                "name": "Barley",
                "rotation_rank": 2,
                "strategy": "Low-Input Cereal Cycle",
                "agronomic_benefit": "Produces exceptionally high yields on legume stubble with minimal additional nitrogen application.",
                "water_fit": "Resilient under drought-prone seasons."
            })
            if irrigation_available:
                recommendations.append({
                    "crop_id": "corn",
                    "name": "Grain Maize",
                    "rotation_rank": 3,
                    "strategy": "Nutrient-Demanding Summer Cash Crop",
                    "agronomic_benefit": "Heavy nitrogen consumer leverages legume organic nitrogen for rapid early vegetative growth.",
                    "water_fit": "Requires full irrigation."
                })

        elif "Solanaceae" in prev_family: # Tomatoes, Potatoes
            soil_impact = (
                f"Previous {prev_crop['name']} leaves potential risk of soil-borne Verticillium, Fusarium, and cyst nematodes. "
                "Strict mandatory break from any Solanaceae is required for at least 3 seasons."
            )
            cautions.append("STRICT WARNING: Do not plant potatoes or tomatoes back-to-back. High risk of Late Blight, soil nematode propagation, and bacterial wilt.")
            recommendations.append({
                "crop_id": "wheat",
                "name": "Winter Wheat",
                "rotation_rank": 1,
                "strategy": "Non-Host Disease Break Cereal",
                "agronomic_benefit": "Cereal is a non-host to Solanaceous nematodes and fungal wilts, allowing pathogen populations to naturally decline.",
                "water_fit": "Natural cool-season succession."
            })
            recommendations.append({
                "crop_id": "chickpeas",
                "name": "Chickpeas",
                "rotation_rank": 2,
                "strategy": "Broadleaf Legume Diversification",
                "agronomic_benefit": "Rebuilds biological soil health and fixes nitrogen while maintaining disease break.",
                "water_fit": "Requires well-drained soil."
            })

        else: # Sunflower, Cotton, etc.
            soil_impact = (
                f"Previous {prev_crop['name']} extracted deep subsoil moisture. "
                "Rotation should introduce non-host crops and allow moisture restoration."
            )
            recommendations.append({
                "crop_id": "wheat",
                "name": "Winter Wheat",
                "rotation_rank": 1,
                "strategy": "Cereal Succession",
                "agronomic_benefit": "Standard agronomic partner for breaking broadleaf weeds and oilseed pests.",
                "water_fit": "Capitalizes on winter rainfall."
            })
            recommendations.append({
                "crop_id": "lentils",
                "name": "Lentils",
                "rotation_rank": 2,
                "strategy": "Legume Soil Restoration",
                "agronomic_benefit": "Restores nitrogen and enhances soil structural porosity.",
                "water_fit": "Low water footprint."
            })

        return {
            "previous_crop": {
                "id": prev_crop["id"],
                "name": prev_crop["name"],
                "crop_family": prev_family,
                "soil_legacy_assessment": soil_impact
            },
            "agronomic_cautions": cautions,
            "recommended_rotation_sequence": recommendations,
            "four_year_ideal_rotation_plan": [
                f"Year 1: {prev_crop['name']}",
                "Year 2: Legume (Chickpeas / Lentils / Soybean) [Nitrogen Restoration]",
                "Year 3: Cereal (Wheat / Barley) [Nitrogen Uptake & Disease Break]",
                "Year 4: Deep Taproot / Cash Crop (Sunflower / Corn / Cotton) [Subsoil Exploration]"
            ]
        }

