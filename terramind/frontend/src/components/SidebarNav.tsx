import React from 'react';
import { 
  Map, 
  Sprout, 
  Layers, 
  Calendar, 
  Satellite, 
  Sun, 
  SlidersHorizontal, 
  Repeat, 
  Terminal, 
  FileText,
  Compass
} from 'lucide-react';

export type TabKey = 
  | 'explorer' 
  | 'crops' 
  | 'soil' 
  | 'calendar' 
  | 'satellite' 
  | 'climate' 
  | 'what_if' 
  | 'rotation' 
  | 'advisor'
  | 'reports';

interface SidebarNavProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  onOpenReports: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenReports
}) => {
  const navItems: Array<{ key: TabKey; label: string; icon: React.ReactNode; code: string }> = [
    { key: 'explorer', label: 'Field Explorer', icon: <Map size={16} strokeWidth={1.75} />, code: '01' },
    { key: 'crops', label: 'Crop Planning', icon: <Sprout size={16} strokeWidth={1.75} />, code: '02' },
    { key: 'soil', label: 'Soil Analysis', icon: <Layers size={16} strokeWidth={1.75} />, code: '03' },
    { key: 'calendar', label: 'Planting Calendar', icon: <Calendar size={16} strokeWidth={1.75} />, code: '04' },
    { key: 'satellite', label: 'Satellite Data', icon: <Satellite size={16} strokeWidth={1.75} />, code: '05' },
    { key: 'climate', label: 'Climate Analysis', icon: <Sun size={16} strokeWidth={1.75} />, code: '06' },
    { key: 'what_if', label: 'Scenario Lab', icon: <SlidersHorizontal size={16} strokeWidth={1.75} />, code: '07' },
    { key: 'rotation', label: 'Crop Succession', icon: <Repeat size={16} strokeWidth={1.75} />, code: '08' },
    { key: 'advisor', label: 'Advisory Engine', icon: <Terminal size={16} strokeWidth={1.75} />, code: '09' },
  ];

  return (
    <aside className="w-56 bg-[#FAF9F5] border-r border-[#DADBD2] flex flex-col justify-between shrink-0 select-none h-screen sticky top-0">
      <div>
        {/* Brand / Cartographic Header */}
        <div className="p-4 border-b border-[#DADBD2]">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 bg-[#244D38] text-[#F3F2EA] flex items-center justify-center rounded-sm">
              <Compass size={14} strokeWidth={2} />
            </div>
            <div>
              <span className="font-serif font-bold text-sm text-[#252923] tracking-tight block leading-tight">
                TERRAMIND
              </span>
              <span className="text-[10px] text-[#8B8D85] font-mono tracking-wider block uppercase">
                GIS &bull; NASA AGRO-EO
              </span>
            </div>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-4 pt-4 pb-1.5 text-[10px] font-mono uppercase text-[#8B8D85] tracking-widest font-semibold">
          Spatial Modules
        </div>

        {/* Navigation Item List */}
        <nav className="p-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs font-medium transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#244D38] text-[#F3F2EA]'
                    : 'text-[#252923] hover:bg-[#EAE8DE] hover:text-[#193828]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={isActive ? 'text-[#A6B58A]' : 'text-[#8B8D85]'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                <span className={`text-[10px] font-mono ${isActive ? 'text-[#A6B58A]' : 'text-[#8B8D85]'}`}>
                  {item.code}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Technical Governance & System Status */}
      <div className="p-3 border-t border-[#DADBD2] bg-[#F3F2EA] space-y-2">
        <button
          onClick={onOpenReports}
          className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-sm text-xs font-medium text-[#252923] hover:bg-[#EAE8DE] transition-colors border border-[#DADBD2] cursor-pointer"
        >
          <FileText size={14} className="text-[#244D38]" strokeWidth={1.75} />
          <span>Data Governance &amp; Docs</span>
        </button>

        <div className="text-[10px] font-mono text-[#8B8D85] space-y-0.5 px-1">
          <div className="flex justify-between">
            <span>NASA POWER:</span>
            <span className="text-[#244D38] font-semibold">SYNCHRONIZED</span>
          </div>
          <div className="flex justify-between">
            <span>ISRIC 250M:</span>
            <span className="text-[#244D38] font-semibold">LOADED</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

