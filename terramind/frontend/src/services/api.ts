import { 
  DemoField, 
  FieldDigitalTwin, 
  CropRecommendation, 
  ScoringWeights, 
  ScenarioParams, 
  SimulatedScenarioResult,
  RotationPlanData
} from '../types/terramind';

const API_BASE = '/api';

export const terramindApi = {
  async getDemoFields(): Promise<DemoField[]> {
    const res = await fetch(`${API_BASE}/demo-fields`);
    if (!res.ok) throw new Error(`Failed to load demo fields: ${res.statusText}`);
    const data = await res.json();
    return data.fields;
  },

  async analyzeField(
    params: {
      fieldName: string;
      latitude: number;
      longitude: number;
      areaHectares?: number;
      polygonCoordinates?: number[][];
      irrigationAvailable?: boolean;
      previousCropId?: string;
      customWeights?: ScoringWeights;
    }
  ): Promise<FieldDigitalTwin> {
    const res = await fetch(`${API_BASE}/field/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        field_name: params.fieldName,
        latitude: params.latitude,
        longitude: params.longitude,
        area_hectares: params.areaHectares || 30.0,
        polygon_coordinates: params.polygonCoordinates,
        irrigation_available: params.irrigationAvailable || false,
        previous_crop_id: params.previousCropId || 'wheat',
        custom_weights: params.customWeights
      })
    });
    if (!res.ok) throw new Error(`Field analysis failed: ${res.statusText}`);
    return res.json();
  },

  async getPlantingCalendar(cropId: string, latitude: number, longitude: number): Promise<any> {
    const res = await fetch(`${API_BASE}/crops/planting-calendar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop_id: cropId,
        latitude,
        longitude
      })
    });
    if (!res.ok) throw new Error(`Planting calendar failed: ${res.statusText}`);
    return res.json();
  },

  async runWhatIfSimulation(
    latitude: number,
    longitude: number,
    scenarios: ScenarioParams[]
  ): Promise<{ baseline_reference: any; scenarios_evaluated: SimulatedScenarioResult[]; scientific_disclaimer: string }> {
    const res = await fetch(`${API_BASE}/simulation/what-if`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude,
        longitude,
        scenarios
      })
    });
    if (!res.ok) throw new Error(`Simulation failed: ${res.statusText}`);
    return res.json();
  },

  async analyzeRotation(
    previousCropId: string,
    latitude: number,
    longitude: number,
    irrigationAvailable: boolean = false
  ): Promise<RotationPlanData> {
    const params = new URLSearchParams({
      previous_crop_id: previousCropId,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      irrigation_available: irrigationAvailable.toString()
    });
    const res = await fetch(`${API_BASE}/rotation/analyze?${params}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`Rotation analysis failed: ${res.statusText}`);
    return res.json();
  },

  async askAdvisor(
    query: string,
    fieldData: FieldDigitalTwin,
    rankedCrops?: CropRecommendation[]
  ): Promise<any> {
    const res = await fetch(`${API_BASE}/advisor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        field_data: fieldData,
        ranked_crops: rankedCrops || fieldData.crop_recommendations
      })
    });
    if (!res.ok) throw new Error(`Advisor query failed: ${res.statusText}`);
    return res.json();
  }
};

