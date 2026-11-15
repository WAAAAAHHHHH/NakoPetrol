import React, { useState } from 'react';
import { ChevronDown, Sprout, Sun, Terminal, ShieldCheck, FileText, Users } from 'lucide-react';
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
  onOpenDossier: () => void;
  onOpenCredits: () => void;
}

export const FarmelsterHeader: React.FC<FarmelsterHeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenDisclosures,
  onOpenDossier,
  onOpenCredits,
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
    <header className="h-16 bg-[#0E0F12] border-b border-white/[0.07] px-5 sm:px-6 flex items-center justify-between shrink-0 z-30">

      {/* BRAND / TITLE */}
      <button
        onClick={() => setActiveTab('dashboard')}
        className="btn flex items-center gap-3 rounded-xl px-2 py-1 hover:bg-white/[0.03] transition-all cursor-pointer"
        aria-label="Go to dashboard"
      >
        <div className="w-9 h-9 rounded-xl bg-[#141C14] border border-[#7C9A6B]/30 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(124,154,107,0.18)]">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M4 16C4 16 6 8 14 5C14 5 14 13 6 15L4 16Z" fill="#7C9A6B" opacity="0.95"/>
            <path d="M4 16L9 11" stroke="#A8C496" strokeWidth="1.4" strokeLinecap="round" opacity="0.85"/>
          </svg>
        </div>
        <div className="flex flex-col text-left">
          <div className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none flex items-center gap-1.5">
            <span>farmelster</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C9A6B]" />
          </div>
          <div className="text-[10px] uppercase font-semibold tracking-widest text-[#7C9A6B] leading-none mt-1">
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
                <button
                  onClick={() => { onOpenCredits(); setShowMoreMenu(false); }}
                  className="btn w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm text-white/80 hover:text-white hover:bg-white/[0.04]"
                >
                  <Users size={12} className="text-[#7C9A6B]" />
                  Team Credits
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* RIGHT: Credits & Export Dossier (PDF) Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenCredits}
          className="btn px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/90 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:border-[#7C9A6B]/40"
          title="View project creators and engineering team (Zeynep, Anka, Mert, Aras)"
        >
          <Users size={14} className="text-[#7C9A6B]" />
          <span>Credits</span>
        </button>

        <button
          onClick={onOpenDossier}
          className="btn px-3.5 py-2 bg-[#7C9A6B]/15 hover:bg-[#7C9A6B]/25 border border-[#7C9A6B]/30 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:border-[#7C9A6B]/50"
          title="Open printable scientific field dossier (PDF)"
        >
          <FileText size={14} className="text-[#A8C496]" />
          <span>Export Dossier (PDF)</span>
        </button>
      </div>
    </header>
  );
};
