import React, { useState } from 'react';
import { 
  Bell, 
  ChevronDown, 
  MapPin,
  Layers,
  Sprout,
  BarChart3,
  Sun,
  Terminal,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sliders,
  Calendar
} from 'lucide-react';
import { DemoField, FieldDigitalTwin } from '../types/terramind';

export type FarmelsterTab = 
  | 'dashboard'
  | 'crops'
  | 'soil'
  | 'calendar'
  | 'satellite'
  | 'scenario'
  | 'climate'
  | 'rotation'
  | 'advisor';

interface FarmelsterHeaderProps {
  activeTab: FarmelsterTab;
  setActiveTab: (tab: FarmelsterTab) => void;
  selectedField: DemoField | null;
  demoFields: DemoField[];
  onSelectField: (f: DemoField) => void;
  onOpenDisclosures: () => void;
  fieldDigitalTwin: FieldDigitalTwin | null;
}

export const FarmelsterHeader: React.FC<FarmelsterHeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedField,
  demoFields,
  onSelectField,
  onOpenDisclosures,
  fieldDigitalTwin
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);

  // Generate real agronomic diagnostic alerts
  const realAlerts: Array<{ type: 'warning' | 'info' | 'success'; title: string; desc: string }> = [];

  const climate = fieldDigitalTwin?.climate;
  const soil = fieldDigitalTwin?.soil;
  const satellite = fieldDigitalTwin?.satellite;
  const topCrop = fieldDigitalTwin?.crop_recommendations?.[0];

  if (soil?.properties) {
    if (soil.properties.ph_h2o > 7.6) {
      realAlerts.push({
        type: 'warning',
        title: `Alkaline Soil (pH ${soil.properties.ph_h2o})`,
        desc: 'Calcareous conditions restrict phosphorus and micronutrient uptake. Acidifying starter fertilizers recommended.'
      });
    } else if (soil.properties.ph_h2o < 6.0) {
      realAlerts.push({
        type: 'warning',
        title: `Acidic Soil (pH ${soil.properties.ph_h2o})`,
        desc: 'Aluminum saturation risk. Liming recommended to optimize base saturation above 70%.'
      });
    }

    if (soil.properties.soc_g_kg < 12.0) {
      realAlerts.push({
        type: 'info',
        title: `Low Organic Carbon (${soil.properties.soc_g_kg} g/kg)`,
        desc: 'Structural degradation risk. Implement minimum tillage, cover cropping, or manure application.'
      });
    }
  }

  if (climate?.summary) {
    if (climate.summary.annual_precipitation_mm < 450) {
      realAlerts.push({
        type: 'warning',
        title: `Dryland Water Deficit (${climate.summary.annual_precipitation_mm}mm)`,
        desc: 'Rainfed yields constrained for heavy feeders. Drip irrigation or drought-tolerant pulses recommended.'
      });
    }

    if (climate.summary.frost_months_count > 0) {
      realAlerts.push({
        type: 'info',
        title: `Frost Risk Envelope (${climate.summary.frost_months_count} months)`,
        desc: 'Base temperature thresholds require late autumn sowing to prevent vegetative frost damage.'
      });
    }
  }

  if (satellite?.current_observation) {
    realAlerts.push({
      type: 'success',
      title: `Active Satellite Observation (${satellite.current_observation.vegetation_health_status})`,
      desc: `MODIS / Sentinel-2 composite recorded mean field NDVI of ${satellite.current_observation.mean_field_ndvi}.`
    });
  }

  if (topCrop) {
    realAlerts.push({
      type: 'success',
      title: `Primary Suited Crop: ${topCrop.name}`,
      desc: `Multi-attribute score ${topCrop.overall_score}/100. Sowing window: ${topCrop.recommended_planting_period}.`
    });
  }

  const primaryTabs: Array<{ id: FarmelsterTab; label: string }> = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'crops', label: 'Crop Planning' },
    { id: 'soil', label: 'Soil Analysis' },
    { id: 'calendar', label: 'Planting Calendar' },
    { id: 'satellite', label: 'Satellite NDVI' },
    { id: 'scenario', label: 'Scenario Lab' }
  ];

  const secondaryTabs: Array<{ id: FarmelsterTab; label: string; icon: React.ReactNode }> = [
    { id: 'climate', label: 'NASA POWER Climate', icon: <Sun size={13} /> },
    { id: 'rotation', label: 'Crop Succession', icon: <Sprout size={13} /> },
    { id: 'advisor', label: 'Agronomic Advisor', icon: <Terminal size={13} /> }
  ];

  return (
    <header className="h-16 bg-[#121316] border-b border-white/[0.06] px-5 flex items-center justify-between select-none shrink-0 z-30 font-sans">
      {/* 1. BRAND: farmelster Typography (Clean, Minimal, No Neon / No Green Logo) */}
      <div className="flex items-center space-x-3">
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <div>
            <div className="flex items-center space-x-2 leading-none">
              <span className="font-semibold text-base text-white tracking-tight font-sans">
                farmelster
              </span>
              <span className="text-[9px] font-mono font-medium uppercase px-1.5 py-0.5 rounded bg-white/[0.06] text-[#A0A29C] border border-white/10">
                NASA Earth Data
              </span>
            </div>
            <span className="text-[10px] text-[#8E929C] font-mono leading-none block mt-1">
              Agricultural Intelligence Platform
            </span>
          </div>
        </div>
      </div>

      {/* 2. MINIMALIST CENTER PILL NAVIGATION */}
      <nav className="flex items-center space-x-1 bg-[#18191E] border border-white/[0.08] p-1 rounded-full">
        {primaryTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                isActive 
                  ? 'bg-[#24262E] text-white border border-white/10 shadow-xs' 
                  : 'text-[#8E929C] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}

        {/* More Scientific Modules */}
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="px-2.5 py-1.5 rounded-full text-xs font-medium text-[#8E929C] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>More</span>
            <ChevronDown size={12} className={showMoreMenu ? 'rotate-180 transition-transform' : 'transition-transform'} />
          </button>

          {showMoreMenu && (
            <div className="absolute top-full mt-2 right-0 w-56 dark-glass-panel rounded-xl p-1.5 shadow-2xl z-50 border border-white/10 text-xs">
              <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-[#8E929C]">
                Additional Modules
              </div>
              {secondaryTabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id);
                    setShowMoreMenu(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                    activeTab === t.id ? 'bg-white/10 text-white font-semibold' : 'text-[#8E929C] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-white/80">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}

              <div className="h-px bg-white/10 my-1" />
              <button
                onClick={() => {
                  onOpenDisclosures();
                  setShowMoreMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-left text-emerald-400 hover:bg-white/5 cursor-pointer font-medium"
              >
                <ShieldCheck size={13} />
                <span>Data Disclosures & Sources</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* 3. RIGHT CONTROLS: Field Selector, Real Alerts & User Avatar */}
      <div className="flex items-center space-x-3">
        {/* Real Global Demo Field Selector */}
        <div className="hidden xl:flex items-center space-x-2 bg-[#18191E] border border-white/[0.08] px-2.5 py-1 rounded-full text-xs">
          <MapPin size={12} className="text-[#A6B58A]" />
          <select
            value={selectedField?.id || ''}
            onChange={(e) => {
              const found = demoFields.find(f => f.id === e.target.value);
              if (found) onSelectField(found);
            }}
            className="bg-transparent text-white border-none text-xs focus:outline-none cursor-pointer pr-1"
          >
            {demoFields.map((f) => (
              <option key={f.id} value={f.id} className="bg-[#18191E] text-white">
                {f.name.split(' ')[0]} ({f.region.split(',')[0]})
              </option>
            ))}
          </select>
        </div>

        {/* Real Agronomic Alerts Badge Button */}
        <button 
          onClick={() => setShowAlertsModal(!showAlertsModal)}
          className="flex items-center space-x-1.5 bg-[#18191E] hover:bg-[#202229] border border-white/[0.08] px-3 py-1.5 rounded-full text-xs text-white font-medium transition-colors cursor-pointer"
        >
          <Bell size={13} className={realAlerts.length > 0 ? "text-amber-400" : "text-[#8E929C]"} />
          <span className="font-mono text-[11px]">{realAlerts.length} alerts</span>
        </button>

        {/* User Profile Avatar with active status */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-gradient-to-tr from-emerald-950 to-slate-900 flex items-center justify-center cursor-pointer shadow-md">
            <span className="text-xs font-bold text-white tracking-wider font-mono">GM</span>
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#22C55E] border-2 border-[#121316]" />
        </div>
      </div>

      {/* Real Agronomic Alerts Drawer */}
      {showAlertsModal && (
        <div className="absolute top-16 right-5 w-84 dark-glass-panel rounded-2xl p-4 shadow-2xl z-50 border border-white/10 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Bell size={13} className="text-amber-400" />
              <span>Real-Time Agronomic Diagnostics ({realAlerts.length})</span>
            </h4>
            <button 
              onClick={() => setShowAlertsModal(false)}
              className="text-[#8E929C] hover:text-white text-xs cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="space-y-2 text-xs max-h-72 overflow-y-auto">
            {realAlerts.map((alert, idx) => {
              const borderCol = alert.type === 'warning' ? 'border-amber-500/20 bg-amber-500/10 text-amber-200' :
                                alert.type === 'info' ? 'border-blue-500/20 bg-blue-500/10 text-blue-200' :
                                'border-emerald-500/20 bg-emerald-500/10 text-emerald-200';

              return (
                <div key={idx} className={`p-2.5 border rounded-lg ${borderCol}`}>
                  <div className="font-semibold text-[11px] flex items-center gap-1.5">
                    {alert.type === 'warning' ? <AlertTriangle size={12} className="shrink-0 text-amber-400" /> :
                     alert.type === 'info' ? <Info size={12} className="shrink-0 text-blue-400" /> :
                     <CheckCircle2 size={12} className="shrink-0 text-emerald-400" />}
                    <span>{alert.title}</span>
                  </div>
                  <div className="text-[10px] opacity-85 mt-1 leading-relaxed">{alert.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
