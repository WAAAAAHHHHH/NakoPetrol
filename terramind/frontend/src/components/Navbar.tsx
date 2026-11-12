import React from 'react';
import { 
  Sprout, 
  Satellite, 
  Compass, 
  Database, 
  Droplets, 
  Sun, 
  Layers, 
  Calendar, 
  Sliders, 
  RefreshCw, 
  Bot,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { DemoField } from '../types/terramind';

export type TabKey = 
  | 'explorer' 
  | 'recommendations' 
  | 'soil' 
  | 'calendar' 
  | 'satellite' 
  | 'climate' 
  | 'what_if' 
  | 'rotation' 
  | 'advisor';

interface NavbarProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  demoFields: DemoField[];
  selectedFieldId: string;
  onSelectField: (field: DemoField) => void;
  irrigationAvailable: boolean;
  onToggleIrrigation: (val: boolean) => void;
  onOpenTransparency: () => void;
  loading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  demoFields,
  selectedFieldId,
  onSelectField,
  irrigationAvailable,
  onToggleIrrigation,
  onOpenTransparency,
  loading
}) => {
  const tabs: Array<{ key: TabKey; label: string; icon: React.ReactNode }> = [
    { key: 'explorer', label: 'Field Explorer', icon: <Compass size={15} /> },
    { key: 'recommendations', label: 'Crop Scoring', icon: <Sprout size={15} /> },
    { key: 'soil', label: 'Soil Intelligence', icon: <Layers size={15} /> },
    { key: 'calendar', label: 'Planting Calendar', icon: <Calendar size={15} /> },
    { key: 'satellite', label: 'Satellite NDVI', icon: <Satellite size={15} /> },
    { key: 'climate', label: 'Climate Risk', icon: <Sun size={15} /> },
    { key: 'what_if', label: 'What-If Simulator', icon: <Sliders size={15} /> },
    { key: 'rotation', label: 'Crop Rotation', icon: <RefreshCw size={15} /> },
    { key: 'advisor', label: 'AI Advisor', icon: <Bot size={15} /> },
  ];

  return (
    <header className="bg-stone-950/95 border-b border-stone-800/80 sticky top-0 z-50 backdrop-blur-md select-none">
      {/* Top Banner: Brand, NASA Space Apps, Quick Field Switcher, Irrigation Lever */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center shadow-lg shadow-emerald-950/60 border border-emerald-500/40">
            <Sprout size={20} className="text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-tight text-lg text-white">TerraMind</span>
              <span className="text-[10px] tracking-wider text-emerald-300 font-mono font-semibold px-2 py-0.5 bg-emerald-950/80 rounded border border-emerald-700/60">
                NASA SPACE APPS 2026
              </span>
            </div>
            <div className="text-[11px] text-stone-400 tracking-tight flex items-center gap-1.5">
              <span>Field Shift: Adapting Farms with NASA Data</span>
              <span className="text-stone-600">&bull;</span>
              <span className="text-emerald-400 font-medium">Turkey Demonstration</span>
            </div>
          </div>
        </div>

        {/* Demo Field Selector & Irrigation Switch */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-stone-900 border border-stone-800 rounded-lg p-1.5 text-xs">
            <span className="text-stone-400 font-medium pl-1 flex items-center gap-1">
              <Compass size={13} className="text-emerald-400" /> Field:
            </span>
            <select
              value={selectedFieldId}
              onChange={(e) => {
                const found = demoFields.find(f => f.id === e.target.value);
                if (found) onSelectField(found);
              }}
              className="bg-stone-800 text-stone-200 border-none rounded px-2 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {demoFields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name}
                </option>
              ))}
            </select>
          </div>

          {/* Irrigation Toggle */}
          <button
            onClick={() => onToggleIrrigation(!irrigationAvailable)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              irrigationAvailable
                ? 'bg-cyan-950/80 border-cyan-500/70 text-cyan-300 shadow-sm shadow-cyan-950'
                : 'bg-stone-900/90 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
            title="Toggle Supplemental Irrigation"
          >
            <Droplets size={13} className={irrigationAvailable ? 'text-cyan-400' : 'text-stone-500'} />
            <span>{irrigationAvailable ? 'Irrigated Field' : 'Rainfed Dryland'}</span>
          </button>

          {/* Data Transparency Link */}
          <button
            onClick={onOpenTransparency}
            className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-lg text-xs text-stone-300 hover:text-white transition-all cursor-pointer"
            title="View NASA Data Sources and Scientific Methodology"
          >
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>Data Transparency</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-bar: Main Tabs */}
      <div className="bg-stone-900/70 border-t border-stone-800/60 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-1 py-1.5 text-xs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-md font-medium flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/80'
                    : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-stone-400'}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}

          {loading && (
            <div className="ml-auto flex items-center space-x-2 text-[11px] text-emerald-400 mono-telemetry animate-pulse px-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>Fetching NASA POWER...</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

