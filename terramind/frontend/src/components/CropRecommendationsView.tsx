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
  Calendar,
  ChevronRight
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
    <div className="max-w-6xl mx-auto space-y-6 anim-fade-up">
      {/* Editorial Header */}
      <div className="border-b border-white/[0.07] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-[#7C9A6B] font-medium tracking-wide mb-1 flex items-center gap-1.5">
            <Sprout size={13} />
            <span>FAO EcoCrop Compatibility &bull; Multi-Attribute Decision Model</span>
          </div>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Crop Planning &amp; Suitability Assessment
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Evaluated for <span className="text-white/90 font-medium">{fieldName}</span> against local hydrothermal and pedological variables.
          </p>
        </div>

        <button
          onClick={() => setShowWeightsConfig(true)}
          className="btn self-start md:self-auto px-3.5 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl text-xs text-white/90 flex items-center gap-2 transition-all cursor-pointer"
        >
          <SlidersHorizontal size={13} className="text-[#7C9A6B]" />
          <span>Configure Weights</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-xs text-white/40 mr-1 flex items-center gap-1 font-medium">
          <Filter size={12} /> Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`btn px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#7C9A6B] text-[#0E0F12] shadow-sm font-semibold'
                : 'bg-white/[0.03] border border-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Structured Crop Ranking Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCrops.map((crop) => {
          const score = crop.overall_score;
          const scoreColor = score >= 70 ? 'text-[#7C9A6B]' : score >= 50 ? 'text-[#D9A84C]' : 'text-[#C47B6A]';
          const scoreBg = score >= 70 ? 'bg-[#7C9A6B]/10 border-[#7C9A6B]/20' : score >= 50 ? 'bg-[#D9A84C]/10 border-[#D9A84C]/20' : 'bg-[#C47B6A]/10 border-[#C47B6A]/20';

          return (
            <div
              key={crop.crop_id}
              onClick={() => setActiveCropModal(crop)}
              className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.07] hover:border-white/[0.16] rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-sm"
            >
              <div>
                {/* Header: Rank, Category, Score */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center space-x-1.5 text-xs text-white/40 font-medium">
                      <span className="font-semibold text-[#7C9A6B]">#{crop.rank}</span>
                      <span>&bull;</span>
                      <span>{crop.category}</span>
                    </div>
                    <h3 className="font-semibold text-base text-white group-hover:text-[#A8C496] transition-colors mt-0.5">
                      {crop.name}
                    </h3>
                    <div className="text-xs text-white/40 italic">
                      {crop.scientific_name}
                    </div>
                  </div>

                  <div className={`px-2.5 py-1 rounded-xl border ${scoreBg} text-right shrink-0`}>
                    <div className={`text-base font-bold ${scoreColor} leading-tight`}>
                      {score}
                    </div>
                    <div className="text-[10px] text-white/40 font-medium">/ 100</div>
                  </div>
                </div>

                {/* Quantitative Metric Badges */}
                <div className="grid grid-cols-4 gap-1.5 py-2.5 my-2.5 border-y border-white/[0.06] text-xs text-center">
                  <div className="bg-white/[0.03] py-1.5 rounded-lg border border-white/[0.04]">
                    <span className="text-white/40 block text-[10px] font-medium">Climate</span>
                    <strong className="text-white/90 font-semibold">{crop.component_scores.climate_temperature}%</strong>
                  </div>
                  <div className="bg-white/[0.03] py-1.5 rounded-lg border border-white/[0.04]">
                    <span className="text-white/40 block text-[10px] font-medium">Water</span>
                    <strong className="text-white/90 font-semibold">{crop.component_scores.water_availability}%</strong>
                  </div>
                  <div className="bg-white/[0.03] py-1.5 rounded-lg border border-white/[0.04]">
                    <span className="text-white/40 block text-[10px] font-medium">Soil</span>
                    <strong className="text-white/90 font-semibold">{crop.component_scores.soil_compatibility}%</strong>
                  </div>
                  <div className="bg-white/[0.03] py-1.5 rounded-lg border border-white/[0.04]">
                    <span className="text-white/40 block text-[10px] font-medium">Safety</span>
                    <strong className="text-white/90 font-semibold">{crop.component_scores.climate_risk_safety}%</strong>
                  </div>
                </div>

                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                  {crop.reasons[0]}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
                <span>Sow window: <strong className="text-white/80 font-medium">{crop.recommended_planting_period}</strong></span>
                <span className="text-[#7C9A6B] font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Details <ChevronRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Crop Technical Dossier Modal */}
      {activeCropModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 anim-fade-in">
          <div className="dark-glass-panel rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative text-xs border border-white/[0.1] anim-scale-in">
            <button
              onClick={() => setActiveCropModal(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="text-xs text-[#7C9A6B] font-medium mb-1">
              Agronomic Evaluation Dossier &bull; Specimen #{activeCropModal.rank}
            </div>

            <div className="flex items-baseline justify-between border-b border-white/[0.08] pb-3 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white tracking-tight">{activeCropModal.name}</h2>
                <div className="text-xs text-white/40 italic">{activeCropModal.scientific_name}</div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-[#7C9A6B]">{activeCropModal.overall_score}</span>
                <span className="text-xs text-white/40 ml-1">/ 100</span>
              </div>
            </div>

            {/* Physiological Requirements Matrix */}
            <div className="bg-white/[0.03] border border-white/[0.06] p-3.5 rounded-xl grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-4">
              <div>
                <span className="text-white/40 block text-[10px] font-medium">Water Demand</span>
                <strong className="text-white/90">{activeCropModal.parameters.water_required_mm}</strong>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] font-medium">Optimal Temp</span>
                <strong className="text-white/90">{activeCropModal.parameters.optimal_temp_c}</strong>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] font-medium">Ideal Soil pH</span>
                <strong className="text-white/90">{activeCropModal.parameters.ideal_ph}</strong>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] font-medium">Growing Cycle</span>
                <strong className="text-white/90">{activeCropModal.parameters.growing_season_days} Days</strong>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] font-medium">Drought Resilience</span>
                <strong className="text-[#7C9A6B]">{activeCropModal.parameters.drought_tolerance}</strong>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] font-medium">Frost Tolerance</span>
                <strong className="text-white/90">{activeCropModal.parameters.frost_tolerance}</strong>
              </div>
            </div>

            {/* Agronomic Justification */}
            <div className="space-y-2 mb-4">
              <span className="text-xs text-white/70 font-semibold block">
                Technical Justification &amp; Match Rationale
              </span>
              <ul className="space-y-1.5">
                {activeCropModal.reasons.map((r, i) => (
                  <li key={i} className="bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.05] text-white/80 leading-relaxed">
                    &bull; {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Factors */}
            <div className="space-y-2 mb-4">
              <span className="text-xs text-white/70 font-semibold block">
                Identified Agronomic Risk Factors
              </span>
              <ul className="space-y-1.5">
                {activeCropModal.identified_risks.map((risk, i) => (
                  <li key={i} className="bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.05] text-white/60 leading-relaxed">
                    &bull; {risk}
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
              <button
                onClick={() => {
                  onSelectCropForCalendar(activeCropModal.crop_id);
                  setActiveCropModal(null);
                }}
                className="btn px-4 py-2 bg-[#7C9A6B] hover:bg-[#6E8A5D] text-[#0E0F12] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Calendar size={14} />
                <span>Open Phenology Matrix</span>
              </button>
              <button
                onClick={() => setActiveCropModal(null)}
                className="btn px-3.5 py-2 border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.05] rounded-xl text-xs transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scoring Weights Drawer */}
      {showWeightsConfig && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 anim-fade-in">
          <div className="dark-glass-panel rounded-2xl max-w-md w-full p-6 shadow-2xl text-xs border border-white/[0.1] anim-scale-in">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3">
              <h3 className="font-semibold text-sm text-white">
                Multi-Attribute Utility Weights
              </h3>
              <button onClick={() => setShowWeightsConfig(false)} className="text-white/50 hover:text-white p-1 rounded-lg cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-white/60 mb-5 leading-relaxed">
              Adjust prioritization weights for thermal compatibility, moisture supply,
              soil constraints, and climate risk safety.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between mb-1.5 font-medium">
                  <span className="text-white/70">Temperature Compatibility:</span>
                  <strong className="text-[#7C9A6B]">{Math.round(tempW * 100)}%</strong>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.6"
                  step="0.05"
                  value={tempW}
                  onChange={(e) => setTempW(parseFloat(e.target.value))}
                  className="w-full accent-[#7C9A6B] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5 font-medium">
                  <span className="text-white/70">Water &amp; Precipitation Fit:</span>
                  <strong className="text-[#7C9A6B]">{Math.round(waterW * 100)}%</strong>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.6"
                  step="0.05"
                  value={waterW}
                  onChange={(e) => setWaterW(parseFloat(e.target.value))}
                  className="w-full accent-[#7C9A6B] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5 font-medium">
                  <span className="text-white/70">Soil Chemistry &amp; Texture:</span>
                  <strong className="text-[#7C9A6B]">{Math.round(soilW * 100)}%</strong>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.6"
                  step="0.05"
                  value={soilW}
                  onChange={(e) => setSoilW(parseFloat(e.target.value))}
                  className="w-full accent-[#7C9A6B] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5 font-medium">
                  <span className="text-white/70">Climate Risk Avoidance:</span>
                  <strong className="text-[#7C9A6B]">{Math.round(riskW * 100)}%</strong>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.6"
                  step="0.05"
                  value={riskW}
                  onChange={(e) => setRiskW(parseFloat(e.target.value))}
                  className="w-full accent-[#7C9A6B] cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-6 pt-3 border-t border-white/[0.08]">
              <button
                onClick={() => {
                  setTempW(0.30);
                  setWaterW(0.30);
                  setSoilW(0.25);
                  setRiskW(0.15);
                }}
                className="btn px-3 py-1.5 text-xs text-white/50 hover:text-white rounded-lg cursor-pointer"
              >
                Reset Default
              </button>
              <button
                onClick={handleApplyWeights}
                className="btn px-4 py-2 bg-[#7C9A6B] hover:bg-[#6E8A5D] text-[#0E0F12] rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Apply Weights
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
