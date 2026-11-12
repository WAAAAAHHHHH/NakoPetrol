import React, { useState, useEffect } from 'react';
import { 
  Repeat, 
  Sprout, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  Activity
} from 'lucide-react';
import { RotationPlanData } from '../types/terramind';
import { terramindApi } from '../services/api';

interface CropRotationViewProps {
  currentCropId: string;
  latitude: number;
  longitude: number;
  irrigationAvailable: boolean;
  fieldName: string;
}

export const CropRotationView: React.FC<CropRotationViewProps> = ({
  currentCropId,
  latitude,
  longitude,
  irrigationAvailable,
  fieldName
}) => {
  const [selectedPrevCrop, setSelectedPrevCrop] = useState<string>(currentCropId || 'wheat');
  const [rotationData, setRotationData] = useState<RotationPlanData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const prevCropOptions = [
    { id: 'wheat', name: 'Winter Wheat (Poaceae / Cereal)' },
    { id: 'barley', name: 'Barley (Poaceae / Drought-Tolerant Cereal)' },
    { id: 'corn', name: 'Grain Maize (Poaceae / Heavy Nitrogen Feeder)' },
    { id: 'sunflower', name: 'Sunflower (Asteraceae / Deep Taproot Oilseed)' },
    { id: 'cotton', name: 'Cotton (Malvaceae / Deep Taproot Fiber)' },
    { id: 'chickpeas', name: 'Chickpeas (Fabaceae / Legume N-Fixer)' },
    { id: 'lentils', name: 'Lentils (Fabaceae / Pulse N-Fixer)' },
    { id: 'tomatoes', name: 'Tomatoes (Solanaceae / Intensive Feeder)' },
    { id: 'potatoes', name: 'Potatoes (Solanaceae / Root Tuber)' }
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchRotation = async () => {
      setLoading(true);
      try {
        const data = await terramindApi.analyzeRotation(selectedPrevCrop, latitude, longitude, irrigationAvailable);
        if (isMounted) setRotationData(data);
      } catch (err) {
        console.error('Failed to load rotation data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRotation();
    return () => { isMounted = false; };
  }, [selectedPrevCrop, latitude, longitude, irrigationAvailable]);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Module Header & Prior Crop Selector */}
      <div className="bg-[#18191E] border border-white/10 rounded-sm p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono font-semibold text-[#8E929C] uppercase tracking-widest mb-1">
            <Repeat size={13} className="text-[#22C55E]" strokeWidth={2} />
            <span>Botanical Succession & Soil Health Management</span>
          </div>
          <h2 className="font-serif font-bold text-xl text-white tracking-tight">
            Crop Succession & Pathogen Break Architecture
          </h2>
          <p className="text-xs text-[#8E929C] mt-1 max-w-2xl leading-relaxed">
            Biological nitrogen restitution, root-zone stratification, and soil-borne nematode suppression for{' '}
            <strong className="text-white font-semibold">{fieldName}</strong>.
          </p>
        </div>

        {/* Previous Crop Selector Dropdown */}
        <div className="flex items-center space-x-2 bg-[#202229] border border-white/10 rounded-sm p-2 text-xs shrink-0">
          <span className="text-[#8E929C] font-mono text-[11px] pl-1 flex items-center gap-1.5 uppercase font-semibold">
            <Sprout size={13} className="text-[#22C55E]" /> Prior Harvest:
          </span>
          <select
            value={selectedPrevCrop}
            onChange={(e) => setSelectedPrevCrop(e.target.value)}
            className="bg-[#18191E] text-white border border-white/10 rounded-sm px-2.5 py-1 text-xs font-mono font-medium focus:outline-none focus:border-[#22C55E] cursor-pointer"
          >
            {prevCropOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prior Crop Soil Impact Assessment Card */}
      {rotationData && (
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
            <div className="flex items-center space-x-2 text-[10px] font-mono font-semibold text-[#8E929C] uppercase tracking-wider">
              <Layers size={13} className="text-[#22C55E]" strokeWidth={2} />
              <span>Residual Legacy Assessment: Prior Crop ({rotationData.previous_crop.name})</span>
            </div>
            <span className="text-[10px] font-mono text-[#8E929C]">
              FAMILY: {rotationData.previous_crop.crop_family || 'Agronomic Specimen'}
            </span>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed bg-[#202229] p-3.5 rounded-sm border border-white/10 font-sans">
            {rotationData.previous_crop.soil_legacy_assessment}
          </p>

          {/* Agronomic Cautions */}
          {rotationData.agronomic_cautions && rotationData.agronomic_cautions.length > 0 && (
            <div className="mt-3 p-3 bg-[#261E14] border border-[rgba(245,158,11,0.2)] rounded-sm text-xs text-[#FBBF24] flex items-start gap-2.5">
              <AlertTriangle size={15} className="text-[#F59E0B] shrink-0 mt-0.5" strokeWidth={2} />
              <div className="space-y-1">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#F59E0B] block">
                  Agronomic Caution & Risk Vector
                </span>
                <span className="leading-relaxed">{rotationData.agronomic_cautions[0]}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ranked Rotation Alternatives Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h3 className="font-serif font-bold text-sm text-white flex items-center gap-2">
            <CheckCircle2 size={15} className="text-[#22C55E]" strokeWidth={2} />
            <span>Optimal Succession Candidates for Upcoming Season</span>
          </h3>
          <span className="text-[10px] font-mono text-[#8E929C] uppercase">
            Ranked by Biological Complementarity & Water Envelope
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center bg-[#18191E] border border-white/10 rounded-sm text-[#8E929C] font-mono text-xs flex items-center justify-center space-x-2">
            <Activity size={14} className="animate-spin text-[#22C55E]" />
            <span>Computing biological succession matrix...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rotationData?.recommended_rotation_sequence?.map((rec) => (
              <div
                key={rec.crop_id}
                className="bg-[#18191E] border border-white/10 hover:border-[#22C55E] rounded-sm p-4 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs bg-[#202229] text-[#22C55E] border border-white/10">
                      RANK 0{rec.rotation_rank}
                    </span>
                    <span className="text-[10px] text-[#8E929C] font-mono uppercase">
                      {rec.water_fit}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-base text-white mb-1">
                    {rec.name}
                  </h4>
                  <div className="text-[11px] font-mono font-semibold text-[#22C55E] mb-2 uppercase tracking-wide">
                    {rec.strategy}
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {rec.agronomic_benefit}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-[#22C55E] font-mono font-medium flex items-center justify-between">
                  <span>Soil Restitution: Optimal</span>
                  <ArrowRight size={13} strokeWidth={2} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4-Year Strategic Rotation Framework */}
      {rotationData && (
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
            <div className="flex items-center space-x-2 text-[10px] font-mono font-semibold text-[#8E929C] uppercase tracking-wider">
              <Calendar size={13} className="text-[#22C55E]" strokeWidth={2} />
              <span>Multi-Year Agro-Ecological Crop Cycle Framework</span>
            </div>
            <span className="text-[10px] font-mono text-[#8E929C]">4-YEAR STRATEGIC ROTATION</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {rotationData.four_year_ideal_rotation_plan.map((stage, idx) => (
              <div
                key={idx}
                className="bg-[#202229] border border-white/10 rounded-sm p-3.5 flex flex-col justify-between"
              >
                <div className="text-[10px] font-mono font-bold text-[#22C55E] mb-1.5 tracking-wider">
                  YEAR 0{idx + 1} &bull; PHASE {idx + 1}
                </div>
                <div className="text-xs font-semibold text-white leading-snug">
                  {stage}
                </div>
                <div className="mt-3 pt-2 border-t border-white/10/60 text-[10px] font-mono text-[#8E929C]">
                  Status: Scheduled
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scientific Governance Notice */}
      <div className="p-3.5 bg-[#18191E] border border-white/10 rounded-sm text-xs text-[#8E929C] flex items-start gap-2.5">
        <ShieldCheck size={15} className="text-[#22C55E] shrink-0 mt-0.5" strokeWidth={2} />
        <p className="leading-relaxed">
          Succession modeling is evaluated against botanical family pathogen vectors (e.g. Fusarium, Verticillium, Heterodera cyst nematodes)
          and biological nitrogen cycles. Operators should verify regional elevator purchase agreements, crop insurance covenants, and certified seed availability before implementation.
        </p>
      </div>
    </div>
  );
};
