import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Sprout, 
  Clock, 
  AlertTriangle, 
  AlertCircle 
} from 'lucide-react';
import { CropRecommendation } from '../types/terramind';
import { terramindApi } from '../services/api';

interface PlantingCalendarViewProps {
  crops: CropRecommendation[];
  selectedCropId: string;
  onSelectCrop: (cropId: string) => void;
  latitude: number;
  longitude: number;
  fieldName: string;
}

export const PlantingCalendarView: React.FC<PlantingCalendarViewProps> = ({
  crops,
  selectedCropId,
  onSelectCrop,
  latitude,
  longitude,
  fieldName
}) => {
  const [calendarData, setCalendarData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCalendar = async () => {
      setLoading(true);
      try {
        const data = await terramindApi.getPlantingCalendar(selectedCropId, latitude, longitude);
        if (isMounted) setCalendarData(data);
      } catch (err) {
        console.error('Failed to load planting calendar:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCalendar();
    return () => { isMounted = false; };
  }, [selectedCropId, latitude, longitude]);

  const currentCrop = crops.find(c => c.crop_id === selectedCropId) || crops[0];

  const getStatusClass = (status: string) => {
    if (status.includes('Planting')) {
      return 'bg-[#7C9A6B]/20 text-[#A8C496] border border-[#7C9A6B]/30 font-medium';
    }
    if (status.includes('Harvest')) {
      return 'bg-[#D9A84C]/20 text-[#E8C078] border border-[#D9A84C]/30 font-medium';
    }
    if (status.includes('Heat Stress')) {
      return 'bg-[#C47B6A]/20 text-[#DFA090] border border-[#C47B6A]/30 font-medium';
    }
    if (status.includes('Vegetative')) {
      return 'bg-white/[0.04] text-white/80 border border-white/[0.08]';
    }
    return 'bg-white/[0.02] text-white/40 border border-transparent';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 anim-fade-up">
      {/* Editorial Header */}
      <div className="border-b border-white/[0.07] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-[#7C9A6B] font-medium tracking-wide mb-1 flex items-center gap-1.5">
            <Calendar size={13} />
            <span>NASA POWER Agroclimatology &bull; Thermal Phenology Model</span>
          </div>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Planting Calendar &amp; Phenological Windows
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Optimal sowing windows, harvest periods, and frost avoidance for <span className="text-white/90 font-medium">{fieldName}</span>.
          </p>
        </div>

        {/* Crop Selector */}
        <div className="flex items-center space-x-2 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs">
          <span className="text-xs text-white/40 font-medium">Crop:</span>
          <select
            value={selectedCropId}
            onChange={(e) => onSelectCrop(e.target.value)}
            className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer pr-1"
          >
            {crops.map((c) => (
              <option key={c.crop_id} value={c.crop_id} className="bg-[#18191E] text-white">
                {c.name} ({c.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Sowing & Harvest Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs text-white/40 font-medium mb-1">
              Optimal Sowing Window
            </div>
            <div className="text-xl font-bold text-[#7C9A6B] mt-0.5 tracking-tight">
              {calendarData?.optimal_sowing_window || currentCrop?.recommended_planting_period}
            </div>
          </div>
          <div className="text-xs text-white/50 mt-3 pt-2.5 border-t border-white/[0.06]">
            Min soil seedbed temp: &ge; {calendarData?.planting_risk_analysis?.critical_soil_temp_c || 4}°C
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs text-white/40 font-medium mb-1">
              Anticipated Harvest Period
            </div>
            <div className="text-xl font-bold text-white mt-0.5 tracking-tight">
              {calendarData?.expected_harvest_window || currentCrop?.harvest_period}
            </div>
          </div>
          <div className="text-xs text-white/50 mt-3 pt-2.5 border-t border-white/[0.06]">
            Duration: {calendarData?.growing_season_duration || `${currentCrop?.parameters?.growing_season_days} days`}
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs text-white/40 font-medium mb-1">
              Heat Avoidance Limit
            </div>
            <div className="text-xl font-bold text-white mt-0.5 tracking-tight">
              {calendarData?.planting_risk_analysis?.heat_avoidance_threshold_c || 33}°C Max
            </div>
          </div>
          <div className="text-xs text-white/50 mt-3 pt-2.5 border-t border-white/[0.06]">
            Pollen desiccation threshold during flowering
          </div>
        </div>
      </div>

      {/* 12-Month Phenological Matrix Grid */}
      <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/[0.06]">
          <span className="text-xs font-semibold text-white/80">
            12-Month Phenological Progression Matrix: {currentCrop?.name}
          </span>
          <div className="flex items-center space-x-4 text-xs text-white/50">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#7C9A6B] inline-block" /> Sowing</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D9A84C] inline-block" /> Harvest</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-white/40 text-xs">
            <div className="w-6 h-6 border-2 border-white/10 border-t-[#7C9A6B] rounded-full animate-spin mb-3" />
            <span>Computing phenological progression windows...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {calendarData?.monthly_schedule?.map((m: any) => {
              const statusClass = getStatusClass(m.status);
              return (
                <div
                  key={m.month}
                  className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                    m.is_planting_window
                      ? 'border-[#7C9A6B]/40 bg-[#7C9A6B]/5 shadow-sm'
                      : m.is_harvest_window
                      ? 'border-[#D9A84C]/40 bg-[#D9A84C]/5 shadow-sm'
                      : 'border-white/[0.06] bg-white/[0.02]'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2 text-xs">
                      <strong className="text-white font-semibold">{m.month}</strong>
                      <span className="text-white/40">{m.temp_mean_c}°C</span>
                    </div>

                    <div className={`px-2 py-1 rounded-lg text-[11px] text-center truncate ${statusClass}`}>
                      {m.status.split(' ')[0]}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/[0.06] text-[10px] text-white/40 flex justify-between">
                    <span>Rain: {m.precipitation_mm}mm</span>
                    <span>Min: {m.temp_min_c}°C</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Early vs Delayed Sowing Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 space-y-3">
          <span className="text-xs font-semibold text-white/80 block">
            Early Planting Risks &amp; Vulnerabilities
          </span>
          <ul className="space-y-2 text-xs text-white/80">
            {calendarData?.planting_risk_analysis?.early_planting_risks?.map((r: string, i: number) => (
              <li key={i} className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] leading-relaxed">
                &bull; {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 space-y-3">
          <span className="text-xs font-semibold text-white/80 block">
            Delayed Sowing Risks &amp; Terminal Heat
          </span>
          <ul className="space-y-2 text-xs text-white/80">
            {calendarData?.planting_risk_analysis?.late_planting_risks?.map((r: string, i: number) => (
              <li key={i} className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] leading-relaxed">
                &bull; {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Scientific Limitation */}
      {calendarData?.scientific_disclaimer && (
        <div className="p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-xs text-white/50 leading-relaxed">
          <strong className="text-white/70">Observation note:</strong> {calendarData.scientific_disclaimer}
        </div>
      )}
    </div>
  );
};
