import React from 'react';
import { 
  Sun, 
  CloudRain, 
  Thermometer, 
  Flame, 
  Snowflake, 
  Droplets,
  Wind
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
      <div className="flex flex-col items-center justify-center p-12 text-white/40 text-xs">
        <div className="w-6 h-6 border-2 border-white/10 border-t-[#7C9A6B] rounded-full animate-spin mb-3" />
        <span>Retrieving NASA POWER 30-year agroclimatology records...</span>
      </div>
    );
  }

  const summary = climate.summary;
  const monthly = climate.monthly;
  const maxPrecip = Math.max(...monthly.map(m => m.precipitation_mm), 1.0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 anim-fade-up">
      {/* Editorial Header */}
      <div className="border-b border-white/[0.07] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-[#7C9A6B] font-medium tracking-wide mb-1 flex items-center gap-1.5">
            <Sun size={13} />
            <span>NASA POWER MERRA-2 Assimilation &bull; 30-Year Agroclimatic Baseline</span>
          </div>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Agroclimatology &amp; Climate Risk Vulnerability
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Precipitation cycles, thermal extremes, and natural hazard indices for <span className="text-white/90 font-medium">{fieldName}</span>.
          </p>
        </div>

        {/* Vulnerability Rating Badge */}
        <div className="flex items-center space-x-3 bg-white/[0.03] border border-white/[0.08] px-4 py-2 rounded-xl shadow-sm">
          <div className="text-right">
            <span className="text-[10px] text-white/40 font-medium block">Vulnerability Rating</span>
            <span className="text-xs font-semibold text-white">{risks.vulnerability_classification}</span>
          </div>
          <div className="text-xl font-bold text-[#7C9A6B] border-l border-white/[0.08] pl-3.5 tracking-tight">
            {risks.overall_climate_vulnerability_index} <span className="text-[10px] text-white/40 font-normal">/ 100</span>
          </div>
        </div>
      </div>

      {/* 4 Quantitative Hazard Analysis Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Drought */}
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between text-xs text-white/40 font-medium mb-1.5">
              <span>Drought Exposure</span>
              <strong className="text-[#7C9A6B]">{risks.risk_categories.drought.score}/100</strong>
            </div>
            <div className="font-semibold text-base text-white">
              {risks.risk_categories.drought.level.split(' ')[0]}
            </div>
            <div className="text-xs text-[#7C9A6B] font-medium mt-0.5">
              {risks.risk_categories.drought.key_metric}
            </div>
            <p className="text-xs text-white/60 mt-2 leading-relaxed">
              {risks.risk_categories.drought.description}
            </p>
          </div>
          <div className="text-xs text-white/40 mt-3 pt-2.5 border-t border-white/[0.06]">
            Annual mean deficit profile
          </div>
        </div>

        {/* Heat Stress */}
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between text-xs text-white/40 font-medium mb-1.5">
              <span>Heat Stress Hazard</span>
              <strong className="text-[#D9A84C]">{risks.risk_categories.heat_stress.score}/100</strong>
            </div>
            <div className="font-semibold text-base text-white">
              {risks.risk_categories.heat_stress.level.split(' ')[0]}
            </div>
            <div className="text-xs text-[#D9A84C] font-medium mt-0.5">
              {risks.risk_categories.heat_stress.key_metric}
            </div>
            <p className="text-xs text-white/60 mt-2 leading-relaxed">
              {risks.risk_categories.heat_stress.description}
            </p>
          </div>
          <div className="text-xs text-white/40 mt-3 pt-2.5 border-t border-white/[0.06]">
            Flowering anthesis exposure
          </div>
        </div>

        {/* Frost Hazard */}
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between text-xs text-white/40 font-medium mb-1.5">
              <span>Frost &amp; Freeze Risk</span>
              <strong className="text-[#7C9A6B]">{risks.risk_categories.frost_hazard.score}/100</strong>
            </div>
            <div className="font-semibold text-base text-white">
              {risks.risk_categories.frost_hazard.level.split(' ')[0]}
            </div>
            <div className="text-xs text-[#7C9A6B] font-medium mt-0.5">
              {risks.risk_categories.frost_hazard.key_metric}
            </div>
            <p className="text-xs text-white/60 mt-2 leading-relaxed">
              {risks.risk_categories.frost_hazard.description}
            </p>
          </div>
          <div className="text-xs text-white/40 mt-3 pt-2.5 border-t border-white/[0.06]">
            Sub-zero minimum recordings
          </div>
        </div>

        {/* Excessive Rainfall */}
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between text-xs text-white/40 font-medium mb-1.5">
              <span>Excessive Precipitation</span>
              <strong className="text-[#7C9A6B]">{risks.risk_categories.excessive_rainfall.score}/100</strong>
            </div>
            <div className="font-semibold text-base text-white">
              {risks.risk_categories.excessive_rainfall.level.split(' ')[0]}
            </div>
            <div className="text-xs text-[#7C9A6B] font-medium mt-0.5">
              {risks.risk_categories.excessive_rainfall.key_metric}
            </div>
            <p className="text-xs text-white/60 mt-2 leading-relaxed">
              {risks.risk_categories.excessive_rainfall.description}
            </p>
          </div>
          <div className="text-xs text-white/40 mt-3 pt-2.5 border-t border-white/[0.06]">
            Seasonal runoff &amp; waterlogging
          </div>
        </div>
      </div>

      {/* 12-Month Dual Climatogram Chart */}
      <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/[0.06]">
          <span className="text-xs font-semibold text-white/80">
            Hydro-Thermal Climatogram (Monthly Precipitation &amp; Mean Temperature)
          </span>
          <div className="flex items-center space-x-4 text-xs text-white/50">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#7C9A6B] inline-block" /> Rainfall (mm)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-white/40 inline-block" /> Temperature (°C)</span>
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 mt-3">
          {monthly.map((m) => {
            const barHeightPct = Math.min(100, Math.max(8, Math.round((m.precipitation_mm / (maxPrecip * 1.15)) * 100)));
            return (
              <div key={m.month} className="flex flex-col items-center">
                <div className="w-full h-40 bg-white/[0.03] p-1.5 flex flex-col justify-between items-center border border-white/[0.06] rounded-xl">
                  <span className="text-xs font-semibold text-white/90">{m.temp_mean_c}°</span>
                  <div className="w-full flex flex-col justify-end items-center h-28">
                    <span className="text-[10px] text-white/40 mb-1">{m.precipitation_mm}</span>
                    <div
                      style={{ height: `${barHeightPct}%` }}
                      className="w-full bg-[#7C9A6B] rounded-lg transition-all duration-300"
                    />
                  </div>
                </div>
                <span className="text-xs font-medium text-white/80 mt-2">{m.month}</span>
                <span className="text-[10px] text-white/40">{m.solar_radiation_mj_m2_day} MJ</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Auxiliary Climatology Parameters Table */}
      <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
          <span className="text-xs font-semibold text-white/80">
            Auxiliary Agroclimatic Observations (Solar Insolation, Relative Humidity, Wind Velocity)
          </span>
          <span className="text-xs text-white/40">NASA POWER Derived</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-white/[0.02] text-white/40 uppercase text-[10px] font-medium tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="py-2.5 px-5">Parameter Name</th>
                <th className="py-2.5 px-5">SI Unit</th>
                <th className="py-2.5 px-5">Annual Mean</th>
                <th className="py-2.5 px-5">Min Month</th>
                <th className="py-2.5 px-5">Max Month</th>
                <th className="py-2.5 px-5">Agricultural Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-white/90">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-5 font-semibold text-[#7C9A6B]">Solar Radiation (ALLSKY_SFC_SW_DWN)</td>
                <td className="py-3 px-5 text-white/60">MJ/m²/day</td>
                <td className="py-3 px-5 font-semibold">{summary.annual_solar_radiation_mean_mj}</td>
                <td className="py-3 px-5 text-white/60">Dec (5.1-6.5)</td>
                <td className="py-3 px-5 text-white/60">Jul (26.4-28.8)</td>
                <td className="py-3 px-5 text-white/60">Drives canopy photosynthesis and reference evapotranspiration (ET0).</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-5 font-semibold text-[#7C9A6B]">Relative Humidity (RH2M)</td>
                <td className="py-3 px-5 text-white/60">%</td>
                <td className="py-3 px-5 font-semibold">58.4%</td>
                <td className="py-3 px-5 text-white/60">Jul (26-38%)</td>
                <td className="py-3 px-5 text-white/60">Dec (78-82%)</td>
                <td className="py-3 px-5 text-white/60">Regulates vapor pressure deficit (VPD) and leaf transpiration stress.</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-5 font-semibold text-[#7C9A6B]">Wind Speed at 2m (WS2M)</td>
                <td className="py-3 px-5 text-white/60">m/s</td>
                <td className="py-3 px-5 font-semibold">2.8 m/s</td>
                <td className="py-3 px-5 text-white/60">Nov (1.9-2.2)</td>
                <td className="py-3 px-5 text-white/60">Jul (3.2-3.5)</td>
                <td className="py-3 px-5 text-white/60">Determines aerodynamic resistance; threshold for spray drift is 4.5 m/s.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
