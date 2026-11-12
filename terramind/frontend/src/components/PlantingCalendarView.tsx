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
      return 'bg-[#22C55E] text-[#0E0F12] font-semibold';
    }
    if (status.includes('Harvest')) {
      return 'bg-[#A6B58A] text-[#15803D] font-semibold';
    }
    if (status.includes('Heat Stress')) {
      return 'bg-[#202229] text-[#8E929C] font-mono';
    }
    if (status.includes('Vegetative')) {
      return 'bg-[#18191E] text-[#22C55E] border border-white/10';
    }
    return 'bg-[#0E0F12] text-[#8E929C]';
  };

  return (
    <div className="space-y-4">
      {/* Editorial Header */}
      <div className="border-b border-white/10 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#8E929C]">
            NASA POWER Agroclimatology &bull; Thermal Phenology Model
          </div>
          <h1 className="font-serif text-xl font-bold text-white">
            Planting Calendar &amp; Phenological Windows
          </h1>
          <p className="text-xs text-stone-300 mt-0.5">
            Optimal sowing windows, harvest periods, and frost avoidance for <strong className="text-white">{fieldName}</strong>.
          </p>
        </div>

        {/* Crop Selector */}
        <div className="flex items-center space-x-2 bg-[#18191E] border border-white/10 rounded-sm px-2.5 py-1 text-xs">
          <span className="text-[10px] font-mono uppercase text-[#8E929C]">SPECIMEN:</span>
          <select
            value={selectedCropId}
            onChange={(e) => onSelectCrop(e.target.value)}
            className="bg-transparent text-white font-serif font-bold text-xs focus:outline-none cursor-pointer"
          >
            {crops.map((c) => (
              <option key={c.crop_id} value={c.crop_id}>
                {c.name} ({c.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Sowing & Harvest Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-3.5">
          <div className="text-[10px] font-mono uppercase text-[#8E929C] mb-1">
            Optimal Sowing Window
          </div>
          <div className="font-mono text-xl font-bold text-[#22C55E] mt-0.5">
            {calendarData?.optimal_sowing_window || currentCrop?.recommended_planting_period}
          </div>
          <div className="text-[10px] font-mono text-[#8E929C] mt-1">
            MIN SOIL SEEDBED TEMP: &ge; {calendarData?.planting_risk_analysis?.critical_soil_temp_c || 4}°C
          </div>
        </div>

        <div className="bg-[#18191E] border border-white/10 rounded-sm p-3.5">
          <div className="text-[10px] font-mono uppercase text-[#8E929C] mb-1">
            Anticipated Harvest Period
          </div>
          <div className="font-mono text-xl font-bold text-white mt-0.5">
            {calendarData?.expected_harvest_window || currentCrop?.harvest_period}
          </div>
          <div className="text-[10px] font-mono text-[#8E929C] mt-1">
            DURATION: {calendarData?.growing_season_duration || `${currentCrop?.parameters?.growing_season_days} days`}
          </div>
        </div>

        <div className="bg-[#18191E] border border-white/10 rounded-sm p-3.5">
          <div className="text-[10px] font-mono uppercase text-[#8E929C] mb-1">
            Heat Avoidance Limit
          </div>
          <div className="font-mono text-xl font-bold text-white mt-0.5">
            {calendarData?.planting_risk_analysis?.heat_avoidance_threshold_c || 33}°C Max
          </div>
          <div className="text-[10px] font-mono text-[#8E929C] mt-1">
            Pollen desiccation threshold during flowering
          </div>
        </div>
      </div>

      {/* 12-Month Phenological Matrix Grid */}
      <div className="bg-[#18191E] border border-white/10 rounded-sm p-4">
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/10">
          <span className="font-mono text-[10px] uppercase text-[#8E929C] font-semibold">
            12-Month Phenological Progression Matrix: {currentCrop?.name}
          </span>
          <div className="flex items-center space-x-3 text-[10px] font-mono text-[#8E929C]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#22C55E] inline-block" /> SOWING</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#A6B58A] inline-block" /> HARVEST</span>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[#8E929C] font-mono text-xs">
            COMPUTING PHENOLOGICAL WINDOWS...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {calendarData?.monthly_schedule?.map((m: any) => {
              const statusClass = getStatusClass(m.status);
              return (
                <div
                  key={m.month}
                  className={`p-2.5 rounded-xs border border-white/10 flex flex-col justify-between ${
                    m.is_planting_window
                      ? 'border-[#22C55E] bg-[#22C55E]/5'
                      : m.is_harvest_window
                      ? 'border-[#A6B58A] bg-[#A6B58A]/10'
                      : 'bg-[#18191E]'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-1 font-mono text-xs">
                      <strong className="text-white">{m.month}</strong>
                      <span className="text-[#8E929C] text-[10px]">{m.temp_mean_c}°C</span>
                    </div>

                    <div className={`px-1.5 py-0.5 rounded-xs text-[10px] font-mono text-center truncate ${statusClass}`}>
                      {m.status.split(' ')[0]}
                    </div>
                  </div>

                  <div className="mt-2.5 pt-1.5 border-t border-white/10 text-[9px] font-mono text-[#8E929C] flex justify-between">
                    <span>RAIN: {m.precipitation_mm}mm</span>
                    <span>MIN: {m.temp_min_c}°C</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Early vs Delayed Sowing Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-4 space-y-2">
          <span className="text-[10px] font-mono uppercase text-[#8E929C] font-semibold block">
            Early Planting Risks &amp; Vulnerabilities
          </span>
          <ul className="space-y-1.5 text-xs text-stone-300">
            {calendarData?.planting_risk_analysis?.early_planting_risks?.map((r: string, i: number) => (
              <li key={i} className="bg-[#202229] p-2 border border-white/10 leading-relaxed">
                &bull; {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#18191E] border border-white/10 rounded-sm p-4 space-y-2">
          <span className="text-[10px] font-mono uppercase text-[#8E929C] font-semibold block">
            Delayed Sowing Risks &amp; Terminal Heat
          </span>
          <ul className="space-y-1.5 text-xs text-stone-300">
            {calendarData?.planting_risk_analysis?.late_planting_risks?.map((r: string, i: number) => (
              <li key={i} className="bg-[#202229] p-2 border border-white/10 leading-relaxed">
                &bull; {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Scientific Limitation */}
      <div className="p-3 bg-[#202229] border border-white/10 rounded-sm text-[11px] text-stone-300 leading-relaxed font-mono">
        OBSERVATION NOTE: {calendarData?.scientific_disclaimer}
      </div>
    </div>
  );
};
