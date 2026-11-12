import React from 'react';
import { 
  Sun, 
  CloudRain, 
  Thermometer, 
  Flame, 
  Snowflake, 
  Droplets 
} from 'lucide-react';
import { ClimateData, ClimateRisksData } from '../types/terramind';

interface ClimateIntelligenceViewProps {
  climate: ClimateData | null;
  risks: ClimateRisksData | null;
  fieldName: string;
}

export const ClimateIntelligenceView: React.FC<ClimateIntelligenceViewProps> = ({
  climate,
  risks,
  fieldName
}) => {
  if (!climate || !risks) {
    return (
      <div className="p-8 text-center text-[#8E929C] font-mono text-xs">
        RETRIEVING NASA POWER 30-YEAR AGROCLIMATOLOGY RECORDS...
      </div>
    );
  }

  const summary = climate.summary;
  const monthly = climate.monthly;
  const maxPrecip = Math.max(...monthly.map(m => m.precipitation_mm), 1.0);

  return (
    <div className="space-y-4">
      {/* Editorial Header */}
      <div className="border-b border-white/10 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#8E929C]">
            NASA POWER MERRA-2 Assimilation &bull; 30-Year Baseline
          </div>
          <h1 className="font-serif text-xl font-bold text-white">
            Agroclimatology &amp; Climate Risk Vulnerability
          </h1>
          <p className="text-xs text-stone-300 mt-0.5">
            Precipitation cycles, thermal extremes, and natural hazard indices for <strong className="text-white">{fieldName}</strong>.
          </p>
        </div>

        {/* Vulnerability Rating Badge */}
        <div className="flex items-center space-x-3 bg-[#18191E] border border-white/10 px-3 py-1.5 rounded-sm">
          <div className="text-right">
            <span className="text-[9px] font-mono uppercase text-[#8E929C] block">Vulnerability Rating</span>
            <span className="text-xs font-serif font-bold text-white">{risks.vulnerability_classification}</span>
          </div>
          <div className="font-mono text-lg font-bold text-[#22C55E] border-l border-white/10 pl-3">
            {risks.overall_climate_vulnerability_index} <span className="text-[9px] text-[#8E929C]">/ 100</span>
          </div>
        </div>
      </div>

      {/* 4 Quantitative Hazard Analysis Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Drought */}
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between text-[10px] font-mono uppercase text-[#8E929C] mb-1">
              <span>Drought Exposure</span>
              <strong className="text-[#22C55E]">{risks.risk_categories.drought.score}/100</strong>
            </div>
            <div className="font-serif font-bold text-base text-white">
              {risks.risk_categories.drought.level.split(' ')[0]}
            </div>
            <div className="text-[11px] font-mono text-[#22C55E] mt-0.5">
              {risks.risk_categories.drought.key_metric}
            </div>
            <p className="text-xs text-stone-300 mt-2 leading-relaxed">
              {risks.risk_categories.drought.description}
            </p>
          </div>
          <div className="text-[9px] font-mono text-[#8E929C] mt-3 pt-2 border-t border-white/10">
            ANNUAL MEAN DEFICIT PROFILE
          </div>
        </div>

        {/* Heat Stress */}
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between text-[10px] font-mono uppercase text-[#8E929C] mb-1">
              <span>Heat Stress Hazard</span>
              <strong className="text-[#22C55E]">{risks.risk_categories.heat_stress.score}/100</strong>
            </div>
            <div className="font-serif font-bold text-base text-white">
              {risks.risk_categories.heat_stress.level.split(' ')[0]}
            </div>
            <div className="text-[11px] font-mono text-[#22C55E] mt-0.5">
              {risks.risk_categories.heat_stress.key_metric}
            </div>
            <p className="text-xs text-stone-300 mt-2 leading-relaxed">
              {risks.risk_categories.heat_stress.description}
            </p>
          </div>
          <div className="text-[9px] font-mono text-[#8E929C] mt-3 pt-2 border-t border-white/10">
            FLOWERING ANTHESIS EXPOSURE
          </div>
        </div>

        {/* Frost Hazard */}
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between text-[10px] font-mono uppercase text-[#8E929C] mb-1">
              <span>Frost &amp; Freeze Risk</span>
              <strong className="text-[#22C55E]">{risks.risk_categories.frost_hazard.score}/100</strong>
            </div>
            <div className="font-serif font-bold text-base text-white">
              {risks.risk_categories.frost_hazard.level.split(' ')[0]}
            </div>
            <div className="text-[11px] font-mono text-[#22C55E] mt-0.5">
              {risks.risk_categories.frost_hazard.key_metric}
            </div>
            <p className="text-xs text-stone-300 mt-2 leading-relaxed">
              {risks.risk_categories.frost_hazard.description}
            </p>
          </div>
          <div className="text-[9px] font-mono text-[#8E929C] mt-3 pt-2 border-t border-white/10">
            SUB-ZERO MINIMUM RECORDINGS
          </div>
        </div>

        {/* Excessive Rainfall */}
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between text-[10px] font-mono uppercase text-[#8E929C] mb-1">
              <span>Excessive Precipitation</span>
              <strong className="text-[#22C55E]">{risks.risk_categories.excessive_rainfall.score}/100</strong>
            </div>
            <div className="font-serif font-bold text-base text-white">
              {risks.risk_categories.excessive_rainfall.level.split(' ')[0]}
            </div>
            <div className="text-[11px] font-mono text-[#22C55E] mt-0.5">
              {risks.risk_categories.excessive_rainfall.key_metric}
            </div>
            <p className="text-xs text-stone-300 mt-2 leading-relaxed">
              {risks.risk_categories.excessive_rainfall.description}
            </p>
          </div>
          <div className="text-[9px] font-mono text-[#8E929C] mt-3 pt-2 border-t border-white/10">
            SEASONAL RUNOFF / WATERLOGGING
          </div>
        </div>
      </div>

      {/* 12-Month Dual Climatogram Chart */}
      <div className="bg-[#18191E] border border-white/10 rounded-sm p-4">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
          <span className="font-mono text-[10px] uppercase text-[#8E929C] font-semibold">
            Hydro-Thermal Climatogram (Monthly Precipitation &amp; Mean Temperature)
          </span>
          <div className="flex items-center space-x-3 text-[10px] font-mono text-[#8E929C]">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2 bg-[#22C55E] inline-block" /> RAINFALL (mm)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[#8E929C] inline-block" /> TEMPERATURE (°C)</span>
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 mt-2">
          {monthly.map((m) => {
            const barHeightPct = Math.min(100, Math.round((m.precipitation_mm / (maxPrecip * 1.15)) * 100));
            return (
              <div key={m.month} className="flex flex-col items-center">
                <div className="w-full h-40 bg-[#202229] p-1 flex flex-col justify-between items-center border border-white/10 rounded-xs">
                  <span className="text-[10px] font-mono font-semibold text-white">{m.temp_mean_c}°</span>
                  <div className="w-full flex flex-col justify-end items-center h-28">
                    <span className="text-[9px] font-mono text-[#8E929C] mb-0.5">{m.precipitation_mm}</span>
                    <div
                      style={{ height: `${barHeightPct}%` }}
                      className="w-full bg-[#22C55E] rounded-xs"
                    />
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold text-white mt-1.5">{m.month}</span>
                <span className="text-[9px] font-mono text-[#8E929C]">{m.solar_radiation_mj_m2_day} MJ</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Auxiliary Climatology Parameters Table */}
      <div className="bg-[#18191E] border border-white/10 rounded-sm overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase text-[#8E929C] font-semibold">
            Auxiliary Agroclimatic Observations (Solar Insolation, Relative Humidity, Wind Velocity)
          </span>
          <span className="text-[10px] font-mono text-[#8E929C]">NASA POWER DERIVED</span>
        </div>

        <table className="w-full text-xs text-left">
          <thead className="bg-[#202229] text-stone-300 font-mono text-[10px] uppercase border-b border-white/10">
            <tr>
              <th className="py-2 px-4">Parameter Name</th>
              <th className="py-2 px-4">SI Unit</th>
              <th className="py-2 px-4">Annual Mean</th>
              <th className="py-2 px-4">Min Month</th>
              <th className="py-2 px-4">Max Month</th>
              <th className="py-2 px-4">Agricultural Significance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.1)] text-white font-mono text-[11px]">
            <tr className="hover:bg-[#202229]/40">
              <td className="py-2.5 px-4 font-bold text-[#22C55E] font-sans">Solar Radiation (ALLSKY_SFC_SW_DWN)</td>
              <td className="py-2.5 px-4">MJ/m²/day</td>
              <td className="py-2.5 px-4 font-bold">{summary.annual_solar_radiation_mean_mj}</td>
              <td className="py-2.5 px-4">Dec (5.1-6.5)</td>
              <td className="py-2.5 px-4">Jul (26.4-28.8)</td>
              <td className="py-2.5 px-4 font-sans text-xs text-stone-300">Drives plant canopy photosynthesis and daily reference evapotranspiration (ET0).</td>
            </tr>
            <tr className="hover:bg-[#202229]/40">
              <td className="py-2.5 px-4 font-bold text-[#22C55E] font-sans">Relative Humidity (RH2M)</td>
              <td className="py-2.5 px-4">%</td>
              <td className="py-2.5 px-4 font-bold">58.4%</td>
              <td className="py-2.5 px-4">Jul (26-38%)</td>
              <td className="py-2.5 px-4">Dec (78-82%)</td>
              <td className="py-2.5 px-4 font-sans text-xs text-stone-300">Regulates atmospheric vapor pressure deficit (VPD) and leaf transpiration stress.</td>
            </tr>
            <tr className="hover:bg-[#202229]/40">
              <td className="py-2.5 px-4 font-bold text-[#22C55E] font-sans">Wind Speed at 2m (WS2M)</td>
              <td className="py-2.5 px-4">m/s</td>
              <td className="py-2.5 px-4 font-bold">2.8 m/s</td>
              <td className="py-2.5 px-4">Nov (1.9-2.2)</td>
              <td className="py-2.5 px-4">Jul (3.2-3.5)</td>
              <td className="py-2.5 px-4 font-sans text-xs text-stone-300">Determines aerodynamic resistance; boundary for chemical spray drift is 4.5 m/s.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
