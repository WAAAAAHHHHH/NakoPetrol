import React, { useState } from 'react';
import {
  ChevronDown,
  Sprout,
  Sun,
  Terminal,
  ShieldCheck,
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
    { id: 'crops',     label: 'Crop Planning' },
    { id: 'soil',      label: 'Soil Analysis' },
    { id: 'calendar',  label: 'Planting Calendar' },
    { id: 'satellite', label: 'Satellite NDVI' },
    { id: 'scenario',  label: 'Scenario Lab' },
  ];

  const secondaryTabs: Array<{ id: FarmelsterTab; label: string; icon: React.ReactNode }> = [
    { id: 'climate',  label: 'NASA POWER Climate', icon: <Sun size={12} /> },
    { id: 'rotation', label: 'Crop Succession',    icon: <Sprout size={12} /> },
    { id: 'advisor',  label: 'Agronomic Advisor',  icon: <Terminal size={12} /> },
  ];

  const isSecondaryActive = secondaryTabs.some(t => t.id === activeTab);

  return (
    <header className="h-14 bg-[#0E0F12] border-b border-white/[0.06] px-5 flex items-center justify-between shrink-0 z-30 font-sans">

      {/* BRAND */}
      <button
        onClick={() => setActiveTab('dashboard')}
        className="btn flex items-center gap-2.5 rounded-lg px-1"
        aria-label="Go to dashboard"
      >
        <div className="w-6 h-6 rounded-md bg-[#121A12] border border-[#2E4A2E]/60 flex items-center justify-center shrink-0">
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
            <path d="M4 16C4 16 6 8 14 5C14 5 14 13 6 15L4 16Z" fill="#7C9A6B" opacity="0.9"/>
            <path d="M4 16L9 11" stroke="#A8C496" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
          </svg>
        </div>
        <div className="leading-none">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[13px] text-white tracking-tight">farmelster</span>
            <span className="text-[8px] font-mono font-medium uppercase px-1.5 py-0.5 rounded bg-white/[0.04] text-[#525660] border border-white/[0.07]">
              NASA
            </span>
          </div>
          <span className="text-[9px] text-[#3A3D45] font-mono block mt-0.5 leading-none">
            Agricultural Intelligence
          </span>
        </div>
      </button>

      {/* CENTER NAV */}
      <nav className="flex items-center gap-0.5 bg-[#13141A] border border-white/[0.07] p-1 rounded-full">
        {primaryTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab ${isActive ? 'nav-tab-active' : 'nav-tab-inactive'}`}
            >
              {tab.label}
            </button>
          );
        })}

        {/* More dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`nav-tab flex items-center gap-1 ${
              isSecondaryActive ? 'nav-tab-active' : 'nav-tab-inactive'
            }`}
            aria-expanded={showMoreMenu}
          >
            <span>More</span>
            <ChevronDown
              size={11}
              className={`transition-transform duration-200 ${showMoreMenu ? 'rotate-180' : ''}`}
            />
          </button>

          {showMoreMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
              <div className="absolute top-full mt-2 right-0 w-56 dark-glass-panel rounded-xl p-1.5 shadow-2xl z-50 text-xs anim-slide-down">
                <div className="px-2.5 py-1.5 text-[9px] font-mono uppercase tracking-widest text-[#3A3D45]">
                  Additional Modules
                </div>
                {secondaryTabs.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => { setActiveTab(t.id); setShowMoreMenu(false); }}
                    style={{ animationDelay: `${i * 40}ms` }}
                    className={`btn w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left anim-fade-up ${
                      activeTab === t.id
                        ? 'bg-white/[0.07] text-white font-medium'
                        : 'text-[#8E929C] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="text-white/50">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
                <div className="h-px bg-white/[0.06] my-1.5 mx-2" />
                <button
                  onClick={() => { onOpenDisclosures(); setShowMoreMenu(false); }}
                  className="btn w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-[#7C9A6B] hover:bg-white/[0.04] font-medium"
                >
                  <ShieldCheck size={12} />
                  <span>Data Disclosures & Sources</span>
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* RIGHT — empty intentionally */}
      <div className="w-[120px]" />
    </header>
  );
};
