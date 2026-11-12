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
      <div className="p-8 text-center text-[#8E929C] font-mono text-xs">
        RETRIEVING MULTISPECTRAL OBSERVATION MOSAIC...
      </div>
    );
  }

  const obs = satellite.current_observation;
  const timeSeries = satellite.time_series;

  return (
    <div className="space-y-4">
      {/* Editorial Header */}
      <div className="border-b border-white/10 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#8E929C]">
            Multispectral Remote Sensing &bull; NASA MODIS &amp; ESA Sentinel-2
          </div>
          <h1 className="font-serif text-xl font-bold text-white">
            Satellite Remote Sensing &amp; Canopy Reflectance (NDVI)
          </h1>
          <p className="text-xs text-stone-300 mt-0.5">
            Calibrated surface reflectance observations for <strong className="text-white">{fieldName}</strong>.
          </p>
        </div>

        <div className="font-mono text-xs text-[#22C55E] bg-[#18191E] border border-white/10 px-3 py-1.5 rounded-sm">
          SPATIAL RESOLUTION: <strong>{satellite.metadata.spatial_resolution}</strong>
        </div>
      </div>

      {/* 4 Quantitative Observation Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-3.5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase text-[#8E929C] mb-1">
              Mean Canopy NDVI
            </div>
            <div className="font-mono text-2xl font-bold text-[#22C55E] mt-0.5">
              {obs.mean_field_ndvi}
            </div>
            <div className="text-[11px] font-serif font-bold text-white mt-1">
              {obs.vegetation_health_status}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[#8E929C] mt-3 pt-2 border-t border-white/10">
            RANGE: {obs.min_field_ndvi} - {obs.max_field_ndvi} (σ={obs.standard_deviation})
          </div>
        </div>

        <div className="bg-[#18191E] border border-white/10 rounded-sm p-3.5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase text-[#8E929C] mb-1">
              Vegetation Condition (VCI)
            </div>
            <div className="font-mono text-2xl font-bold text-white mt-0.5">
              {obs.vegetation_condition_index_pct}%
            </div>
            <div className="text-[11px] text-stone-300 mt-1">
              Historical 5-Year Percentile
            </div>
          </div>
          <div className="text-[10px] font-mono text-[#8E929C] mt-3 pt-2 border-t border-white/10">
            STATUS: &gt; 50% ABOVE-AVERAGE
          </div>
        </div>

        <div className="bg-[#18191E] border border-white/10 rounded-sm p-3.5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase text-[#8E929C] mb-1">
              Anomalous Stress Detection
            </div>
            <div className="font-serif font-bold text-sm text-white mt-1">
              {obs.stress_anomaly}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[#8E929C] mt-3 pt-2 border-t border-white/10">
            LATEST COMPOSITE: {obs.latest_date}
          </div>
        </div>

        <div className="bg-[#18191E] border border-white/10 rounded-sm p-3.5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase text-[#8E929C] mb-1">
              Sensor Band Configuration
            </div>
            <div className="font-mono text-xs text-white mt-1 space-y-0.5">
              <div>NIR: Band 8 (~842 nm)</div>
              <div>Red: Band 4 (~665 nm)</div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-[#8E929C] mt-3 pt-2 border-t border-white/10">
            ATMOSPHERIC: BOA SURFACE REFLECTANCE
          </div>
        </div>
      </div>

      {/* 12-Month Multi-Temporal NDVI Phenological Trajectory */}
      <div className="bg-[#18191E] border border-white/10 rounded-sm p-4">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
          <span className="font-mono text-[10px] uppercase text-[#8E929C] font-semibold">
            12-Month Satellite NDVI Phenological Trajectory (16-Day Composites)
          </span>
          <span className="text-[10px] font-mono text-[#8E929C]">
            Chlorophyll anthesis peak in May; harvest drop in July
          </span>
        </div>

        {/* Minimalist Analytical Bar Chart */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 mt-2">
          {timeSeries.map((pt) => {
            const heightPct = Math.round(pt.ndvi * 100);
            return (
              <div key={pt.month} className="flex flex-col items-center">
                <div className="w-full h-36 bg-[#202229] p-1 flex flex-col justify-end items-center border border-white/10 rounded-xs">
                  <span className="text-[10px] font-mono font-bold text-[#22C55E] mb-1">{pt.ndvi}</span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-xs transition-all ${
                      pt.ndvi >= 0.7 
                        ? 'bg-[#22C55E]' 
                        : pt.ndvi >= 0.4 
                        ? 'bg-[#A6B58A]' 
                        : 'bg-[#B5B7AB]'
                    }`}
                  />
                </div>
                <span className="text-xs font-mono font-semibold text-white mt-1.5">{pt.month}</span>
                <span className="text-[9px] font-mono text-[#8E929C]">VCI {pt.vci_pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formula & Scientific Physical Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-4 space-y-2">
          <span className="text-[10px] font-mono uppercase text-[#8E929C] font-semibold block">
            Spectral Reflectance Physics &amp; Formula
          </span>

          <div className="bg-[#202229] border border-white/10 p-3 text-center rounded-xs font-mono text-sm font-bold text-[#22C55E]">
            NDVI = (NIR - Red) / (NIR + Red)
          </div>

          <p className="text-xs text-stone-300 leading-relaxed">
            Photosynthetically active vegetation absorbs solar radiation in the red spectral band (~660 nm)
            via chlorophyll-a and chlorophyll-b, while reflecting strongly in near-infrared (~840 nm)
            through scattering in spongy leaf mesophyll.
          </p>
        </div>

        <div className="bg-[#18191E] border border-white/10 rounded-sm p-4 space-y-2">
          <span className="text-[10px] font-mono uppercase text-[#8E929C] font-semibold block">
            Canopy Classification Index
          </span>

          <div className="space-y-1.5 font-mono text-[11px]">
            {satellite.interpretation_guide.map((g, i) => (
              <div key={i} className="flex justify-between p-1.5 bg-[#202229] border border-white/10">
                <strong className="text-[#22C55E]">{g.range}</strong>
                <span className="text-stone-300">{g.classification}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attribution & Limitations */}
      <div className="p-3 bg-[#202229] border border-white/10 rounded-sm text-[11px] text-stone-300 font-mono leading-relaxed">
        ATTRIBUTION NOTE: {satellite.metadata.transparency_note}
      </div>
    </div>
  );
};
