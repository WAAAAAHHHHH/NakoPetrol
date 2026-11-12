import React from 'react';
import { 
  Compass, 
  MapPin, 
  Droplets, 
  Activity, 
  ChevronDown 
} from 'lucide-react';
import { DemoField } from '../types/terramind';

interface TopToolbarProps {
  demoFields: DemoField[];
  selectedField: DemoField | null;
  onSelectField: (field: DemoField) => void;
  irrigationAvailable: boolean;
  onToggleIrrigation: (val: boolean) => void;
  loading: boolean;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  demoFields,
  selectedField,
  onSelectField,
  irrigationAvailable,
  onToggleIrrigation,
  loading
}) => {
  return (
    <header className="h-12 bg-[#FAF9F5] border-b border-[#DADBD2] px-4 flex items-center justify-between select-none shrink-0 z-20 text-xs">
      {/* Left: Active Cadastre / Region Identifier */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <MapPin size={14} className="text-[#244D38]" strokeWidth={2} />
          <span className="font-semibold text-[#252923] truncate max-w-xs sm:max-w-md">
            {selectedField?.name || 'Field Parcel Inspector'}
          </span>
        </div>

        <div className="h-4 w-px bg-[#DADBD2] hidden sm:block" />

        <span className="text-[11px] text-[#8B8D85] hidden md:inline truncate">
          {selectedField?.region || 'National Cadastral Grid'}
        </span>
      </div>

      {/* Center: Technical Coordinate & Elevation Readout (IBM Plex Mono) */}
      {selectedField && (
        <div className="hidden lg:flex items-center space-x-4 font-mono text-[11px] text-[#4F544B] bg-[#EAE8DE] px-3 py-1 rounded-sm border border-[#DADBD2]">
          <div>
            <span className="text-[#8B8D85]">LAT:</span>{' '}
            <span className="text-[#252923] font-semibold">{selectedField.latitude.toFixed(4)}° N</span>
          </div>
          <div>
            <span className="text-[#8B8D85]">LON:</span>{' '}
            <span className="text-[#252923] font-semibold">{selectedField.longitude.toFixed(4)}° E</span>
          </div>
          <div>
            <span className="text-[#8B8D85]">ELEV:</span>{' '}
            <span className="text-[#252923] font-semibold">{selectedField.elevation_m} m</span>
          </div>
        </div>
      )}

      {/* Right: Controls & Regime Switch */}
      <div className="flex items-center space-x-2.5">
        {/* Field Switcher Select */}
        <div className="relative">
          <select
            value={selectedField?.id || ''}
            onChange={(e) => {
              const found = demoFields.find(f => f.id === e.target.value);
              if (found) onSelectField(found);
            }}
            className="appearance-none bg-[#FAF9F5] hover:bg-[#EAE8DE] text-[#252923] border border-[#DADBD2] rounded-sm pl-2.5 pr-7 py-1 text-xs font-medium focus:outline-none focus:border-[#244D38] cursor-pointer"
          >
            {demoFields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name.split(' ')[0]} ({field.region.split(',')[0]})
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-2.5 text-[#8B8D85] pointer-events-none" />
        </div>

        {/* Irrigation Regime Toggle */}
        <button
          onClick={() => onToggleIrrigation(!irrigationAvailable)}
          className={`px-2.5 py-1 rounded-sm border text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer ${
            irrigationAvailable
              ? 'bg-[#244D38] border-[#244D38] text-[#F3F2EA]'
              : 'bg-[#FAF9F5] border-[#DADBD2] text-[#4F544B] hover:bg-[#EAE8DE]'
          }`}
          title="Toggle Supplemental Irrigation"
        >
          <Droplets size={12} className={irrigationAvailable ? 'text-[#A6B58A]' : 'text-[#8B8D85]'} />
          <span className="font-mono text-[11px]">{irrigationAvailable ? 'IRRIGATED' : 'RAINFED'}</span>
        </button>

        {/* Network / Loading State Indicator */}
        {loading ? (
          <div className="flex items-center space-x-1.5 text-[10px] font-mono text-[#244D38] bg-[#EAE8DE] px-2 py-0.5 rounded-sm border border-[#DADBD2]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#244D38] animate-ping" />
            <span>SYNCING</span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center space-x-1 text-[10px] font-mono text-[#8B8D85] px-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#244D38]" />
            <span>ONLINE</span>
          </div>
        )}
      </div>
    </header>
  );
};

