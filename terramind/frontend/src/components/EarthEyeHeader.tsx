import React, { useState } from 'react';
import {
  ChevronDown,
  Layers,
  Sprout,
  BarChart3,
  Sun,
  Terminal,
  ShieldCheck,
  Sliders,
  Calendar
} from 'lucide-react';
import { DemoField } from '../types/terramind';

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
}

export const FarmelsterHeader: React.FC<FarmelsterHeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenDisclosures,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

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
      {/* BRAND */}
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

      {/* CENTER PILL NAVIGATION */}
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

        {/* More dropdown */}
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

      {/* RIGHT — intentionally empty, no avatar, no alerts, no fake chrome */}
      <div />
    </header>
  );
};
