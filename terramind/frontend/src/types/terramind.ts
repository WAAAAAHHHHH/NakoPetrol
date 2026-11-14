export interface MonthlyClimateRecord {
  month_index: number;
  month: string;
  temp_mean_c: number;
  temp_min_c: number;
  temp_max_c: number;
  precipitation_mm: number;
  precip_rate_mm_day: number;
  solar_radiation_mj_m2_day: number;
  relative_humidity_pct: number;
  wind_speed_mps: number;
  frost_risk_likely: boolean;
}

export interface ClimateSummary {
  annual_precipitation_mm: number;
  mean_annual_temp_c: number;
  min_monthly_temp_c: number;
  max_monthly_temp_c: number;
  annual_solar_radiation_mean_mj: number;
  frost_months_count: number;
  aridity_classification: string;
}

export interface ClimateData {
  metadata: {
    source: string;
    api_endpoint: string;
    methodology: string;
    data_status: string;
    is_synthetic: boolean;
    coordinates: { latitude: number; longitude: number };
    elevation_m: number;
    resolution: string;
    scientific_citation: string;
    transparency_note?: string;
  };
  summary: ClimateSummary;
  monthly: MonthlyClimateRecord[];
  data_source_mode?: string;
}

export interface SoilDepthInterval {
  ph: number;
  clay: number;
  soc: number;
}

export interface SoilProperties {
  ph_h2o: number;
  usda_texture: string;
  clay_pct: number;
  sand_pct: number;
  silt_pct: number;
  soc_g_kg: number;
  soc_percentage: number;
  cec_cmolc_kg: number;
  bulk_density_g_cm3: number;
  soil_type_wrb: string;
  drainage_class: string;
  salinity_ec_ds_m: number;
  depth_intervals: Record<string, SoilDepthInterval>;
}

export interface SoilData {
  metadata: {
    source: string;
    reference_region: string;
    coordinates: { latitude: number; longitude: number };
    spatial_resolution: string;
    is_synthetic: boolean;
    disclaimer: string;
  };
  properties: SoilProperties;
  agronomic_evaluation: {
    suitability_summary: string;
    key_findings: string[];
    fertility_guidance: string;
  };
}

export interface CropRecommendation {
  crop_id: string;
  name: string;
  scientific_name: string;
  category: string;
  icon: string;
  rank?: number;
  overall_score: number;
  component_scores: {
    climate_temperature: number;
    water_availability: number;
    soil_compatibility: number;
    climate_risk_safety: number;
  };
  parameters: {
    water_required_mm: string;
    optimal_temp_c: string;
    ideal_ph: string;
    growing_season_days: number;
    drought_tolerance: string;
    frost_tolerance: string;
  };
  recommended_planting_period: string;
  harvest_period: string;
  reasons: string[];
  identified_risks: string[];
  rotation_advice: string;
  // Extended fields from suitability engine v2
  suitability_description?: string;
  limiting_factors?: string[];
  water_efficiency_rating?: string;
  resilience_classification?: string;
}

export interface VegetationTimeSeriesPoint {
  date: string;
  month: string;
  ndvi: number;
  nir_reflectance: number;
  red_reflectance: number;
  status: string;
  vci_pct: number;
}

export interface SatelliteData {
  metadata: {
    sensor_platform: string;
    spatial_resolution: string;
    band_configuration: string;
    coordinates: { latitude: number; longitude: number };
    is_synthetic: boolean;
    scientific_formula: string;
    transparency_note: string;
  };
  current_observation: {
    latest_date: string;
    mean_field_ndvi: number;
    min_field_ndvi: number;
    max_field_ndvi: number;
    standard_deviation: number;
    vegetation_health_status: string;
    vegetation_condition_index_pct: number;
    stress_anomaly: string;
  };
  time_series: VegetationTimeSeriesPoint[];
  interpretation_guide: Array<{ range: string; classification: string }>;
}

export interface RiskCategory {
  score: number;
  level: string;
  description: string;
  key_metric: string;
}

export interface ClimateRisksData {
  overall_climate_vulnerability_index: number;
  vulnerability_classification: string;
  risk_categories: {
    drought: RiskCategory;
    heat_stress: RiskCategory;
    frost_hazard: RiskCategory;
    excessive_rainfall: RiskCategory;
  };
  scientific_disclaimer: string;
}

export interface RotationRecommendation {
  crop_id: string;
  name: string;
  rotation_rank: number;
  strategy: string;
  agronomic_benefit: string;
  water_fit: string;
}

export interface RotationPlanData {
  previous_crop: {
    id: string;
    name: string;
    crop_family: string;
    soil_legacy_assessment: string;
  };
  agronomic_cautions: string[];
  recommended_rotation_sequence: RotationRecommendation[];
  four_year_ideal_rotation_plan: string[];
}

export interface FieldDigitalTwin {
  field_name: string;
  coordinates: { latitude: number; longitude: number };
  area_hectares: number;
  polygon_coordinates?: number[][];
  irrigation_available: boolean;
  previous_crop_id: string;
  is_arable_land?: boolean;
  surface_classification?: string;
  marine_water_body?: string;
  climate: ClimateData;
  soil: SoilData;
  satellite: SatelliteData;
  climate_risks: ClimateRisksData;
  crop_recommendations: CropRecommendation[];
  rotation_plan: RotationPlanData;
  system_status: string;
}

export interface DemoField {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  area_hectares: number;
  elevation_m: number;
  default_previous_crop: string;
  irrigation_available: boolean;
  description: string;
  polygon_coordinates: number[][];
}

export interface ScoringWeights {
  weight_climate_temp: number;
  weight_water: number;
  weight_soil: number;
  weight_risk: number;
}

export interface ScenarioParams {
  scenario_name: string;
  crop_id: string;
  rainfall_change_pct: number;
  temperature_shift_c: number;
  planting_delay_days: number;
  irrigation_mode: string;
}

export interface SimulatedScenarioResult {
  scenario_name: string;
  crop_id: string;
  crop_name: string;
  parameters_applied: {
    rainfall_change_pct: string;
    adjusted_annual_rainfall_mm: number;
    temperature_shift_c: string;
    adjusted_mean_temp_c: number;
    planting_delay_days: string;
    irrigation_mode: string;
  };
  simulated_metrics: {
    overall_suitability_score: number;
    water_satisfaction_score: number;
    temperature_compatibility_score: number;
    water_deficit_mm: number;
    peak_summer_temp_c: number;
  };
  delay_impact_analysis: string;
  key_management_challenges: string[];
}

