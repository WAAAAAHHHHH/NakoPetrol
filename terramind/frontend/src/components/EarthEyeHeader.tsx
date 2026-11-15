import React, { useState } from 'react';
import { 
  ChevronDown, 
  Sprout, 
  Sun, 
  Terminal, 
  ShieldCheck, 
  FileText, 
  Users, 
  Compass,
  Menu,
  X,
  Map,
  Layers,
  Calendar,
  Satellite,
  Sliders,
  Sparkles
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
  onOpenDossier: () => void;
  onOpenCredits: () => void;
  onOpenTutorial?: () => void;
}

export const FarmelsterHeader: React.FC<FarmelsterHeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenDisclosures,
  onOpenDossier,
  onOpenCredits,
  onOpenTutorial,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const primaryTabs: Array<{ id: FarmelsterTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Dashboard',         icon: <Map size={14} /> },
    { id: 'crops',     label: 'Crop Planning',     icon: <Sprout size={14} /> },
    { id: 'soil',      label: 'Soil Analysis',      icon: <Layers size={14} /> },
    { id: 'calendar',  label: 'Planting Calendar', icon: <Calendar size={14} /> },
    { id: 'satellite', label: 'Satellite NDVI',    icon: <Satellite size={14} /> },
    { id: 'scenario',  label: 'Scenario Lab',      icon: <Sliders size={14} /> },
  ];

  const secondaryTabs: Array<{ id: FarmelsterTab; label: string; icon: React.ReactNode }> = [
    { id: 'climate',  label: 'Climate Data',     icon: <Sun size={14} /> },
    { id: 'rotation', label: 'Crop Succession',  icon: <Sprout size={14} /> },
    { id: 'advisor',  label: 'Agronomic Advisor',icon: <Terminal size={14} /> },
  ];

  const allTabs = [...primaryTabs, ...secondaryTabs];
  const isSecondaryActive = secondaryTabs.some(t => t.id === activeTab);

  return (
    <>
      <header className="h-16 bg-[#0E0F12] border-b border-white/[0.07] px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">

        {/* BRAND / TITLE */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="btn flex items-center gap-2.5 sm:gap-3 rounded-xl px-1.5 sm:px-2 py-1 hover:bg-white/[0.03] transition-all cursor-pointer"
          aria-label="Go to dashboard"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#141C14] border border-[#7C9A6B]/30 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(124,154,107,0.18)]">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M4 16C4 16 6 8 14 5C14 5 14 13 6 15L4 16Z" fill="#7C9A6B" opacity="0.95"/>
              <path d="M4 16L9 11" stroke="#A8C496" strokeWidth="1.4" strokeLinecap="round" opacity="0.85"/>
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <div className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-none flex items-center gap-1.5">
              <span>farmelster</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C9A6B]" />
            </div>
            <div className="text-[9px] sm:text-[10px] uppercase font-semibold tracking-widest text-[#7C9A6B] leading-none mt-1">
              Agricultural Intelligence
            </div>
          </div>
        </button>

        {/* DESKTOP CENTER NAV (Hidden on tablet/mobile screens) */}
        <nav className="hidden lg:flex items-center gap-0.5 bg-white/[0.03] border border-white/[0.07] p-1 rounded-full">
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
                    onClick={() => { onOpenTutorial?.(); setShowMoreMenu(false); }}
                    className="btn w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm text-[#7C9A6B] hover:bg-white/[0.04]"
                  >
                    <Compass size={12} className="opacity-80 text-[#7C9A6B]" />
                    Interactive Tour
                  </button>
                  <button
                    onClick={() => { onOpenDisclosures(); setShowMoreMenu(false); }}
                    className="btn w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm text-white/80 hover:text-white hover:bg-white/[0.04]"
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

        {/* DESKTOP RIGHT ACTIONS (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onOpenTutorial}
            className="btn px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/90 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:border-[#7C9A6B]/40"
            title="Start interactive platform tour"
          >
            <Compass size={14} className="text-[#7C9A6B]" />
            <span>Tour</span>
          </button>

          <button
            onClick={onOpenCredits}
            className="btn px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/90 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:border-[#7C9A6B]/40"
            title="View project creators and engineering team"
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

        {/* MOBILE TOP CONTROLS (Only visible on mobile screens) */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenDossier}
            className="btn p-2 rounded-xl bg-[#7C9A6B]/15 text-[#A8C496] border border-[#7C9A6B]/30 transition-all cursor-pointer"
            title="Export Dossier (PDF)"
            aria-label="Export Dossier"
          >
            <FileText size={16} />
          </button>

          <button
            onClick={() => setShowMobileMenu(true)}
            className="btn p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] transition-all cursor-pointer"
            title="Open menu"
            aria-label="Open navigation menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* FULLSCREEN MOBILE MENU DRAWER */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-[#0E0F12]/98 backdrop-blur-2xl flex flex-col justify-between p-5 anim-fade-in md:hidden overflow-y-auto">
          {/* Drawer Top */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#141C14] border border-[#7C9A6B]/30 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M4 16C4 16 6 8 14 5C14 5 14 13 6 15L4 16Z" fill="#7C9A6B" opacity="0.95"/>
                    <path d="M4 16L9 11" stroke="#A8C496" strokeWidth="1.4" strokeLinecap="round" opacity="0.85"/>
                  </svg>
                </div>
                <span className="font-bold text-white text-base">farmelster modules</span>
              </div>

              <button
                onClick={() => setShowMobileMenu(false)}
                className="btn p-2 text-white/50 hover:text-white rounded-xl bg-white/[0.05] cursor-pointer"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modules Grid */}
            <div className="mt-4">
              <span className="text-[10px] font-semibold text-[#7C9A6B] uppercase tracking-wider block mb-2 px-1">
                Analytical Workstation
              </span>
              <div className="grid grid-cols-2 gap-2">
                {allTabs.map((t) => {
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveTab(t.id);
                        setShowMobileMenu(false);
                      }}
                      className={`btn p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#7C9A6B]/20 border-[#7C9A6B]/50 text-white font-bold shadow-md shadow-[#7C9A6B]/15'
                          : 'bg-white/[0.03] border-white/[0.06] text-white/70 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`p-1.5 rounded-lg ${isActive ? 'bg-[#7C9A6B] text-[#0E0F12]' : 'bg-white/[0.06] text-white/60'}`}>
                          {t.icon}
                        </span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#7C9A6B]" />}
                      </div>
                      <span className="text-xs font-semibold leading-tight">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Drawer Actions */}
          <div className="mt-6 pt-4 border-t border-white/[0.08] space-y-2">
            <button
              onClick={() => {
                onOpenTutorial?.();
                setShowMobileMenu(false);
              }}
              className="btn w-full p-2.5 rounded-xl bg-white/[0.04] text-white/90 text-xs font-medium flex items-center justify-between border border-white/[0.06]"
            >
              <div className="flex items-center gap-2">
                <Compass size={15} className="text-[#7C9A6B]" />
                <span>Interactive Platform Tour</span>
              </div>
              <span className="text-[10px] text-white/40">1 min</span>
            </button>

            <button
              onClick={() => {
                onOpenCredits();
                setShowMobileMenu(false);
              }}
              className="btn w-full p-2.5 rounded-xl bg-white/[0.04] text-white/90 text-xs font-medium flex items-center justify-between border border-white/[0.06]"
            >
              <div className="flex items-center gap-2">
                <Users size={15} className="text-[#7C9A6B]" />
                <span>Student Team Credits</span>
              </div>
              <span className="text-[10px] text-[#A8C496]">NASA 2026</span>
            </button>

            <button
              onClick={() => {
                onOpenDisclosures();
                setShowMobileMenu(false);
              }}
              className="btn w-full p-2.5 rounded-xl bg-white/[0.04] text-white/90 text-xs font-medium flex items-center justify-between border border-white/[0.06]"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-[#7C9A6B]" />
                <span>Data Disclosures &amp; NASA POWER</span>
              </div>
            </button>

            <button
              onClick={() => {
                onOpenDossier();
                setShowMobileMenu(false);
              }}
              className="btn w-full p-3 rounded-xl bg-[#7C9A6B] text-[#0E0F12] text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#7C9A6B]/20 cursor-pointer"
            >
              <FileText size={15} />
              <span>Export Field Dossier (PDF)</span>
            </button>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR (Thumb-friendly iOS/Android dock) */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#0E0F12]/95 backdrop-blur-xl border-t border-white/[0.08] z-30 px-3 flex items-center justify-around"
      >
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all ${
            activeTab === 'dashboard' ? 'text-[#7C9A6B]' : 'text-white/40 hover:text-white/70'
          }`}
        >
          <Map size={17} />
          <span className="text-[10px] font-semibold">Map</span>
        </button>

        <button
          onClick={() => setActiveTab('crops')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all ${
            activeTab === 'crops' ? 'text-[#7C9A6B]' : 'text-white/40 hover:text-white/70'
          }`}
        >
          <Sprout size={17} />
          <span className="text-[10px] font-semibold">Crops</span>
        </button>

        <button
          onClick={() => setActiveTab('soil')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all ${
            activeTab === 'soil' ? 'text-[#7C9A6B]' : 'text-white/40 hover:text-white/70'
          }`}
        >
          <Layers size={17} />
          <span className="text-[10px] font-semibold">Soil</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all ${
            activeTab === 'calendar' ? 'text-[#7C9A6B]' : 'text-white/40 hover:text-white/70'
          }`}
        >
          <Calendar size={17} />
          <span className="text-[10px] font-semibold">Calendar</span>
        </button>

        <button
          onClick={() => setShowMobileMenu(true)}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all ${
            showMobileMenu ? 'text-[#7C9A6B]' : 'text-white/40 hover:text-white/70'
          }`}
        >
          <Sliders size={17} />
          <span className="text-[10px] font-semibold">More</span>
        </button>
      </nav>
    </>
  );
};

