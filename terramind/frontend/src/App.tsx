import React, { useState, useEffect } from 'react';
import { FarmelsterHeader, FarmelsterTab } from './components/EarthEyeHeader';
import { EarthEyeDashboardView } from './components/EarthEyeDashboardView';
import { FieldExplorer } from './components/FieldExplorer';
import { CropRecommendationsView } from './components/CropRecommendationsView';
import { SoilIntelligenceView } from './components/SoilIntelligenceView';
import { PlantingCalendarView } from './components/PlantingCalendarView';
import { SatelliteIntelligenceView } from './components/SatelliteIntelligenceView';
import { ClimateIntelligenceView } from './components/ClimateIntelligenceView';
import { WhatIfSimulatorView } from './components/WhatIfSimulatorView';
import { CropRotationView } from './components/CropRotationView';
import { AiAdvisorView } from './components/AiAdvisorView';
import { DataTransparencyModal } from './components/DataTransparencyModal';
import { SimplifiedDashboard } from './components/SimplifiedDashboard';

import { DemoField, FieldDigitalTwin, ScoringWeights } from './types/terramind';
import { terramindApi } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<FarmelsterTab>('dashboard');
  const [demoFields, setDemoFields] = useState<DemoField[]>([]);
  const [selectedField, setSelectedField] = useState<DemoField | null>(null);
  const [fieldDigitalTwin, setFieldDigitalTwin] = useState<FieldDigitalTwin | null>(null);
  
  const [irrigationAvailable, setIrrigationAvailable] = useState<boolean>(false);
  const [selectedCropIdForCalendar, setSelectedCropIdForCalendar] = useState<string>('wheat');
  const [customWeights, setCustomWeights] = useState<ScoringWeights>({
    weight_climate_temp: 0.30,
    weight_water: 0.30,
    weight_soil: 0.25,
    weight_risk: 0.15
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [showTransparencyModal, setShowTransparencyModal] = useState<boolean>(false);
  const [simplified, setSimplified] = useState<boolean>(false);

  // Initialize demo fields and load first field analysis
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      setLoading(true);
      try {
        const fields = await terramindApi.getDemoFields();
        if (!isMounted) return;
        setDemoFields(fields);

        if (fields.length > 0) {
          const first = fields[0]; // California Central Valley
          setSelectedField(first);
          setIrrigationAvailable(first.irrigation_available);
          setSelectedCropIdForCalendar(first.default_previous_crop || 'wheat');

          const analysis = await terramindApi.analyzeField({
            fieldName: first.name,
            latitude: first.latitude,
            longitude: first.longitude,
            areaHectares: first.area_hectares,
            polygonCoordinates: first.polygon_coordinates,
            irrigationAvailable: first.irrigation_available,
            previousCropId: first.default_previous_crop,
            customWeights
          });
          if (isMounted) setFieldDigitalTwin(analysis);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();
    return () => { isMounted = false; };
  }, []);

  // Handle switching field from dropdown or demo selector
  const handleSelectField = async (field: DemoField) => {
    setSelectedField(field);
    setIrrigationAvailable(field.irrigation_available);
    setSelectedCropIdForCalendar(field.default_previous_crop || 'wheat');
    setLoading(true);

    try {
      const analysis = await terramindApi.analyzeField({
        fieldName: field.name,
        latitude: field.latitude,
        longitude: field.longitude,
        areaHectares: field.area_hectares,
        polygonCoordinates: field.polygon_coordinates,
        irrigationAvailable: field.irrigation_available,
        previousCropId: field.default_previous_crop,
        customWeights
      });
      setFieldDigitalTwin(analysis);
    } catch (err) {
      console.error('Failed to analyze selected field:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle running custom coordinate analysis ANYWHERE on Earth
  const handleRunCustomAnalysis = async (
    name: string,
    lat: number,
    lon: number,
    area: number,
    irrig: boolean
  ) => {
    const latDelta = 0.003;
    const lonDelta = 0.003;

    const customDemo: DemoField = {
      id: `custom_${Date.now()}`,
      name,
      region: `Global Coordinates (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E)`,
      latitude: lat,
      longitude: lon,
      area_hectares: area,
      elevation_m: 350.0,
      default_previous_crop: 'wheat',
      irrigation_available: irrig,
      description: `Custom global parcel. Analyzed with live colocated NASA POWER agroclimatology and ISRIC SoilGrids 250m pedology.`,
      polygon_coordinates: [
        [lat - latDelta, lon - lonDelta],
        [lat + latDelta, lon - lonDelta],
        [lat + latDelta, lon + lonDelta],
        [lat - latDelta, lon + lonDelta]
      ]
    };

    setSelectedField(customDemo);
    setIrrigationAvailable(irrig);
    setLoading(true);

    try {
      const analysis = await terramindApi.analyzeField({
        fieldName: name,
        latitude: lat,
        longitude: lon,
        areaHectares: area,
        polygonCoordinates: customDemo.polygon_coordinates,
        irrigationAvailable: irrig,
        previousCropId: 'wheat',
        customWeights
      });
      setFieldDigitalTwin(analysis);
      if (analysis.is_arable_land === false) {
        setSelectedField(prev => prev ? {
          ...prev,
          name: analysis.marine_water_body || 'Open Marine Water Body',
          region: 'Marine Hydrosphere (Non-Arable)'
        } : prev);
      }
    } catch (err) {
      console.error('Custom global analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle weight updates
  const handleUpdateWeights = async (newWeights: ScoringWeights) => {
    setCustomWeights(newWeights);
    if (!selectedField) return;

    setLoading(true);
    try {
      const analysis = await terramindApi.analyzeField({
        fieldName: selectedField.name,
        latitude: selectedField.latitude,
        longitude: selectedField.longitude,
        areaHectares: selectedField.area_hectares,
        polygonCoordinates: selectedField.polygon_coordinates,
        irrigationAvailable,
        previousCropId: selectedField.default_previous_crop,
        customWeights: newWeights
      });
      setFieldDigitalTwin(analysis);
    } catch (err) {
      console.error('Failed to recalculate with weights:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentFieldLat = selectedField?.latitude || 36.8025;
  const currentFieldLon = selectedField?.longitude || -119.8145;
  const currentFieldName = selectedField?.name || 'San Joaquin Valley Farm';
  const annualPrecip = fieldDigitalTwin?.climate?.summary?.annual_precipitation_mm || 450.0;
  const meanTemp = fieldDigitalTwin?.climate?.summary?.mean_annual_temp_c || 16.5;

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0E0F12] text-white overflow-hidden font-sans select-none">
      {/* 1. TOP GLOBAL NAVIGATION HEADER */}
      <FarmelsterHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedField={selectedField}
        demoFields={demoFields}
        onSelectField={handleSelectField}
        onOpenDisclosures={() => setShowTransparencyModal(true)}
        simplified={simplified}
        onToggleSimplified={() => {
          setSimplified(s => {
            // when switching back to expert, reset to dashboard so the map always shows
            if (s) setActiveTab('dashboard');
            return !s;
          });
        }}
      />

      {/* 2. MAIN ACTIVE VIEWPORT */}
      <main className="flex-1 overflow-hidden relative">

        {/* ── SIMPLIFIED MODE ── */}
        {simplified && selectedField && (
          <SimplifiedDashboard
            fieldDigitalTwin={fieldDigitalTwin}
            fieldName={currentFieldName}
            loading={loading}
            onNavigateToTab={(tab) => {
              setSimplified(false);
              setActiveTab(tab as FarmelsterTab);
            }}
          />
        )}

        {/* ── EXPERT MODE (full tab router) ── */}
        {!simplified && selectedField && (
          <>
            {/* DASHBOARD -> Real Satellite Map + Left Telemetry + Right Layers */}
            {activeTab === 'dashboard' && (
              <EarthEyeDashboardView
                demoFields={demoFields}
                selectedField={selectedField}
                onSelectField={handleSelectField}
                fieldDigitalTwin={fieldDigitalTwin}
                loading={loading}
                onNavigateToTab={(tab: any) => setActiveTab(tab)}
                onRunCustomAnalysis={handleRunCustomAnalysis}
                onOpenDisclosures={() => setShowTransparencyModal(true)}
              />
            )}

            {/* CROPS -> Crop Planning & FAO Suitability Engine */}
            {activeTab === 'crops' && (
              <div className="h-full overflow-y-auto p-6 bg-[#0E0F12]">
                <CropRecommendationsView
                  crops={fieldDigitalTwin?.crop_recommendations || []}
                  weights={customWeights}
                  onUpdateWeights={handleUpdateWeights}
                  onSelectCropForCalendar={(cropId) => {
                    setSelectedCropIdForCalendar(cropId);
                    setActiveTab('calendar');
                  }}
                  fieldName={currentFieldName}
                />
              </div>
            )}

            {/* SOIL -> Soil Horizon Pedology Analysis */}
            {activeTab === 'soil' && (
              <div className="h-full overflow-y-auto p-6 bg-[#0E0F12]">
                <SoilIntelligenceView
                  soil={fieldDigitalTwin?.soil || null}
                  fieldName={currentFieldName}
                />
              </div>
            )}

            {/* CALENDAR -> Planting & Phenological Calendar */}
            {activeTab === 'calendar' && (
              <div className="h-full overflow-y-auto p-6 bg-[#0E0F12]">
                <PlantingCalendarView
                  crops={fieldDigitalTwin?.crop_recommendations || []}
                  selectedCropId={selectedCropIdForCalendar}
                  onSelectCrop={setSelectedCropIdForCalendar}
                  latitude={currentFieldLat}
                  longitude={currentFieldLon}
                  fieldName={currentFieldName}
                />
              </div>
            )}

            {/* SATELLITE -> Multi-Temporal Sentinel-2 / MODIS NDVI */}
            {activeTab === 'satellite' && (
              <div className="h-full overflow-y-auto p-6 bg-[#0E0F12]">
                <SatelliteIntelligenceView
                  satellite={fieldDigitalTwin?.satellite || null}
                  fieldName={currentFieldName}
                />
              </div>
            )}

            {/* SCENARIO -> What-If Climate Perturbation Simulator */}
            {activeTab === 'scenario' && (
              <div className="h-full overflow-y-auto p-6 bg-[#0E0F12]">
                <WhatIfSimulatorView
                  crops={fieldDigitalTwin?.crop_recommendations || []}
                  latitude={currentFieldLat}
                  longitude={currentFieldLon}
                  annualPrecip={annualPrecip}
                  meanTemp={meanTemp}
                  fieldName={currentFieldName}
                />
              </div>
            )}

            {/* CLIMATE -> NASA POWER Hydro-Thermal Climatogram */}
            {activeTab === 'climate' && (
              <div className="h-full overflow-y-auto p-6 bg-[#0E0F12]">
                <ClimateIntelligenceView
                  climate={fieldDigitalTwin?.climate || null}
                  risks={fieldDigitalTwin?.climate_risks || null}
                  fieldName={currentFieldName}
                />
              </div>
            )}

            {/* ROTATION -> Botanical Succession & Pathogen Breaks */}
            {activeTab === 'rotation' && (
              <div className="h-full overflow-y-auto p-6 bg-[#0E0F12]">
                <CropRotationView
                  currentCropId={selectedCropIdForCalendar}
                  latitude={currentFieldLat}
                  longitude={currentFieldLon}
                  irrigationAvailable={irrigationAvailable}
                  fieldName={currentFieldName}
                />
              </div>
            )}

            {/* ADVISOR -> Farmelster AI Agronomic Decision Engine */}
            {activeTab === 'advisor' && (
              <div className="h-full overflow-y-auto p-6 bg-[#0E0F12]">
                <AiAdvisorView
                  fieldDigitalTwin={fieldDigitalTwin}
                  rankedCrops={fieldDigitalTwin?.crop_recommendations || []}
                  fieldName={currentFieldName}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Global Scientific Methodology & Data Disclosures Modal */}
      <DataTransparencyModal
        isOpen={showTransparencyModal}
        onClose={() => setShowTransparencyModal(false)}
      />
    </div>
  );
}

export default App;
