import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Compass, 
  Search, 
  ArrowRight
} from 'lucide-react';
import { DemoField, FieldDigitalTwin } from '../types/terramind';

export type MapLayerType = 'topo' | 'satellite' | 'ndvi' | 'soil';

interface FieldExplorerProps {
  demoFields: DemoField[];
  selectedField: DemoField;
  onSelectField: (field: DemoField) => void;
  fieldDigitalTwin: FieldDigitalTwin | null;
  onRunCustomAnalysis: (name: string, lat: number, lon: number, area: number, irrig: boolean) => void;
  loading: boolean;
  onNavigateToTab: (tab: any) => void;
}

export const FieldExplorer: React.FC<FieldExplorerProps> = ({
  demoFields,
  selectedField,
  onSelectField,
  fieldDigitalTwin,
  onRunCustomAnalysis,
  loading,
  onNavigateToTab
}) => {
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('topo');
  const [hoverCoords, setHoverCoords] = useState<{ lat: number; lon: number } | null>(null);

  // Custom coordinate input state
  const [customName, setCustomName] = useState('Cadastral Survey Parcel');
  const [customLat, setCustomLat] = useState(selectedField.latitude.toString());
  const [customLon, setCustomLon] = useState(selectedField.longitude.toString());
  const [customArea, setCustomArea] = useState(selectedField.area_hectares.toString());
  const [customIrrig, setCustomIrrig] = useState(selectedField.irrigation_available);
  const [showCustomForm, setShowCustomForm] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    const area = parseFloat(customArea) || 25.0;
    if (isNaN(lat) || isNaN(lon)) return;
    onRunCustomAnalysis(customName, lat, lon, area, customIrrig);
    setShowCustomForm(false);
  };

  const topCrop = fieldDigitalTwin?.crop_recommendations?.[0];
  const climateSummary = fieldDigitalTwin?.climate?.summary;
  const soilProps = fieldDigitalTwin?.soil?.properties;
  const satCurrent = fieldDigitalTwin?.satellite?.current_observation;

  return (
    <div className="space-y-4">
      {/* Top Context Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#8E929C]">
            Cartographic Workspace &bull; Project Area Registry
          </div>
          <h1 className="font-serif text-xl font-bold text-white">
            {selectedField.name}
          </h1>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="px-3 py-1.5 bg-[#18191E] hover:bg-[#202229] border border-white/10 rounded-sm text-white font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Search size={12} className="text-[#22C55E]" />
            <span>{showCustomForm ? 'Close Coordinates' : 'Input Coordinates'}</span>
          </button>
          
          <button
            onClick={() => onNavigateToTab('crops')}
            className="px-3 py-1.5 bg-[#22C55E] hover:bg-[#15803D] text-[#0E0F12] rounded-sm font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Assess Crops</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Custom Coordinate Form Drawer */}
      {showCustomForm && (
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-4 text-xs">
          <div className="text-xs font-serif font-bold text-white mb-2 flex items-center gap-1.5">
            <Compass size={14} className="text-[#22C55E]" />
            <span>Manual Coordinate Geocoding &amp; Boundary Registration</span>
          </div>
          <form onSubmit={handleCustomSubmit} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-mono uppercase text-[#8E929C] block mb-1">Parcel Identifier</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-[#18191E] border border-white/10 px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-[#22C55E]"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-[#8E929C] block mb-1">Latitude (°N)</label>
              <input
                type="number"
                step="0.0001"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                className="w-full bg-[#18191E] border border-white/10 px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-[#22C55E]"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-[#8E929C] block mb-1">Longitude (°E)</label>
              <input
                type="number"
                step="0.0001"
                value={customLon}
                onChange={(e) => setCustomLon(e.target.value)}
                className="w-full bg-[#18191E] border border-white/10 px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-[#22C55E]"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#22C55E] hover:bg-[#15803D] text-[#0E0F12] py-1.5 px-3 rounded-sm font-mono text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'CALCULATING...' : 'EXECUTE ANALYSIS'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Workspace Layout: Large Central GIS Map (8 cols) + Right Contextual Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Large Central GIS Map Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-2">
          {/* Map Sub-Toolbar: Layer Switcher & Tools */}
          <div className="bg-[#18191E] border border-white/10 rounded-sm px-3 py-1.5 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-mono uppercase text-[#8E929C] font-semibold flex items-center gap-1 mr-1">
                <Layers size={13} className="text-[#22C55E]" /> Layer:
              </span>

              {[
                { key: 'topo', label: 'Topographic Vector' },
                { key: 'satellite', label: 'Sentinel-2 RGB' },
                { key: 'ndvi', label: 'NDVI False-Color' },
                { key: 'soil', label: 'Pedological Map' }
              ].map((lyr) => (
                <button
                  key={lyr.key}
                  onClick={() => setActiveLayer(lyr.key as MapLayerType)}
                  className={`px-2 py-0.5 rounded-sm font-mono text-[11px] transition-colors cursor-pointer ${
                    activeLayer === lyr.key
                      ? 'bg-[#22C55E] text-[#0E0F12]'
                      : 'text-stone-300 hover:bg-[#202229]'
                  }`}
                >
                  {lyr.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 text-[11px] font-mono text-[#8E929C]">
              <span className="hidden sm:inline">PROJECTION: WGS 84 / UTM 36N</span>
            </div>
          </div>

          {/* Interactive GIS Map Canvas */}
          <div 
            className="relative h-[480px] w-full bg-[#202229] border border-white/10 rounded-sm overflow-hidden select-none flex items-center justify-center cursor-crosshair"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const dx = (e.clientX - rect.left) / rect.width - 0.5;
              const dy = (e.clientY - rect.top) / rect.height - 0.5;
              setHoverCoords({
                lat: selectedField.latitude - dy * 0.04,
                lon: selectedField.longitude + dx * 0.04
              });
            }}
            onMouseLeave={() => setHoverCoords(null)}
          >
            {/* Background Grid Pattern (Technical Cartography Coordinates) */}
            <div 
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }}
            />

            {/* Cartographic Coordinate Labels along Borders */}
            <div className="absolute top-2 left-2 text-[9px] font-mono text-[#8E929C]">
              {(selectedField.latitude + 0.02).toFixed(4)}° N
            </div>
            <div className="absolute bottom-2 left-2 text-[9px] font-mono text-[#8E929C]">
              {(selectedField.latitude - 0.02).toFixed(4)}° N
            </div>
            <div className="absolute top-2 right-2 text-[9px] font-mono text-[#8E929C]">
              {(selectedField.longitude + 0.02).toFixed(4)}° E
            </div>
            <div className="absolute bottom-2 right-2 text-[9px] font-mono text-[#8E929C]">
              {(selectedField.longitude - 0.02).toFixed(4)}° E
            </div>

            {/* Simulated Satellite / Thematic Texture Based on activeLayer */}
            <div 
              className={`absolute inset-0 transition-opacity duration-300 ${
                activeLayer === 'satellite' 
                  ? 'opacity-35 bg-cover bg-center' 
                  : activeLayer === 'ndvi'
                  ? 'opacity-25 bg-[radial-gradient(circle_at_center,_#A6B58A_0%,_#22C55E_60%,_#202229_100%)]'
                  : activeLayer === 'soil'
                  ? 'opacity-20 bg-[radial-gradient(circle_at_center,_#B5B7AB_0%,_rgba(255,255,255,0.1)_100%)]'
                  : 'opacity-10'
              }`}
              style={{
                backgroundImage: activeLayer === 'satellite' 
                  ? `radial-gradient(circle at 50% 50%, rgba(36, 77, 56, 0.4), rgba(234, 232, 222, 0.8))`
                  : undefined
              }}
            />

            {/* Field Boundary Polygon Representation */}
            <div className="relative z-10 w-80 h-72 border-2 border-[#22C55E] bg-[#22C55E]/10 rounded-xs flex flex-col items-center justify-between p-3.5 shadow-xs">
              {/* Corner Coordinate Tick Markers */}
              <div className="w-full flex justify-between text-[8px] font-mono text-[#22C55E]">
                <span>+ NW 01</span>
                <span>+ NE 02</span>
              </div>

              {/* Center Inspection Badge */}
              <div className="bg-[#18191E] border border-white/10 p-3 rounded-xs text-center shadow-xs">
                <span className="text-[9px] font-mono uppercase text-[#8E929C] block">Cadastral Boundary</span>
                <span className="font-serif font-bold text-sm text-white block leading-tight mt-0.5">
                  {selectedField.name}
                </span>
                <div className="mt-2 text-[11px] font-mono text-[#22C55E] font-semibold">
                  AREA: {selectedField.area_hectares} ha &bull; {round(selectedField.area_hectares * 10, 0)} da
                </div>
                <div className="text-[10px] font-mono text-[#8E929C] mt-0.5">
                  ELEVATION: {selectedField.elevation_m} m AMSL
                </div>
              </div>

              <div className="w-full flex justify-between text-[8px] font-mono text-[#22C55E]">
                <span>+ SW 03</span>
                <span>+ SE 04</span>
              </div>
            </div>

            {/* Scale Bar (Bottom Left) */}
            <div className="absolute bottom-3 left-4 bg-[#18191E] border border-white/10 px-2 py-1 text-[9px] font-mono text-white rounded-xs shadow-xs flex items-center space-x-2">
              <div className="w-16 h-1 bg-[#FFFFFF] relative">
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#8E929C]" />
              </div>
              <span>500 m</span>
            </div>

            {/* North Arrow / Cartographic Compass (Top Right) */}
            <div className="absolute top-4 right-4 bg-[#18191E] border border-white/10 p-1.5 text-[10px] font-mono text-[#22C55E] font-bold rounded-xs shadow-xs flex flex-col items-center">
              <span>N</span>
              <div className="w-0 h-0 border-x-4 border-x-transparent border-b-8 border-b-[#22C55E]" />
            </div>

            {/* Live Hover Coordinate Readout */}
            {hoverCoords && (
              <div className="absolute top-4 left-4 bg-[#18191E] border border-white/10 px-2.5 py-1 text-[10px] font-mono text-white rounded-xs shadow-xs">
                POINTER: {hoverCoords.lat.toFixed(4)}° N, {hoverCoords.lon.toFixed(4)}° E
              </div>
            )}
          </div>

          {/* Regional Benchmark Cadastral Basin Table */}
          <div className="bg-[#18191E] border border-white/10 rounded-sm p-3">
            <div className="text-[10px] font-mono uppercase text-[#8E929C] font-semibold mb-2">
              National Agricultural Basins Registry (Turkey Demonstration Cases)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              {demoFields.map((field) => {
                const isSelected = field.id === selectedField.id;
                return (
                  <button
                    key={field.id}
                    onClick={() => onSelectField(field)}
                    className={`p-2 rounded-sm border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#22C55E] border-[#22C55E] text-[#0E0F12]'
                        : 'bg-[#18191E] border-white/10 text-white hover:bg-[#202229]'
                    }`}
                  >
                    <div className="font-serif font-bold text-xs truncate leading-tight">
                      {field.name.split(' ')[0]}
                    </div>
                    <div className={`text-[10px] truncate ${isSelected ? 'text-[#A6B58A]' : 'text-[#8E929C]'}`}>
                      {field.region.split(',')[0]}
                    </div>
                    <div className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-[#0E0F12]' : 'text-stone-300'}`}>
                      {field.area_hectares} ha &bull; {field.irrigation_available ? 'Irrig.' : 'Rainfed'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Contextual Analysis Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          {/* Spatial Cadastre & Topography Dossier */}
          <div className="bg-[#18191E] border border-white/10 rounded-sm p-4">
            <div className="text-[10px] font-mono uppercase text-[#8E929C] font-semibold mb-2 pb-1 border-b border-white/10">
              Cadastral Metadata &amp; Bounds
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8E929C]">Parcel Designation:</span>
                <span className="font-semibold text-white">{selectedField.name}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#8E929C]">Registered Area:</span>
                <span className="font-bold text-[#22C55E]">{selectedField.area_hectares} ha ({round(selectedField.area_hectares * 10, 0)} da)</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#8E929C]">Centroid Elevation:</span>
                <span className="text-white">{selectedField.elevation_m} m AMSL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E929C]">Management System:</span>
                <span className="font-mono text-[#22C55E] font-semibold">
                  {selectedField.irrigation_available ? 'Surface / Drip Irrigation' : 'Rainfed Steppe'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E929C]">Preceding Crop:</span>
                <span className="text-white capitalize">{selectedField.default_previous_crop}</span>
              </div>
            </div>
          </div>

          {/* Pedological Summary */}
          <div className="bg-[#18191E] border border-white/10 rounded-sm p-4">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase text-[#8E929C] font-semibold mb-2 pb-1 border-b border-white/10">
              <span>Soil Intelligence (ISRIC 250m)</span>
              <button 
                onClick={() => onNavigateToTab('soil')} 
                className="text-[#22C55E] hover:underline cursor-pointer"
              >
                Detail &rarr;
              </button>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8E929C]">USDA Texture:</span>
                <span className="font-semibold text-white">{soilProps?.usda_texture || 'Clay Loam'}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#8E929C]">Soil Reaction (pH):</span>
                <span className="font-bold text-white">pH {soilProps?.ph_h2o || '7.8'}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#8E929C]">Clay Content:</span>
                <span className="text-white">{soilProps?.clay_pct || '34'}%</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#8E929C]">Organic Carbon (SOC):</span>
                <span className="text-white">{soilProps?.soc_g_kg || '14.5'} g/kg ({soilProps?.soc_percentage}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E929C]">Drainage Class:</span>
                <span className="text-stone-300">{soilProps?.drainage_class || 'Moderately well drained'}</span>
              </div>
            </div>
          </div>

          {/* Agroclimatological Summary */}
          <div className="bg-[#18191E] border border-white/10 rounded-sm p-4">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase text-[#8E929C] font-semibold mb-2 pb-1 border-b border-white/10">
              <span>Climate Baseline (NASA POWER)</span>
              <button 
                onClick={() => onNavigateToTab('climate')} 
                className="text-[#22C55E] hover:underline cursor-pointer"
              >
                Detail &rarr;
              </button>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-[#8E929C]">Annual Precipitation:</span>
                <span className="font-bold text-[#22C55E]">{climateSummary?.annual_precipitation_mm || '400.0'} mm</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#8E929C]">Mean Temperature:</span>
                <span className="text-white">{climateSummary?.mean_annual_temp_c || '13.2'} °C</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#8E929C]">Annual Temperature Range:</span>
                <span className="text-stone-300">{climateSummary?.min_monthly_temp_c}°C to {climateSummary?.max_monthly_temp_c}°C</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#8E929C]">Frost Months Count:</span>
                <span className="text-white">{climateSummary?.frost_months_count || '2'} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E929C]">Aridity Index:</span>
                <span className="text-[#22C55E] font-semibold">{climateSummary?.aridity_classification || 'Semiarid'}</span>
              </div>
            </div>
          </div>

          {/* Remote Sensing Observation Snapshot */}
          <div className="bg-[#18191E] border border-white/10 rounded-sm p-4">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase text-[#8E929C] font-semibold mb-2 pb-1 border-b border-white/10">
              <span>Sentinel-2 / MODIS Observation</span>
              <button 
                onClick={() => onNavigateToTab('satellite')} 
                className="text-[#22C55E] hover:underline cursor-pointer"
              >
                NDVI &rarr;
              </button>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-[#8E929C]">Latest Composite Date:</span>
                <span className="text-white">{satCurrent?.latest_date || '2025-05-15'}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#8E929C]">Mean Field NDVI:</span>
                <span className="font-bold text-[#22C55E]">{satCurrent?.mean_field_ndvi || '0.81'}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#8E929C]">Condition Index (VCI):</span>
                <span className="text-white">{satCurrent?.vegetation_condition_index_pct || '92.0'}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E929C]">Canopy Status:</span>
                <span className="text-[#22C55E] font-semibold truncate max-w-[180px]">
                  {satCurrent?.vegetation_health_status || 'Vigorous Vegetative Canopy'}
                </span>
              </div>
            </div>
          </div>

          {/* Top Recommendation Summary Callout */}
          {topCrop && (
            <div className="bg-[#202229] border border-white/10 rounded-sm p-3.5">
              <div className="text-[10px] font-mono uppercase text-[#8E929C] font-semibold mb-1">
                Primary Agronomic Recommendation
              </div>
              <div className="flex items-baseline justify-between">
                <h4 className="font-serif font-bold text-sm text-white">
                  {topCrop.name}
                </h4>
                <span className="font-mono text-xs font-bold text-[#22C55E] bg-[#18191E] px-2 py-0.5 border border-white/10">
                  {topCrop.overall_score} / 100
                </span>
              </div>
              <p className="text-[11px] text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                {topCrop.reasons[0]}
              </p>
              <div className="mt-2 text-[10px] font-mono text-[#8E929C] flex justify-between border-t border-white/10 pt-1.5">
                <span>PLANTING: {topCrop.recommended_planting_period}</span>
                <button 
                  onClick={() => onNavigateToTab('crops')} 
                  className="text-[#22C55E] hover:underline font-semibold cursor-pointer"
                >
                  View 11 Crops &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function round(val: number, decimals: number = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}
