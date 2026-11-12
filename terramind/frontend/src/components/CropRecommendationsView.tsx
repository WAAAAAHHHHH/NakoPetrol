import React, { useState } from 'react';
import { 
  Sprout, 
  SlidersHorizontal, 
  Droplets, 
  Thermometer, 
  Layers, 
  ShieldAlert, 
  Check, 
  X,
  Filter,
  Calendar
} from 'lucide-react';
import { CropRecommendation, ScoringWeights } from '../types/terramind';

interface CropRecommendationsViewProps {
  crops: CropRecommendation[];
  weights: ScoringWeights;
  onUpdateWeights: (newWeights: ScoringWeights) => void;
  onSelectCropForCalendar: (cropId: string) => void;
  fieldName: string;
}

export const CropRecommendationsView: React.FC<CropRecommendationsViewProps> = ({
  crops,
  weights,
  onUpdateWeights,
  onSelectCropForCalendar,
  fieldName
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeCropModal, setActiveCropModal] = useState<CropRecommendation | null>(null);
  const [showWeightsConfig, setShowWeightsConfig] = useState<boolean>(false);

  // Local weight adjustment state
  const [tempW, setTempW] = useState(weights.weight_climate_temp);
  const [waterW, setWaterW] = useState(weights.weight_water);
  const [soilW, setSoilW] = useState(weights.weight_soil);
  const [riskW, setRiskW] = useState(weights.weight_risk);

  const categories = ['All', 'Cereal', 'Legume', 'Oilseed', 'Industrial / Fiber', 'Horticulture'];

  const filteredCrops = selectedCategory === 'All'
    ? crops
    : crops.filter(c => c.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleApplyWeights = () => {
    onUpdateWeights({
      weight_climate_temp: tempW,
      weight_water: waterW,
      weight_soil: soilW,
      weight_risk: riskW
    });
    setShowWeightsConfig(false);
  };

  return (
    <div className="space-y-4">
      {/* Editorial Header */}
      <div className="border-b border-white/10 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#8E929C]">
            Multi-Attribute Decision Model &bull; FAO EcoCrop Envelopes
          </div>
          <h1 className="font-serif text-xl font-bold text-white">
            Crop Planning &amp; Suitability Assessment
          </h1>
          <p className="text-xs text-stone-300 mt-0.5">
            Evaluated for <strong className="text-white">{fieldName}</strong> against local hydrothermal and pedological variables.
          </p>
        </div>

        <button
          onClick={() => setShowWeightsConfig(true)}
          className="self-start md:self-auto px-3 py-1.5 bg-[#18191E] hover:bg-[#202229] border border-white/10 rounded-sm text-xs font-mono text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <SlidersHorizontal size={13} className="text-[#22C55E]" />
          <span>CONFIGURE WEIGHTS</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto text-xs pb-1">
        <span className="text-[11px] font-mono uppercase text-[#8E929C] mr-1 flex items-center gap-1">
          <Filter size={11} /> Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-sm font-mono text-[11px] transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#22C55E] text-[#0E0F12]'
                : 'bg-[#18191E] border border-white/10 text-stone-300 hover:bg-[#202229]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Structured Crop Ranking Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredCrops.map((crop) => {
          const score = crop.overall_score;
          return (
            <div
              key={crop.crop_id}
              onClick={() => setActiveCropModal(crop)}
              className="bg-[#18191E] border border-white/10 hover:border-[#22C55E] rounded-sm p-3.5 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Header: Rank, Category, Score */}
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <div className="flex items-center space-x-1.5 text-[10px] font-mono text-[#8E929C]">
                      <span className="font-bold text-[#22C55E]">#{crop.rank}</span>
                      <span>&bull;</span>
                      <span className="uppercase">{crop.category}</span>
                    </div>
                    <h3 className="font-serif font-bold text-sm text-white group-hover:text-[#22C55E] transition-colors">
                      {crop.name}
                    </h3>
                    <div className="text-[10px] text-[#8E929C] italic font-serif">
                      {crop.scientific_name}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-base font-bold text-[#22C55E] leading-tight">
                      {score}
                    </div>
                    <div className="text-[9px] font-mono text-[#8E929C]">/ 100 PTS</div>
                  </div>
                </div>

                {/* Quantitative Metric Badges */}
                <div className="grid grid-cols-4 gap-1.5 py-2 my-2 border-y border-white/10 text-[10px] font-mono text-center">
                  <div className="bg-[#202229] py-1 rounded-xs">
                    <span className="text-[#8E929C] block text-[8px]">CLIMATE</span>
                    <strong className="text-white">{crop.component_scores.climate_temperature}%</strong>
                  </div>
                  <div className="bg-[#202229] py-1 rounded-xs">
                    <span className="text-[#8E929C] block text-[8px]">WATER</span>
                    <strong className="text-white">{crop.component_scores.water_availability}%</strong>
                  </div>
                  <div className="bg-[#202229] py-1 rounded-xs">
                    <span className="text-[#8E929C] block text-[8px]">SOIL</span>
                    <strong className="text-white">{crop.component_scores.soil_compatibility}%</strong>
                  </div>
                  <div className="bg-[#202229] py-1 rounded-xs">
                    <span className="text-[#8E929C] block text-[8px]">RISK</span>
                    <strong className="text-white">{crop.component_scores.climate_risk_safety}%</strong>
                  </div>
                </div>

                <p className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed">
                  {crop.reasons[0]}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#8E929C]">
                <span>SOW: <strong className="text-white">{crop.recommended_planting_period}</strong></span>
                <span className="text-[#22C55E] font-semibold group-hover:underline">
                  DOSSIER &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Crop Technical Dossier Modal */}
      {activeCropModal && (
        <div className="fixed inset-0 z-50 bg-[#FFFFFF]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#18191E] border border-white/10 rounded-sm max-w-xl w-full max-h-[85vh] overflow-y-auto p-5 shadow-xl relative text-xs">
            <button
              onClick={() => setActiveCropModal(null)}
              className="absolute top-4 right-4 text-[#8E929C] hover:text-white p-1 cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="text-[10px] font-mono uppercase text-[#8E929C] mb-1">
              Agronomic Evaluation Dossier &bull; Specimen #{activeCropModal.rank}
            </div>

            <div className="flex items-baseline justify-between border-b border-white/10 pb-3 mb-4">
              <div>
                <h2 className="font-serif font-bold text-xl text-white">{activeCropModal.name}</h2>
                <div className="text-xs text-[#8E929C] italic font-serif">{activeCropModal.scientific_name}</div>
              </div>
              <div className="font-mono text-xl font-bold text-[#22C55E]">
                {activeCropModal.overall_score} <span className="text-xs text-[#8E929C]">/ 100</span>
              </div>
            </div>

            {/* Physiological Requirements Matrix */}
            <div className="bg-[#202229] border border-white/10 p-3 rounded-xs grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] mb-4">
              <div>
                <span className="text-[#8E929C] block text-[9px]">WATER DEMAND:</span>
                <strong className="text-white">{activeCropModal.parameters.water_required_mm}</strong>
              </div>
              <div>
                <span className="text-[#8E929C] block text-[9px]">OPTIMAL TEMP:</span>
                <strong className="text-white">{activeCropModal.parameters.optimal_temp_c}</strong>
              </div>
              <div>
                <span className="text-[#8E929C] block text-[9px]">IDEAL SOIL PH:</span>
                <strong className="text-white">{activeCropModal.parameters.ideal_ph}</strong>
              </div>
              <div>
                <span className="text-[#8E929C] block text-[9px]">GROWING CYCLE:</span>
                <strong className="text-white">{activeCropModal.parameters.growing_season_days} Days</strong>
              </div>
              <div>
                <span className="text-[#8E929C] block text-[9px]">DROUGHT RESILIENCE:</span>
                <strong className="text-[#22C55E]">{activeCropModal.parameters.drought_tolerance}</strong>
              </div>
              <div>
                <span className="text-[#8E929C] block text-[9px]">FROST TOLERANCE:</span>
                <strong className="text-white">{activeCropModal.parameters.frost_tolerance}</strong>
              </div>
            </div>

            {/* Agronomic Justification */}
            <div className="space-y-2 mb-4">
              <span className="text-[10px] font-mono uppercase text-[#8E929C] font-semibold block">
                Technical Justification &amp; Match Rationale
              </span>
              <ul className="space-y-1.5">
                {activeCropModal.reasons.map((r, i) => (
                  <li key={i} className="bg-[#0E0F12] p-2 border border-white/10 text-white leading-relaxed">
                    &bull; {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Factors */}
            <div className="space-y-2 mb-4">
              <span className="text-[10px] font-mono uppercase text-[#8E929C] font-semibold block">
                Identified Agronomic Risk Factors
              </span>
              <ul className="space-y-1.5">
                {activeCropModal.identified_risks.map((risk, i) => (
                  <li key={i} className="bg-[#0E0F12] p-2 border border-white/10 text-stone-300 leading-relaxed">
                    &bull; {risk}
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  onSelectCropForCalendar(activeCropModal.crop_id);
                  setActiveCropModal(null);
                }}
                className="px-3 py-1.5 bg-[#22C55E] hover:bg-[#15803D] text-[#0E0F12] rounded-sm font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Calendar size={13} />
                <span>OPEN PHENOLOGY MATRIX</span>
              </button>
              <button
                onClick={() => setActiveCropModal(null)}
                className="px-3 py-1.5 border border-white/10 text-stone-300 hover:bg-[#202229] rounded-sm font-mono text-[11px] cursor-pointer"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scoring Weights Drawer */}
      {showWeightsConfig && (
        <div className="fixed inset-0 z-50 bg-[#FFFFFF]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#18191E] border border-white/10 rounded-sm max-w-md w-full p-5 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <h3 className="font-serif font-bold text-sm text-white">
                Multi-Attribute Utility Weights
              </h3>
              <button onClick={() => setShowWeightsConfig(false)} className="text-[#8E929C] hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <p className="text-[11px] text-stone-300 mb-4 leading-relaxed">
              Adjust prioritization weights for thermal compatibility, moisture supply,
              soil constraints, and climate risk safety.
            </p>

            <div className="space-y-3 font-mono text-[11px]">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Temperature Compatibility:</span>
                  <strong className="text-[#22C55E]">{Math.round(tempW * 100)}%</strong>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.6"
                  step="0.05"
                  value={tempW}
                  onChange={(e) => setTempW(parseFloat(e.target.value))}
                  className="w-full accent-[#22C55E] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Water &amp; Precipitation Fit:</span>
                  <strong className="text-[#22C55E]">{Math.round(waterW * 100)}%</strong>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.6"
                  step="0.05"
                  value={waterW}
                  onChange={(e) => setWaterW(parseFloat(e.target.value))}
                  className="w-full accent-[#22C55E] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Soil Chemistry &amp; Texture:</span>
                  <strong className="text-[#22C55E]">{Math.round(soilW * 100)}%</strong>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.6"
                  step="0.05"
                  value={soilW}
                  onChange={(e) => setSoilW(parseFloat(e.target.value))}
                  className="w-full accent-[#22C55E] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Climate Risk Avoidance:</span>
                  <strong className="text-[#22C55E]">{Math.round(riskW * 100)}%</strong>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.6"
                  step="0.05"
                  value={riskW}
                  onChange={(e) => setRiskW(parseFloat(e.target.value))}
                  className="w-full accent-[#22C55E] cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-5 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  setTempW(0.30);
                  setWaterW(0.30);
                  setSoilW(0.25);
                  setRiskW(0.15);
                }}
                className="px-3 py-1 text-[11px] font-mono text-[#8E929C] hover:text-white cursor-pointer"
              >
                DEFAULT
              </button>
              <button
                onClick={handleApplyWeights}
                className="px-3 py-1.5 bg-[#22C55E] hover:bg-[#15803D] text-[#0E0F12] rounded-sm font-mono text-[11px] transition-colors cursor-pointer"
              >
                APPLY WEIGHTS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
