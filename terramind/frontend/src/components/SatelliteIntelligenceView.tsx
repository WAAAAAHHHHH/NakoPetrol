import React from 'react';
import { 
  Satellite, 
  Activity, 
  HelpCircle, 
  Info 
} from 'lucide-react';
import { SatelliteData } from '../types/terramind';

interface SatelliteIntelligenceViewProps {
  satellite: SatelliteData | null;
  fieldName: string;
}

export const SatelliteIntelligenceView: React.FC<SatelliteIntelligenceViewProps> = ({
  satellite,
  fieldName
}) => {
  if (!satellite) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-white/40 text-xs">
        <div className="w-6 h-6 border-2 border-white/10 border-t-[#7C9A6B] rounded-full animate-spin mb-3" />
        <span>Retrieving multispectral observation mosaic...</span>
      </div>
    );
  }

  const obs = satellite.current_observation;
  const timeSeries = satellite.time_series;

  return (
    <div className="max-w-6xl mx-auto space-y-6 anim-fade-up">
      {/* Editorial Header */}
      <div className="border-b border-white/[0.07] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-[#7C9A6B] font-medium tracking-wide mb-1 flex items-center gap-1.5">
            <Satellite size={13} />
            <span>Multispectral Remote Sensing &bull; NASA MODIS &amp; ESA Sentinel-2</span>
          </div>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Satellite Remote Sensing &amp; Canopy Reflectance (NDVI)
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Calibrated surface reflectance observations for <span className="text-white/90 font-medium">{fieldName}</span>.
          </p>
        </div>

        <div className="text-xs text-[#A8C496] bg-[#7C9A6B]/10 border border-[#7C9A6B]/20 px-3.5 py-1.5 rounded-xl font-medium">
          Spatial Resolution: <strong className="text-white font-semibold">{satellite.metadata.spatial_resolution}</strong>
        </div>
      </div>

      {/* 4 Quantitative Observation Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-xs text-white/40 font-medium mb-1">
              Mean Canopy NDVI
            </div>
            <div className="text-2xl font-bold text-[#7C9A6B] tracking-tight">
              {obs.mean_field_ndvi}
            </div>
            <div className="text-xs font-semibold text-white mt-1">
              {obs.vegetation_health_status}
            </div>
          </div>
          <div className="text-xs text-white/50 mt-3 pt-2.5 border-t border-white/[0.06]">
            Range: {obs.min_field_ndvi} - {obs.max_field_ndvi} (σ={obs.standard_deviation})
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-xs text-white/40 font-medium mb-1">
              Vegetation Condition (VCI)
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {obs.vegetation_condition_index_pct}%
            </div>
            <div className="text-xs text-white/60 mt-1">
              Historical 5-Year Percentile
            </div>
          </div>
          <div className="text-xs text-white/50 mt-3 pt-2.5 border-t border-white/[0.06]">
            Status: <span className="text-[#7C9A6B] font-medium">&gt; 50% Above-Average</span>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-xs text-white/40 font-medium mb-1">
              Anomalous Stress Detection
            </div>
            <div className="text-base font-semibold text-white mt-1">
              {obs.stress_anomaly}
            </div>
          </div>
          <div className="text-xs text-white/50 mt-3 pt-2.5 border-t border-white/[0.06]">
            Latest Composite: {obs.latest_date}
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-xs text-white/40 font-medium mb-1">
              Sensor Band Configuration
            </div>
            <div className="text-xs text-white/80 mt-1 space-y-0.5">
              <div>NIR: Band 8 (~842 nm)</div>
              <div>Red: Band 4 (~665 nm)</div>
            </div>
          </div>
          <div className="text-xs text-white/50 mt-3 pt-2.5 border-t border-white/[0.06]">
            BOA Surface Reflectance
          </div>
        </div>
      </div>

      {/* 12-Month Multi-Temporal NDVI Phenological Trajectory */}
      <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/[0.06]">
          <span className="text-xs font-semibold text-white/80">
            12-Month Satellite NDVI Phenological Trajectory (16-Day Composites)
          </span>
          <span className="text-xs text-white/40">
            Chlorophyll anthesis peak in May; harvest drop in July
          </span>
        </div>

        {/* Minimalist Analytical Bar Chart */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 mt-3">
          {timeSeries.map((pt) => {
            const heightPct = Math.max(10, Math.round(pt.ndvi * 100));
            return (
              <div key={pt.month} className="flex flex-col items-center">
                <div className="w-full h-36 bg-white/[0.03] p-1.5 flex flex-col justify-end items-center border border-white/[0.06] rounded-xl">
                  <span className="text-xs font-semibold text-[#7C9A6B] mb-1.5">{pt.ndvi}</span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-lg transition-all duration-300 ${
                      pt.ndvi >= 0.7 
                        ? 'bg-[#7C9A6B]' 
                        : pt.ndvi >= 0.4 
                        ? 'bg-[#A8C496]' 
                        : 'bg-white/20'
                    }`}
                  />
                </div>
                <span className="text-xs font-medium text-white/80 mt-2">{pt.month}</span>
                <span className="text-[10px] text-white/40">VCI {pt.vci_pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formula & Scientific Physical Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 space-y-3">
          <span className="text-xs font-semibold text-white/80 block">
            Spectral Reflectance Physics &amp; Formula
          </span>

          <div className="bg-white/[0.03] border border-white/[0.06] p-3.5 text-center rounded-xl text-sm font-semibold text-[#7C9A6B]">
            NDVI = (NIR - Red) / (NIR + Red)
          </div>

          <p className="text-xs text-white/60 leading-relaxed">
            Photosynthetically active vegetation absorbs solar radiation in the red spectral band (~660 nm)
            via chlorophyll-a and chlorophyll-b, while reflecting strongly in near-infrared (~840 nm)
            through scattering in spongy leaf mesophyll.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 space-y-3">
          <span className="text-xs font-semibold text-white/80 block">
            Canopy Classification Index
          </span>

          <div className="space-y-1.5 text-xs">
            {satellite.interpretation_guide.map((g, i) => (
              <div key={i} className="flex justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <strong className="text-[#7C9A6B]">{g.range}</strong>
                <span className="text-white/70">{g.classification}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attribution & Limitations */}
      <div className="p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-xs text-white/50 leading-relaxed">
        <strong className="text-white/70">Attribution Note:</strong> {satellite.metadata.transparency_note}
      </div>
    </div>
  );
};
