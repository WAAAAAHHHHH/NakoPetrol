"""
Unit Tests for TerraMind Core Engines:
- NASA POWER Climate processing & precipitation conversion
- SoilGrids USDA texture classification and pH diagnostics
- Crop Suitability Engine (bounds checking 0-100, component weights)
- Planting Calendar Window Estimation
- Climate Risk Analyzer (Drought, Heat, Frost indices)
- What-If Scenario Simulator deltas
- Crop Rotation biological pathogen & nitrogen dynamics
"""

import unittest
import math
from app.climate.nasa_power import NasaPowerService
from app.soil.soil_intelligence import SoilIntelligenceService
from app.crops.crop_database import CROP_DATABASE
from app.recommendations.suitability_engine import CropSuitabilityEngine, ScoringWeights
from app.climate.planting_calendar import PlantingCalendarEngine
from app.climate.risk_analyzer import ClimateRiskAnalyzer
from app.crops.crop_rotation import CropRotationAdvisor
from app.simulation.what_if_simulator import WhatIfSimulator, ScenarioParams

class TestTerraMindCore(unittest.TestCase):

    def setUp(self):
        self.nasa = NasaPowerService(cache_dir="terramind/data/cache/test_climate")
        self.soil = SoilIntelligenceService()
        self.suitability = CropSuitabilityEngine()
        self.calendar = PlantingCalendarEngine()
        self.risk = ClimateRiskAnalyzer()
        self.rotation = CropRotationAdvisor()
        self.simulator = WhatIfSimulator()

    def test_nasa_power_climatology(self):
        # Test Konya coordinates
        res = self.nasa.get_climatology(37.87, 32.48)
        self.assertIn("summary", res)
        self.assertIn("monthly", res)
        self.assertEqual(len(res["monthly"]), 12)
        self.assertGreater(res["summary"]["annual_precipitation_mm"], 200.0)
        self.assertLess(res["summary"]["annual_precipitation_mm"], 900.0)
        self.assertIn("metadata", res)
        self.assertFalse(res["metadata"]["is_synthetic"])

    def test_soil_usda_classification_and_profile(self):
        # 34% clay, 28% sand, 38% silt -> Clay Loam
        texture = self.soil.classify_usda_texture(sand=28.0, clay=34.0, silt=38.0)
        self.assertEqual(texture, "Clay Loam")

        # Heavy clay
        texture_heavy = self.soil.classify_usda_texture(sand=15.0, clay=55.0, silt=30.0)
        self.assertEqual(texture_heavy, "Clay")

        # Test profile fetch for Harran
        prof = self.soil.get_soil_profile(37.16, 38.79)
        self.assertIn("properties", prof)
        self.assertGreater(prof["properties"]["ph_h2o"], 7.0) # Alkaline
        self.assertIn("agronomic_evaluation", prof)

    def test_crop_suitability_bounds_and_scoring(self):
        climate = self.nasa.get_climatology(37.87, 32.48)
        soil_prof = self.soil.get_soil_profile(37.87, 32.48)

        ranked = self.suitability.evaluate_field_crops(
            climate_summary=climate["summary"],
            monthly_climate=climate["monthly"],
            soil_properties=soil_prof["properties"],
            irrigation_available=False
        )

        self.assertEqual(len(ranked), len(CROP_DATABASE))
        for item in ranked:
            self.assertGreaterEqual(item["overall_score"], 0.0)
            self.assertLessEqual(item["overall_score"], 100.0)
            self.assertIn("component_scores", item)
            self.assertIn("reasons", item)
            self.assertGreater(len(item["reasons"]), 0)

        # In semiarid Konya rainfed, drought-hardy barley or wheat should rank near the top
        top_crop_ids = [c["crop_id"] for c in ranked[:3]]
        self.assertTrue("barley" in top_crop_ids or "wheat" in top_crop_ids or "lentils" in top_crop_ids)

    def test_planting_calendar_windows(self):
        climate = self.nasa.get_climatology(37.87, 32.48)
        soil_prof = self.soil.get_soil_profile(37.87, 32.48)

        cal = self.calendar.generate_crop_calendar("wheat", climate["monthly"], soil_prof["properties"])
        self.assertIn("monthly_schedule", cal)
        self.assertEqual(len(cal["monthly_schedule"]), 12)
        self.assertIn("planting_risk_analysis", cal)

    def test_climate_risk_analyzer(self):
        climate = self.nasa.get_climatology(37.87, 32.48)
        soil_prof = self.soil.get_soil_profile(37.87, 32.48)

        risks = self.risk.analyze_field_risks(climate["summary"], climate["monthly"], soil_prof["properties"])
        self.assertIn("risk_categories", risks)
        self.assertIn("drought", risks["risk_categories"])
        self.assertIn("heat_stress", risks["risk_categories"])
        self.assertIn("frost_hazard", risks["risk_categories"])
        self.assertGreaterEqual(risks["overall_climate_vulnerability_index"], 0.0)

    def test_crop_rotation_pathogen_break(self):
        soil_prof = self.soil.get_soil_profile(37.87, 32.48)
        rot = self.rotation.evaluate_rotation("wheat", soil_prof["properties"])
        self.assertIn("recommended_rotation_sequence", rot)
        self.assertGreater(len(rot["recommended_rotation_sequence"]), 1)
        # Wheat rotation should recommend legumes (chickpeas, lentils)
        recommended_ids = [r["crop_id"] for r in rot["recommended_rotation_sequence"]]
        self.assertTrue("chickpeas" in recommended_ids or "lentils" in recommended_ids)

    def test_what_if_simulator_precipitation_delta(self):
        climate = self.nasa.get_climatology(37.87, 32.48)
        soil_prof = self.soil.get_soil_profile(37.87, 32.48)

        scenarios = [
            ScenarioParams(scenario_name="Normal", crop_id="wheat", rainfall_change_pct=0.0),
            ScenarioParams(scenario_name="Drought -30%", crop_id="wheat", rainfall_change_pct=-30.0)
        ]

        sim_res = self.simulator.simulate_scenarios(
            base_climate_summary=climate["summary"],
            base_monthly=climate["monthly"],
            soil_profile=soil_prof["properties"],
            scenarios=scenarios
        )

        self.assertEqual(len(sim_res["scenarios_evaluated"]), 2)
        score_normal = sim_res["scenarios_evaluated"][0]["simulated_metrics"]["overall_suitability_score"]
        score_drought = sim_res["scenarios_evaluated"][1]["simulated_metrics"]["overall_suitability_score"]
        # Reduced rainfall must reduce suitability score
        self.assertLess(score_drought, score_normal)

if __name__ == "__main__":
    unittest.main()

