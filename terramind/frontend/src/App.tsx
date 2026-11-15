import React, { useState, useEffect, useCallback } from 'react';
import { FarmelsterHeader, FarmelsterTab } from './components/EarthEyeHeader';
import { EarthEyeDashboardView } from './components/EarthEyeDashboardView';
import { CropRecommendationsView } from './components/CropRecommendationsView';
import { SoilIntelligenceView } from './components/SoilIntelligenceView';
import { PlantingCalendarView } from './components/PlantingCalendarView';
import { SatelliteIntelligenceView } from './components/SatelliteIntelligenceView';
import { ClimateIntelligenceView } from './components/ClimateIntelligenceView';
import { WhatIfSimulatorView } from './components/WhatIfSimulatorView';
import { CropRotationView } from './components/CropRotationView';
import { AiAdvisorView } from './components/AiAdvisorView';
import { DataTransparencyModal } from './components/DataTransparencyModal';
import { FieldDossierModal } from './components/FieldDossierModal';
import { IntroSplash } from './components/IntroSplash';

import { DemoField, FieldDigitalTwin, ScoringWeights } from './types/terramind';
import { terramindApi } from './services/api';
import { DEFAULT_DEMO_FIELDS, DEFAULT_FIELD, BASELINE_DIGITAL_TWIN } from './services/defaultFields';

export function App() {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('farmelster_splash_dismissed');
    } catch {
      return false;
    }
  });

  const handleDismissSplash = useCallback(() => {
    setShowSplash(false);
    try {
      sessionStorage.setItem('farmelster_splash_dismissed', '1');
    } catch {
      // ignore
    }
  }, []);

  const [activeTab, setActiveTab]             = useState<FarmelsterTab>('dashboard');
  const [demoFields, setDemoFields]           = useState<DemoField[]>(DEFAULT_DEMO_FIELDS);
  const [selectedField, setSelectedField]     = useState<DemoField | null>(DEFAULT_FIELD);
  const [fieldDigitalTwin, setFieldDigitalTwin] = useState<FieldDigitalTwin | null>(BASELINE_DIGITAL_TWIN);

  const [irrigationAvailable, setIrrigationAvailable]           = useState<boolean>(true);
  const [selectedCropIdForCalendar, setSelectedCropIdForCalendar] = useState<string>('tomatoes');
  const [customWeights, setCustomWeights] = useState<ScoringWeights>({
    weight_climate_temp: 0.30,
    weight_water:        0.30,
    weight_soil:         0.25,
    weight_risk:         0.15,
  });

  const [loading, setLoading]                         = useState<boolean>(false);
  const [showTransparencyModal, setShowTransparencyModal] = useState<boolean>(false);
  const [showDossierModal, setShowDossierModal]           = useState<boolean>(false);

  // ── Init: load demo fields + first analysis ──────────────────────────────
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      setLoading(true);
      try {
        const fields = await terramindApi.getDemoFields();
        if (!isMounted) return;
        setDemoFields(fields);

        if (fields.length > 0) {
          const first = fields[0];
          setSelectedField(first);
          setIrrigationAvailable(first.irrigation_available);
          setSelectedCropIdForCalendar(first.default_previous_crop || 'wheat');

          const analysis = await terramindApi.analyzeField({
            fieldName:           first.name,
            latitude:            first.latitude,
            longitude:           first.longitude,
            areaHectares:        first.area_hectares,
            polygonCoordinates:  first.polygon_coordinates,
            irrigationAvailable: first.irrigation_available,
            previousCropId:      first.default_previous_crop,
            customWeights,
          });
          if (isMounted) setFieldDigitalTwin(analysis);
        }
      } catch (err) {
        console.error('Init error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    init();
    return () => { isMounted = false; };
  }, []);

  // ── Field selection ───────────────────────────────────────────────────────
  const handleSelectField = async (field: DemoField) => {
    setSelectedField(field);
    setIrrigationAvailable(field.irrigation_available);
    setSelectedCropIdForCalendar(field.default_previous_crop || 'wheat');
    setLoading(true);
    try {
      const analysis = await terramindApi.analyzeField({
        fieldName:           field.name,
        latitude:            field.latitude,
        longitude:           field.longitude,
        areaHectares:        field.area_hectares,
        polygonCoordinates:  field.polygon_coordinates,
        irrigationAvailable: field.irrigation_available,
        previousCropId:      field.default_previous_crop,
        customWeights,
      });
      setFieldDigitalTwin(analysis);
    } catch (err) {
      console.error('Field select error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Custom map click analysis ─────────────────────────────────────────────
  const handleRunCustomAnalysis = async (
    name: string, lat: number, lon: number, area: number, irrig: boolean
  ) => {
    const d = 0.003;
    const customDemo: DemoField = {
      id:                   `custom_${Date.now()}`,
      name,
      region:               `Global Coordinates (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E)`,
      latitude:             lat,
      longitude:            lon,
      area_hectares:        area,
      elevation_m:          350.0,
      default_previous_crop:'wheat',
      irrigation_available: irrig,
      description:          'Custom global parcel analyzed with live NASA POWER + ISRIC SoilGrids.',
      polygon_coordinates:  [
        [lat - d, lon - d], [lat + d, lon - d],
        [lat + d, lon + d], [lat - d, lon + d],
      ],
    };
    setSelectedField(customDemo);
    setIrrigationAvailable(irrig);
    setLoading(true);
    try {
      const analysis = await terramindApi.analyzeField({
        fieldName:           name,
        latitude:            lat,
        longitude:           lon,
        areaHectares:        area,
        polygonCoordinates:  customDemo.polygon_coordinates,
        irrigationAvailable: irrig,
        previousCropId:      'wheat',
        customWeights,
      });
      setFieldDigitalTwin(analysis);
      if (analysis.is_arable_land === false) {
        setSelectedField(prev => prev ? {
          ...prev,
          name:   analysis.marine_water_body || 'Open Marine Water Body',
          region: 'Marine Hydrosphere (Non-Arable)',
        } : prev);
      }
    } catch (err) {
      console.error('Custom analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Weight updates ────────────────────────────────────────────────────────
  const handleUpdateWeights = async (newWeights: ScoringWeights) => {
    setCustomWeights(newWeights);
    if (!selectedField) return;
    setLoading(true);
    try {
      const analysis = await terramindApi.analyzeField({
        fieldName:           selectedField.name,
        latitude:            selectedField.latitude,
        longitude:           selectedField.longitude,
        areaHectares:        selectedField.area_hectares,
        polygonCoordinates:  selectedField.polygon_coordinates,
        irrigationAvailable,
        previousCropId:      selectedField.default_previous_crop,
        customWeights:       newWeights,
      });
      setFieldDigitalTwin(analysis);
    } catch (err) {
      console.error('Weight update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentFieldLat  = selectedField?.latitude  || 36.8025;
  const currentFieldLon  = selectedField?.longitude  || -119.8145;
  const currentFieldName = selectedField?.name       || 'San Joaquin Valley Farm';
  const annualPrecip     = fieldDigitalTwin?.climate?.summary?.annual_precipitation_mm || 450.0;
  const meanTemp         = fieldDigitalTwin?.climate?.summary?.mean_annual_temp_c      || 16.5;

  return (
    <>
      {/* ── ENTRANCE SPLASH ── */}
      {showSplash && <IntroSplash onDone={handleDismissSplash} />}

      {/* ── MAIN APP ── */}
      <div className="flex flex-col h-screen w-screen bg-[#0E0F12] text-white overflow-hidden font-sans select-none">

        <FarmelsterHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedField={selectedField}
          demoFields={demoFields}
          onSelectField={handleSelectField}
          onOpenDisclosures={() => setShowTransparencyModal(true)}
          onOpenDossier={() => setShowDossierModal(true)}
        />

        <main className="flex-1 overflow-hidden relative">
          {selectedField && (
            <>
              {/* DASHBOARD */}
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
                  onOpenDossier={() => setShowDossierModal(true)}
                />
              )}

              {/* CROPS */}
              {activeTab === 'crops' && (
                <div className="h-full overflow-y-auto p-6 bg-[#0E0F12] anim-fade-in">
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

              {/* SOIL */}
              {activeTab === 'soil' && (
                <div className="h-full overflow-y-auto p-6 bg-[#0E0F12] anim-fade-in">
                  <SoilIntelligenceView
                    soil={fieldDigitalTwin?.soil || null}
                    fieldName={currentFieldName}
                  />
                </div>
              )}

              {/* CALENDAR */}
              {activeTab === 'calendar' && (
                <div className="h-full overflow-y-auto p-6 bg-[#0E0F12] anim-fade-in">
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

              {/* SATELLITE */}
              {activeTab === 'satellite' && (
                <div className="h-full overflow-y-auto p-6 bg-[#0E0F12] anim-fade-in">
                  <SatelliteIntelligenceView
                    satellite={fieldDigitalTwin?.satellite || null}
                    fieldName={currentFieldName}
                  />
                </div>
              )}

              {/* SCENARIO */}
              {activeTab === 'scenario' && (
                <div className="h-full overflow-y-auto p-6 bg-[#0E0F12] anim-fade-in">
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

              {/* CLIMATE */}
              {activeTab === 'climate' && (
                <div className="h-full overflow-y-auto p-6 bg-[#0E0F12] anim-fade-in">
                  <ClimateIntelligenceView
                    climate={fieldDigitalTwin?.climate || null}
                    risks={fieldDigitalTwin?.climate_risks || null}
                    fieldName={currentFieldName}
                  />
                </div>
              )}

              {/* ROTATION */}
              {activeTab === 'rotation' && (
                <div className="h-full overflow-y-auto p-6 bg-[#0E0F12] anim-fade-in">
                  <CropRotationView
                    currentCropId={selectedCropIdForCalendar}
                    latitude={currentFieldLat}
                    longitude={currentFieldLon}
                    irrigationAvailable={irrigationAvailable}
                    fieldName={currentFieldName}
                  />
                </div>
              )}

              {/* ADVISOR */}
              {activeTab === 'advisor' && (
                <div className="h-full overflow-y-auto p-6 bg-[#0E0F12] anim-fade-in">
                  <AiAdvisorView
                    fieldDigitalTwin={fieldDigitalTwin}
                    rankedCrops={fieldDigitalTwin?.crop_recommendations || []}
                    fieldName={currentFieldName}
                  />
                </div>
              )}
            </>
          )}

          {!selectedField && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-white/40">
              <div className="w-7 h-7 border-2 border-white/10 border-t-[#7C9A6B] rounded-full animate-spin" />
              <span className="text-xs font-medium">Loading Farmelster Intelligence...</span>
            </div>
          )}
        </main>

        <DataTransparencyModal
          isOpen={showTransparencyModal}
          onClose={() => setShowTransparencyModal(false)}
        />

        <FieldDossierModal
          isOpen={showDossierModal}
          onClose={() => setShowDossierModal(false)}
          selectedField={selectedField}
          fieldDigitalTwin={fieldDigitalTwin}
        />
      </div>
    </>
  );
}

export default App;
