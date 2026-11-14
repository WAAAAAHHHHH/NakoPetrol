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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 anim-fade-in">
      <div className="dark-glass-panel rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative border border-white/[0.08] anim-scale-in text-xs">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="flex items-center space-x-2 text-xs font-medium text-[#7C9A6B] mb-1.5">
          <ShieldCheck size={14} />
          <span>Scientific Governance &amp; Transparency Statement</span>
        </div>

        <h2 className="text-xl font-semibold text-white tracking-tight mb-2">
          NASA Earth Observation Data &amp; Methodological Sources
        </h2>
        <p className="text-xs text-white/60 leading-relaxed mb-6">
          Farmelster was architected for the <strong>NASA Space Apps Challenge 2026</strong> under the challenge category{' '}
          <em>"Field Shift: Adapting Farms with NASA Data"</em>.
          To ensure scientific reproducibility, all datasets, models, spatial resolutions, and analytical limitations are formally cataloged below.
        </p>

        {/* Data Sources Grid */}
        <div className="space-y-4 text-xs">
          {/* NASA POWER */}
          <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 space-y-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="px-2.5 py-0.5 rounded-md bg-[#7C9A6B]/15 text-[#A8C496] border border-[#7C9A6B]/25 text-xs font-semibold">
                  NASA POWER
                </span>
                <h3 className="font-semibold text-white text-sm">
                  NASA POWER Agroclimatology Archive
                </h3>
              </div>
              <a
                href="https://power.larc.nasa.gov/"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#7C9A6B] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Documentation</span>
                <ExternalLink size={12} />
              </a>
            </div>
            <p className="text-white/60 leading-relaxed">
              Provides multi-decadal agroclimatological reanalysis derived from the Goddard Earth Observing System (GEOS)
              and Modern-Era Retrospective Analysis for Research and Applications Version 2 (MERRA-2).
            </p>
            <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-xs text-white/70 space-y-1">
              <div>&bull; Parameters: Mean Temp, Min/Max Temp, Precipitation, Solar Insolation, Humidity, Wind Speed at 2m</div>
              <div>&bull; Spatial Resolution: 0.5° &times; 0.5° (~50km &times; 50km) global grid</div>
            </div>
          </div>

          {/* ISRIC SoilGrids */}
          <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 space-y-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="px-2.5 py-0.5 rounded-md bg-white/[0.05] text-white/80 border border-white/[0.08] text-xs font-semibold">
                  ISRIC
                </span>
                <h3 className="font-semibold text-white text-sm">
                  ISRIC SoilGrids 2.0 Global Pedological Map
                </h3>
              </div>
              <a
                href="https://soilgrids.org/"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#7C9A6B] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Documentation</span>
                <ExternalLink size={12} />
              </a>
            </div>
            <p className="text-white/60 leading-relaxed">
              Spatial machine learning predictions of physical and chemical soil properties calibrated against 240,000 international ground core samples
              and global environmental covariates.
            </p>
            <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-xs text-white/70 space-y-1">
              <div>&bull; Parameters: Soil pH (H2O), Clay %, Sand %, Silt %, Soil Organic Carbon (g/kg), Cation Exchange Capacity (CEC), Bulk Density</div>
              <div>&bull; Standard Depth Strata: 0–5 cm, 5–15 cm, 15–30 cm &bull; 250 m pixels</div>
            </div>
          </div>

          {/* MODIS & Sentinel-2 */}
          <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 space-y-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="px-2.5 py-0.5 rounded-md bg-white/[0.05] text-white/80 border border-white/[0.08] text-xs font-semibold">
                  NASA / ESA
                </span>
                <h3 className="font-semibold text-white text-sm">
                  NASA MODIS &amp; ESA Copernicus Sentinel-2 Remote Sensing
                </h3>
              </div>
              <span className="text-xs text-white/40">
                Multispectral Radiometry
              </span>
            </div>
            <p className="text-white/60 leading-relaxed">
              Calculates Normalized Difference Vegetation Index (NDVI) and Vegetation Condition Index (VCI)
              to track temporal photosynthetic greenup, phenological progression, and canopy moisture anomalies.
            </p>
            <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-xs text-white/70 space-y-1">
              <div>&bull; Formulation: NDVI = (NIR - Red) / (NIR + Red)</div>
              <div>&bull; Attribution: Sentinel-2 is an ESA Copernicus mission; MODIS flies on NASA Terra &amp; Aqua satellites.</div>
            </div>
          </div>

          {/* FAO Crop Knowledge Base */}
          <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 space-y-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="px-2.5 py-0.5 rounded-md bg-white/[0.05] text-white/80 border border-white/[0.08] text-xs font-semibold">
                  FAO
                </span>
                <h3 className="font-semibold text-white text-sm">
                  FAO EcoCrop &amp; Irrigation and Drainage Paper 56
                </h3>
              </div>
              <a
                href="https://www.fao.org/land-water/databases-and-software/crop-information/en/"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#7C9A6B] hover:underline flex items-center gap-1 font-medium"
              >
                <span>FAO Guidelines</span>
                <ExternalLink size={12} />
              </a>
            </div>
            <p className="text-white/60 leading-relaxed">
              Provides documented physiological thresholds for crop water envelopes, base temperatures,
              heat stress limits, and soil pH tolerance across 11 major global field crops.
            </p>
          </div>
        </div>

        {/* Limitations Notice */}
        <div className="mt-6 p-4 bg-[#D9A84C]/10 border border-[#D9A84C]/20 rounded-2xl text-xs space-y-2">
          <div className="flex items-center space-x-2 font-semibold text-[#E8C078]">
            <AlertTriangle size={15} />
            <span>Methodological Limitations &amp; Advisory Disclaimers</span>
          </div>
          <p className="text-[#E8C078]/90 leading-relaxed">
            1. <strong>Independent Project:</strong> Farmelster is an educational and technical exploration platform developed for the NASA Space Apps Challenge 2026. NASA does not formally certify or validate individual agricultural forecasts.
          </p>
          <p className="text-[#E8C078]/90 leading-relaxed">
            2. <strong>Pedological Validation:</strong> Gridded 250m soil estimations provide regional baseline context. They cannot substitute for ISO-certified wet chemistry core sampling for exact fertilizer prescriptions.
          </p>
          <p className="text-[#E8C078]/90 leading-relaxed">
            3. <strong>Microclimate &amp; Sowing Windows:</strong> Reanalysis indicates multi-decadal historical risk envelopes; operators must cross-reference synoptic short-term weather forecasts before initiating sowing.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="btn px-5 py-2.5 bg-[#7C9A6B] hover:bg-[#6E8A5D] text-[#0E0F12] rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Acknowledge &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
