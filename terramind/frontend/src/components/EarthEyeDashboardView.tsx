import React, { useState } from 'react';
import { 
  Sun, 
  Droplets, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Search, 
  X, 
  Pin, 
  Layers, 
  Compass, 
  Eye, 
  Thermometer,
  CloudRain,
  Scissors,
  Shield,
  Waves,
  MapPin,
  ExternalLink,
  ArrowRight,
  Sparkles,
  FileText
} from 'lucide-react';
import { DemoField, FieldDigitalTwin } from '../types/terramind';
import { GlobalLeafletMap } from './GlobalLeafletMap';

interface EarthEyeDashboardViewProps {
  demoFields: DemoField[];
  selectedField: DemoField | null;
  onSelectField: (field: DemoField) => void;
  fieldDigitalTwin: FieldDigitalTwin | null;
  loading: boolean;
  onNavigateToTab: (tab: any) => void;
  onRunCustomAnalysis: (name: string, lat: number, lon: number, area: number, irrig: boolean) => void;
  onOpenDisclosures: () => void;
  onOpenDossier?: () => void;
}

export const EarthEyeDashboardView: React.FC<EarthEyeDashboardViewProps> = ({
  demoFields,
  selectedField,
  onSelectField,
  fieldDigitalTwin,
  loading,
  onNavigateToTab,
  onRunCustomAnalysis,
  onOpenDisclosures,
  onOpenDossier
}) => {
  const [activeLayer, setActiveLayer] = useState<string>('satellite');
  const [showRightPanel, setShowRightPanel] = useState<boolean>(true);
  const [searchLocationQuery, setSearchLocationQuery] = useState<string>('');
  const [searchingLocation, setSearchingLocation] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(14);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Custom coordinate modal state
  const [customName, setCustomName] = useState<string>('Surveyed Farm Parcel');
  const [customLat, setCustomLat] = useState<string>(selectedField?.latitude.toString() || '36.8025');
  const [customLon, setCustomLon] = useState<string>(selectedField?.longitude.toString() || '-119.8145');
  const [customArea, setCustomArea] = useState<string>('35.0');
  const [customIrrig, setCustomIrrig] = useState<boolean>(true);

  // Real extracted telemetry
  const climate = fieldDigitalTwin?.climate;
  const soil = fieldDigitalTwin?.soil;
  const satellite = fieldDigitalTwin?.satellite;
  const isArable = fieldDigitalTwin?.is_arable_land !== false;
  const marineBodyName = fieldDigitalTwin?.marine_water_body || 'Open Ocean / Sea Surface';
  const topCrop = isArable ? fieldDigitalTwin?.crop_recommendations?.[0] : undefined;

  const currentLat = selectedField?.latitude || 36.8025;
  const currentLon = selectedField?.longitude || -119.8145;
  const currentName = !isArable ? marineBodyName : (selectedField?.name || 'Selected Farm Parcel');

  // Minimal and intuitive layers list
  const layerGroups = [
    {
      group: 'Base Cartography',
      layers: [
        { id: 'satellite', name: 'High-Res Satellite (Esri)', desc: '0.5m True Color Aerial', badge: 'Satellite' },
        { id: 'osm', name: 'OpenStreetMap Vectors', desc: 'Cadastral Boundaries & Roads', badge: 'Vector' }
      ]
    },
    {
      group: 'Canopy & Vegetation',
      layers: [
        { id: 'ndvi', name: 'Sentinel-2 NDVI Canopy', desc: 'Photosynthetic Greenup & Chlorophyll', badge: 'Spectral' },
        { id: 'color_infrared', name: 'Color Infrared (NIR)', desc: 'Biomass Density & Moisture', badge: 'Spectral' },
        { id: 'thermal', name: 'Land Surface Temperature', desc: 'NASA MERRA-2 Thermal Skin Temp', badge: 'Thermal' }
      ]
    },
    {
      group: 'Soil & Climatology',
      layers: [
        { id: 'soil_ph', name: 'Soil Texture & pH Horizon', desc: 'ISRIC SoilGrids 250m Stratum', badge: 'Pedology' },
        { id: 'topo', name: 'Topographic Contours', desc: 'Slope & Drainage Watershed', badge: 'Elevation' }
      ]
    }
  ];

  // Handle map click
  const handleMapClick = (lat: number, lon: number) => {
    onRunCustomAnalysis(
      `Surveyed Parcel (${lat.toFixed(4)}°, ${lon.toFixed(4)}°)`,
      lat,
      lon,
      25.0,
      false
    );
  };

  // Handle global geocoding search
  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLocationQuery.trim()) return;

    // Check direct lat,lon
    const coordMatch = searchLocationQuery.match(/^([-+]?[0-9]*\.?[0-9]+)[,\s]+([-+]?[0-9]*\.?[0-9]+)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lon = parseFloat(coordMatch[2]);
      if (!isNaN(lat) && !isNaN(lon)) {
        onRunCustomAnalysis(`Parcel (${lat.toFixed(3)}°, ${lon.toFixed(3)}°)`, lat, lon, 30.0, false);
        setSearchLocationQuery('');
        return;
      }
    }

    setSearchingLocation(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchLocationQuery)}&limit=1`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const item = data[0];
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        onRunCustomAnalysis(item.display_name.split(',')[0], lat, lon, 40.0, false);
        setSearchLocationQuery('');
      } else {
        alert('Location not found. Please try entering a city, region, or latitude, longitude coordinates.');
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearchingLocation(false);
    }
  };

  const handleCustomFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    const area = parseFloat(customArea) || 25.0;
    if (isNaN(lat) || isNaN(lon)) return;
    onRunCustomAnalysis(customName, lat, lon, area, customIrrig);
    setShowAddModal(false);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0D0E12] select-none font-sans">
      {/* 1. REAL GLOBAL SATELLITE MAP */}
      <div className="absolute inset-0 z-0">
        <GlobalLeafletMap
          latitude={currentLat}
          longitude={currentLon}
          polygonCoordinates={selectedField?.polygon_coordinates}
          fieldName={`farmelster: ${selectedField?.name.split(' ')[0] || 'Active Farm'}`}
          activeLayer={activeLayer}
          onMapClick={handleMapClick}
          zoomLevel={zoomLevel}
        />
      </div>

      {/* 2. LEFT FLOATING TELEMETRY & PARCELS PANEL (MINIMALIST & UNDERSTANDABLE) */}
      <div className="absolute top-4 left-4 bottom-4 w-[350px] sm:w-[370px] z-20 flex flex-col pointer-events-none">
        <div className="dark-glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden pointer-events-auto shadow-2xl">
          {/* Active Parcel Header */}
          <div className="p-4 border-b border-white/5 space-y-2.5">
            {/* Top row: Status Tag & Field Switcher Dropdown */}
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[10px] uppercase tracking-wider font-semibold block ${isArable ? 'text-[#7C9A6B]' : 'text-white/40'}`}>
                {isArable ? 'Active Surveyed Parcel' : 'Marine Water Surface'}
              </span>

              {/* Region Switcher Select */}
              <div className="relative shrink-0">
                <select
                  value={selectedField?.id || ''}
                  onChange={(e) => {
                    const found = demoFields.find(f => f.id === e.target.value);
                    if (found) onSelectField(found);
                  }}
                  className="bg-white/[0.05] hover:bg-white/[0.1] text-[#A8C496] border border-[#7C9A6B]/30 hover:border-[#7C9A6B]/60 rounded-xl px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer transition-colors max-w-[170px]"
                  title="Switch agricultural field parcel"
                >
                  {selectedField && !demoFields.some(f => f.id === selectedField.id) && (
                    <option value={selectedField.id} className="bg-[#18191E] text-white">
                      Custom Location
                    </option>
                  )}
                  {demoFields.map((f) => (
                    <option key={f.id} value={f.id} className="bg-[#18191E] text-white">
                      {f.region.split(',')[0]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Farm Title & Region Subtitle (Full width with zero horizontal collision) */}
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
                {currentName}
              </h3>
              <p className="text-xs text-white/50 truncate mt-0.5">
                {isArable ? (selectedField?.region || 'Terrestrial Parcel') : 'Open Hydrosphere · Non-Arable'}
              </p>
            </div>

            {/* Coordinates */}
            <div className="flex items-center space-x-3 text-xs text-white/50 bg-black/30 px-3 py-1.5 rounded-xl border border-white/[0.05]">
              <span>Lat: <strong className="text-white font-medium">{currentLat.toFixed(4)}°</strong></span>
              <span>&bull;</span>
              <span>Lon: <strong className="text-white font-medium">{currentLon.toFixed(4)}°</strong></span>
              <span>&bull;</span>
              <span>{isArable ? `${selectedField?.area_hectares || 35} ha` : 'Open Water'}</span>
            </div>
          </div>

          {/* Core Telemetry Body (Understandable Cards) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {!isArable ? (
              /* Dedicated Marine Surface Diagnostic */
              <div className="space-y-3">
                <div className="bg-cyan-950/30 border border-cyan-500/20 rounded-xl p-3 space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold">
                    <Waves size={15} />
                    <span>Open Marine Water Body</span>
                  </div>
                  <p className="text-[11px] text-[#A0AEC0] leading-relaxed">
                    Selected coordinate is situated on an open marine water body ({marineBodyName}). Terrestrial soil pedology (ISRIC SoilGrids) and agricultural cultivars (FAO EcoCrop) apply solely to land parcels.
                  </p>
                  <div className="text-[10px] font-mono text-cyan-300/80 bg-black/40 px-2 py-1 rounded border border-cyan-500/10">
                    NASA POWER atmospheric reanalysis active: Oceanic air temp & maritime precipitation live.
                  </div>
                </div>

                {/* 4 Clean Marine Metric Cards */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#1C1E24] rounded-xl p-2.5 border border-white/5">
                    <div className="flex items-center space-x-1.5 text-[10px] font-medium text-white/40 uppercase tracking-wider">
                      <Thermometer size={12} className="text-amber-400" />
                      <span>Air Temp (NASA)</span>
                    </div>
                    <div className="text-xs font-semibold text-white mt-1">
                      {climate?.summary?.mean_annual_temp_c?.toFixed(1) || 18.2} °C
                    </div>
                    <div className="text-[10px] text-white/40 mt-0.5">
                      Maritime Atmosphere
                    </div>
                  </div>

                  <div className="bg-[#1C1E24] rounded-xl p-2.5 border border-white/5">
                    <div className="flex items-center space-x-1.5 text-[10px] font-medium text-white/40 uppercase tracking-wider">
                      <Waves size={12} className="text-cyan-400" />
                      <span>Precipitation</span>
                    </div>
                    <div className="text-xs font-semibold text-white mt-1">
                      {climate?.summary?.annual_precipitation_mm || 0} mm
                    </div>
                    <div className="text-[10px] text-white/40 mt-0.5 truncate">
                      Annual Marine Rainfall
                    </div>
                  </div>

                  <div className="bg-[#1C1E24] rounded-xl p-2.5 border border-white/5">
                    <div className="flex items-center space-x-1.5 text-[10px] font-medium text-white/40 uppercase tracking-wider">
                      <Activity size={12} className="text-cyan-400" />
                      <span>Water NDVI</span>
                    </div>
                    <div className="text-xs font-semibold text-cyan-400 mt-1">
                      -0.22
                    </div>
                    <div className="text-[10px] text-white/40 mt-0.5">
                      Strong NIR Absorption
                    </div>
                  </div>

                  <div className="bg-[#1C1E24] rounded-xl p-2.5 border border-white/5">
                    <div className="flex items-center space-x-1.5 text-[10px] font-medium text-white/40 uppercase tracking-wider">
                      <Droplets size={12} className="text-slate-400" />
                      <span>Arable Horizon</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-300 mt-1">
                      Submerged Bed
                    </div>
                    <div className="text-[10px] text-[#7C9A6B] mt-0.5 font-medium">
                      0 Crops Cultivable
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-[11px] text-[#8E929C]">
                  Click anywhere on continental land, islands, or coastlines to inspect agricultural soil and crop suitability.
                </div>
              </div>
            ) : (
              /* Terrestrial Agricultural Telemetry */
              <>
                {/* 4 Clean Primary Metric Cards */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Soil Card */}
                  <div className="bg-[#1C1E24] rounded-xl p-2.5 border border-white/5">
                    <div className="flex items-center space-x-1.5 text-[10px] font-medium text-white/40 uppercase tracking-wider">
                      <Scissors size={12} className="text-amber-400" />
                      <span>Soil Texture</span>
                    </div>
                    <div className="text-xs font-semibold text-white mt-1">
                      {soil?.properties?.usda_texture || 'Loam'}
                    </div>
                    <div className="text-[10px] text-white/40 mt-0.5">
                      pH {soil?.properties?.ph_h2o || 7.2} &bull; {soil?.properties?.clay_pct || 22}% Clay
                    </div>
                  </div>

                  {/* Water Card */}
                  <div className="bg-[#1C1E24] rounded-xl p-2.5 border border-white/5">
                    <div className="flex items-center space-x-1.5 text-[10px] font-medium text-white/40 uppercase tracking-wider">
                      <Waves size={12} className="text-cyan-400" />
                      <span>Precipitation</span>
                    </div>
                    <div className="text-xs font-semibold text-white mt-1">
                      {climate?.summary?.annual_precipitation_mm || 450} mm
                    </div>
                    <div className="text-[10px] text-white/40 mt-0.5 truncate">
                      {climate?.summary?.aridity_classification || 'Subhumid'} baseline
                    </div>
                  </div>

                  {/* Organic Carbon Card */}
                  <div className="bg-[#1C1E24] rounded-xl p-2.5 border border-white/5">
                    <div className="flex items-center space-x-1.5 text-[10px] font-medium text-white/40 uppercase tracking-wider">
                      <Droplets size={12} className="text-[#7C9A6B]" />
                      <span>Soil Carbon (SOC)</span>
                    </div>
                    <div className="text-xs font-semibold text-white mt-1">
                      {soil?.properties?.soc_g_kg || 18.5} g/kg
                    </div>
                    <div className="text-[10px] text-white/40 mt-0.5">
                      CEC: {soil?.properties?.cec_cmolc_kg || 24} cmol/kg
                    </div>
                  </div>

                  {/* Canopy Health Card */}
                  <div className="bg-[#1C1E24] rounded-xl p-2.5 border border-white/5">
                    <div className="flex items-center space-x-1.5 text-[10px] font-medium text-white/40 uppercase tracking-wider">
                      <Activity size={12} className="text-[#7C9A6B]" />
                      <span>Canopy Health</span>
                    </div>
                    <div className="text-xs font-semibold text-[#7C9A6B] mt-1">
                      NDVI {satellite?.current_observation?.mean_field_ndvi || 0.78}
                    </div>
                    <div className="text-[10px] text-white/40 mt-0.5">
                      Condition (VCI): {satellite?.current_observation?.vegetation_condition_index_pct || 92}%
                    </div>
                  </div>
                </div>

                {/* Top Recommended Crop Callout */}
                {topCrop && (
                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold uppercase text-[#7C9A6B] tracking-wider">
                        Primary Agronomic Match
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-[#7C9A6B]/15 text-[#A8C496] border border-[#7C9A6B]/25">
                        {topCrop.overall_score}/100
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-white">
                      {topCrop.name}
                    </div>
                    <p className="text-[11px] text-white/50 mt-1 line-clamp-2 leading-relaxed">
                      {topCrop.reasons[0]}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                      <span className="text-[10px] text-white/40">
                        Sowing: {topCrop.recommended_planting_period}
                      </span>
                      <button 
                        onClick={() => onNavigateToTab('crops')}
                        className="text-[#7C9A6B] hover:text-[#A8C496] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>All Crops</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Add Custom Parcel Action */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border border-white/10"
              >
                <Plus size={13} className="text-[#7C9A6B]" />
                <span>Analyze Custom Coordinates</span>
              </button>

              {onOpenDossier && (
                <button
                  onClick={onOpenDossier}
                  className="w-full py-2 bg-[#7C9A6B]/10 hover:bg-[#7C9A6B]/20 text-[#A8C496] rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border border-[#7C9A6B]/25 shadow-sm"
                >
                  <FileText size={13} className="text-[#7C9A6B]" />
                  <span>Download Scientific Dossier (PDF)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM NASA DATA SOURCE BADGE (Clean, Minimal, No Neon) */}
      <div className="absolute bottom-4 left-[370px] sm:left-[390px] z-20 pointer-events-none">
        <div className="dark-glass-panel rounded-xl px-3.5 py-1.5 flex items-center space-x-3 pointer-events-auto border border-white/10 shadow-xl">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A6B58A]" />
            <span className="text-xs font-medium text-white">
              NASA POWER Agroclimatology &bull; ISRIC SoilGrids 250m
            </span>
          </div>
          <span className="text-white/20">|</span>
          <button 
            onClick={onOpenDisclosures}
            className="text-[11px] text-[#A6B58A] hover:text-white font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Methodology</span>
            <ExternalLink size={11} />
          </button>
        </div>
      </div>

      {/* 4. MAP ZOOM CONTROLS */}
      <div className="absolute top-1/2 -translate-y-1/2 right-[315px] z-20 flex flex-col gap-1 dark-glass-panel p-1 rounded-lg border border-white/10 shadow-lg">
        <button 
          onClick={() => setZoomLevel(prev => Math.min(prev + 1, 18))}
          className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/10 rounded font-bold text-sm cursor-pointer transition-colors"
          title="Zoom in"
        >
          +
        </button>
        <div className="w-full h-px bg-white/10" />
        <button 
          onClick={() => setZoomLevel(prev => Math.max(prev - 1, 3))}
          className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/10 rounded font-bold text-sm cursor-pointer transition-colors"
          title="Zoom out"
        >
          &minus;
        </button>
      </div>

      {/* 5. RIGHT FLOATING PANEL: "MAP LAYERS & SPATIAL DATA" */}
      {showRightPanel ? (
        <div className="absolute top-4 right-4 bottom-4 w-[290px] z-20 flex flex-col pointer-events-none">
          <div className="dark-glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden pointer-events-auto shadow-2xl">
            {/* Header */}
            <div className="p-3.5 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-white">
                  Map Layers & Earth Data
                </h3>
                <p className="text-[10px] text-[#8E929C]">
                  Click anywhere on map to inspect
                </p>
              </div>
              <button 
                onClick={() => setShowRightPanel(false)}
                className="text-[#8E929C] hover:text-white transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Global Search Bar */}
            <div className="p-3 border-b border-white/5">
              <form onSubmit={handleLocationSearch} className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8E929C]" />
                <input 
                  type="text" 
                  value={searchLocationQuery}
                  onChange={(e) => setSearchLocationQuery(e.target.value)}
                  placeholder="Search city, region, or lat,lon..." 
                  disabled={searchingLocation}
                  className="w-full bg-[#1C1E24] border border-white/10 rounded-lg pl-7 pr-7 py-1.5 text-[11px] text-white placeholder-[#8E929C] focus:outline-none focus:border-emerald-500"
                />
                {searchingLocation && (
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-emerald-400 animate-pulse">
                    ...
                  </span>
                )}
              </form>
            </div>

            {/* Grouped Minimal Layers List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {layerGroups.map((grp, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <div className="text-xs font-medium text-white/40 px-1">
                    {grp.group}
                  </div>
                  {grp.layers.map((layer) => {
                    const isSelected = activeLayer === layer.id;
                    return (
                      <div
                        key={layer.id}
                        onClick={() => setActiveLayer(layer.id)}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-[#7C9A6B]/15 border border-[#7C9A6B]/30 text-white' 
                            : 'hover:bg-white/5 border border-transparent text-white/80'
                        }`}
                      >
                        <div className="min-w-0 pr-1">
                          <div className="text-xs font-semibold text-white truncate">
                            {layer.name}
                          </div>
                          <div className="text-[10px] text-white/40 truncate">
                            {layer.desc}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 shrink-0">
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7C9A6B]" />
                          )}
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-white/50">
                            {layer.badge}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowRightPanel(true)}
          className="absolute top-4 right-4 z-20 dark-glass-panel text-white p-2.5 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer shadow-lg hover:bg-white/10 transition-colors"
        >
          <Layers size={14} className="text-emerald-400" />
          <span>Map Layers</span>
        </button>
      )}

      {/* 6. CUSTOM FIELD COORDINATES MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="dark-glass-panel rounded-2xl max-w-md w-full p-5 border border-white/10 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-[#8E929C] hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <h3 className="text-sm font-bold text-white mb-1">
              Analyze Any Global Farm Coordinates
            </h3>
            <p className="text-xs text-[#8E929C] mb-4">
              Enter any coordinate worldwide. Farmelster will retrieve live NASA POWER agroclimatology and ISRIC SoilGrids pedology.
            </p>

            <form onSubmit={handleCustomFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-[#8E929C] block mb-1">Farm / Parcel Identifier</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-[#1C1E24] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-white/50 block mb-1">Latitude (-90 to 90)</label>
                  <input
                    type="number"
                    step="any"
                    value={customLat}
                    onChange={(e) => setCustomLat(e.target.value)}
                    className="w-full bg-[#1C1E24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#7C9A6B]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-white/50 block mb-1">Longitude (-180 to 180)</label>
                  <input
                    type="number"
                    step="any"
                    value={customLon}
                    onChange={(e) => setCustomLon(e.target.value)}
                    className="w-full bg-[#1C1E24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#7C9A6B]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-white/50 block mb-1">Area (Hectares)</label>
                  <input
                    type="number"
                    step="any"
                    value={customArea}
                    onChange={(e) => setCustomArea(e.target.value)}
                    className="w-full bg-[#1C1E24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#7C9A6B]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-white/50 block mb-1">Irrigation System</label>
                  <select
                    value={customIrrig ? 'yes' : 'no'}
                    onChange={(e) => setCustomIrrig(e.target.value === 'yes')}
                    className="w-full bg-[#1C1E24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#7C9A6B] cursor-pointer"
                  >
                    <option value="yes">Irrigated</option>
                    <option value="no">Rainfed (Dryland)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-colors cursor-pointer shadow-lg"
                >
                  Analyze Parcel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
