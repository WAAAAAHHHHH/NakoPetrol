import React, { useState } from 'react';
import { ChevronDown, Sprout, Sun, Terminal, ShieldCheck } from 'lucide-react';
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
    { id: 'climate',  label: 'Climate Data',     icon: <Sun size={12} /> },
    { id: 'rotation', label: 'Crop Succession',  icon: <Sprout size={12} /> },
    { id: 'advisor',  label: 'Agronomic Advisor',icon: <Terminal size={12} /> },
  ];

  const isSecondaryActive = secondaryTabs.some(t => t.id === activeTab);

  return (
    <header className="h-14 bg-[#0E0F12] border-b border-white/[0.06] px-5 flex items-center justify-between shrink-0 z-30">

      {/* BRAND */}
      <button
        onClick={() => setActiveTab('dashboard')}
        className="btn flex items-center gap-2.5 rounded-lg px-1"
        aria-label="Go to dashboard"
      >
        <div className="w-7 h-7 rounded-lg bg-[#121A12] border border-white/[0.07] flex items-center justify-center shrink-0">
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
            <path d="M4 16C4 16 6 8 14 5C14 5 14 13 6 15L4 16Z" fill="#7C9A6B" opacity="0.9"/>
            <path d="M4 16L9 11" stroke="#A8C496" strokeWidth="1.3" strokeLinecap="round" opacity="0.65"/>
          </svg>
        </div>
        <div>
          <div className="text-[13.5px] font-semibold text-white tracking-tight leading-none">
            farmelster
          </div>
          <div className="text-[11px] text-white/25 leading-none mt-0.5">
            Agricultural Intelligence
          </div>
        </div>
      </button>

      {/* CENTER NAV */}
      <nav className="flex items-center gap-0.5 bg-white/[0.03] border border-white/[0.07] p-1 rounded-full">
        {primaryTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-tab ${activeTab === tab.id ? 'nav-tab-active' : 'nav-tab-inactive'}`}
          >
            {tab.label}
          </button>
        ))}

        {/* More dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(v => !v)}
            className={`nav-tab flex items-center gap-1 ${
              isSecondaryActive ? 'nav-tab-active' : 'nav-tab-inactive'
            }`}
          >
            More
            <ChevronDown
              size={11}
              className={`transition-transform duration-200 ${showMoreMenu ? 'rotate-180' : ''}`}
            />
          </button>

          {showMoreMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
              <div className="absolute top-full mt-2 right-0 w-52 dark-glass-panel rounded-xl p-1.5 shadow-2xl z-50 anim-slide-down">
                <p className="px-3 py-1.5 text-[11px] text-white/25 font-medium">
                  More modules
                </p>
                {secondaryTabs.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => { setActiveTab(t.id); setShowMoreMenu(false); }}
                    style={{ animationDelay: `${i * 35}ms` }}
                    className={`btn w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm anim-fade-up ${
                      activeTab === t.id
                        ? 'bg-white/[0.07] text-white font-medium'
                        : 'text-white/50 hover:text-white/90 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="opacity-50">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
                <div className="h-px bg-white/[0.06] my-1.5 mx-2.5" />
                <button
                  onClick={() => { onOpenDisclosures(); setShowMoreMenu(false); }}
                  className="btn w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm text-[#7C9A6B] hover:bg-white/[0.04]"
                >
                  <ShieldCheck size={12} className="opacity-70" />
                  Data Disclosures
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* RIGHT spacer — keeps brand centred */}
      <div style={{ width: 140 }} />
    </header>
  );
};
