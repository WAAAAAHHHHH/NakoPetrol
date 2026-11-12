import React from 'react';
import { 
  ShieldCheck, 
  X, 
  ExternalLink, 
  Database, 
  Satellite, 
  Layers, 
  BookOpen,
  AlertTriangle
} from 'lucide-react';

interface DataTransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataTransparencyModal: React.FC<DataTransparencyModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="dark-glass-panel rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8E929C] hover:text-white p-1.5 rounded-sm bg-[#202229] hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="flex items-center space-x-2 text-[10px] font-mono font-semibold text-[#8E929C] uppercase tracking-widest mb-1.5">
          <ShieldCheck size={14} className="text-[#22C55E]" strokeWidth={2} />
          <span>Scientific Governance & Transparency Statement</span>
        </div>

        <h2 className="font-serif font-bold text-2xl text-white tracking-tight mb-2">
          NASA Earth Observation Data & Methodological Sources
        </h2>
        <p className="text-xs text-stone-300 leading-relaxed mb-6 font-sans">
          Germelon was architected for the <strong>NASA Space Apps Challenge 2026</strong> under the challenge category{' '}
          <em>"Field Shift: Adapting Farms with NASA Data"</em>.
          To ensure scientific reproducibility, all datasets, models, spatial resolutions, and analytical limitations are formally cataloged below.
        </p>

        {/* Data Sources Grid */}
        <div className="space-y-4 text-xs font-sans">
          {/* NASA POWER */}
          <div className="bg-[#18191E] border border-white/10 rounded-sm p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2.5">
                <div className="px-2 py-0.5 rounded-xs bg-[#22C55E] text-[#0E0F12] font-mono text-[10px] font-bold">
                  NASA POWER
                </div>
                <h3 className="font-serif font-bold text-white text-sm">
                  NASA POWER Agroclimatology Archive
                </h3>
              </div>
              <a
                href="https://power.larc.nasa.gov/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-[#22C55E] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Documentation</span>
                <ExternalLink size={11} strokeWidth={2} />
              </a>
            </div>
            <p className="text-stone-300 leading-relaxed">
              Provides multi-decadal agroclimatological reanalysis derived from the Goddard Earth Observing System (GEOS)
              and Modern-Era Retrospective Analysis for Research and Applications Version 2 (MERRA-2).
            </p>
            <div className="mt-2.5 p-2 bg-[#202229] border border-white/10 rounded-sm text-[10px] font-mono text-white space-y-0.5">
              <div>&bull; Parameters: T2M (Mean Temp), T2M_MIN, T2M_MAX, PRECTOTCORR (Precipitation), ALLSKY_SFC_SW_DWN (Solar Insolation), RH2M (Humidity), WS2M (Wind Speed)</div>
              <div>&bull; Spatial Resolution: 0.5° &times; 0.5° (~50km &times; 50km) global grid</div>
            </div>
          </div>

          {/* ISRIC SoilGrids */}
          <div className="bg-[#18191E] border border-white/10 rounded-sm p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2.5">
                <div className="px-2 py-0.5 rounded-xs bg-[#202229] text-white border border-white/10 font-mono text-[10px] font-bold">
                  ISRIC
                </div>
                <h3 className="font-serif font-bold text-white text-sm">
                  ISRIC SoilGrids 2.0 Global Pedological Map
                </h3>
              </div>
              <a
                href="https://soilgrids.org/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-[#22C55E] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Documentation</span>
                <ExternalLink size={11} strokeWidth={2} />
              </a>
            </div>
            <p className="text-stone-300 leading-relaxed">
              Spatial machine learning predictions of physical and chemical soil properties calibrated against 240,000 international ground core samples
              and global environmental covariates.
            </p>
            <div className="mt-2.5 p-2 bg-[#202229] border border-white/10 rounded-sm text-[10px] font-mono text-white space-y-0.5">
              <div>&bull; Parameters: Soil pH (H2O), Clay %, Sand %, Silt %, Soil Organic Carbon (g/kg), Cation Exchange Capacity (CEC), Bulk Density</div>
              <div>&bull; Standard Depth Strata: 0–5 cm, 5–15 cm, 15–30 cm</div>
              <div>&bull; Spatial Resolution: 250 m pixels</div>
            </div>
          </div>

          {/* MODIS & Sentinel-2 */}
          <div className="bg-[#18191E] border border-white/10 rounded-sm p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2.5">
                <div className="px-2 py-0.5 rounded-xs bg-[#202229] text-white border border-white/10 font-mono text-[10px] font-bold">
                  NASA / ESA
                </div>
                <h3 className="font-serif font-bold text-white text-sm">
                  NASA MODIS & ESA Copernicus Sentinel-2 Remote Sensing
                </h3>
              </div>
              <span className="text-[10px] text-[#8E929C] font-mono uppercase">
                Multispectral Radiometry
              </span>
            </div>
            <p className="text-stone-300 leading-relaxed">
              Calculates Normalized Difference Vegetation Index (NDVI) and Vegetation Condition Index (VCI)
              to track temporal photosynthetic greenup, phenological progression, and canopy moisture anomalies.
            </p>
            <div className="mt-2.5 p-2 bg-[#202229] border border-white/10 rounded-sm text-[10px] font-mono text-white space-y-0.5">
              <div>&bull; Formulation: NDVI = (NIR - Red) / (NIR + Red)</div>
              <div>&bull; Attribution: Sentinel-2 is an ESA Copernicus mission; MODIS flies on NASA Terra & Aqua satellites.</div>
            </div>
          </div>

          {/* FAO Crop Knowledge Base */}
          <div className="bg-[#18191E] border border-white/10 rounded-sm p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2.5">
                <div className="px-2 py-0.5 rounded-xs bg-[#202229] text-white border border-white/10 font-mono text-[10px] font-bold">
                  FAO
                </div>
                <h3 className="font-serif font-bold text-white text-sm">
                  FAO EcoCrop & Irrigation and Drainage Paper 56
                </h3>
              </div>
              <a
                href="https://www.fao.org/land-water/databases-and-software/crop-information/en/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-[#22C55E] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>FAO Guidelines</span>
                <ExternalLink size={11} strokeWidth={2} />
              </a>
            </div>
            <p className="text-stone-300 leading-relaxed">
              Provides documented physiological thresholds for crop water envelopes, base temperatures,
              heat stress limits, and soil pH tolerance across 11 major global field crops.
            </p>
          </div>
        </div>

        {/* Limitations Notice */}
        <div className="mt-6 p-4 bg-[#261E14] border border-[rgba(245,158,11,0.2)] rounded-sm text-xs space-y-2">
          <div className="flex items-center space-x-2 font-mono font-bold text-[10px] text-[#F59E0B] uppercase tracking-wider">
            <AlertTriangle size={14} strokeWidth={2} />
            <span>Methodological Limitations & Advisory Disclaimers</span>
          </div>
          <p className="text-[#FBBF24] leading-relaxed">
            1. <strong>Independent Student Submission:</strong> Germelon is an educational and technical exploration platform developed for the NASA Space Apps Challenge 2026. NASA does not formally certify or validate individual agricultural forecasts.
          </p>
          <p className="text-[#FBBF24] leading-relaxed">
            2. <strong>Pedological Validation:</strong> Gridded 250m soil estimations provide regional baseline context. They cannot substitute for ISO-certified wet chemistry core sampling for exact micro-nutrient fertilizer prescriptions.
          </p>
          <p className="text-[#FBBF24] leading-relaxed">
            3. <strong>Microclimate & Sowing Windows:</strong> Reanalysis indicates multi-decadal historical risk envelopes; operators must cross-reference synoptic 5-day weather forecasts before initiating sowing or fertilizer application.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
