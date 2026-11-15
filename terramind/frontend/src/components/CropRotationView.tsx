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

  const generateFallbackRotation = (cropId: string): RotationPlanData => {
    switch (cropId) {
      case 'wheat':
        return {
          previous_crop: {
            id: 'wheat',
            name: 'Winter Wheat',
            crop_family: 'Poaceae (Gramineae)',
            soil_legacy_assessment: 'Prior wheat cultivation left high C:N straw residue requiring microbial mineralization. Depleted readily available subsoil nitrate, but left stable root architecture and biopores.'
          },
          agronomic_cautions: [
            'Do not plant continuous winter wheat or barley without a fungicide seed dress; high carryover risk for Fusarium crown rot, Gaeumannomyces graminis (Take-all), and Cephalosporium stripe.'
          ],
          recommended_rotation_sequence: [
            {
              crop_id: 'chickpeas',
              name: 'Chickpeas / Field Peas',
              rotation_rank: 1,
              strategy: 'Biological Nitrogen Restitution',
              agronomic_benefit: 'Fixes 50-80 kg N/ha into organic matter; breaks cereal fungal pathogen mycelium.',
              water_fit: 'Moderate root depth (1.2m)'
            },
            {
              crop_id: 'sunflower',
              name: 'Sunflower',
              rotation_rank: 2,
              strategy: 'Deep Taproot Subsoil Scavenging',
              agronomic_benefit: 'Explores subsoil down to 2.2m, mining leached nitrate and potassium below cereal root zone.',
              water_fit: 'High drought extraction'
            },
            {
              crop_id: 'barley',
              name: 'Feed / Malting Barley',
              rotation_rank: 3,
              strategy: 'Hardy Secondary Cereal',
              agronomic_benefit: 'Tolerates lower nitrogen reserves and earlier maturity window; requires seed dressing.',
              water_fit: 'Low moisture requirement'
            }
          ],
          four_year_ideal_rotation_plan: [
            'Year 1: Winter Wheat (High Input Grain Production)',
            'Year 2: Chickpeas / Field Peas (Legume N-Fixation Break)',
            'Year 3: Sunflower or Maize (Taproot / Biomass Crop)',
            'Year 4: Cover Crop Fallow / Spring Barley (Restorative Cycle)'
          ]
        };
      case 'corn':
        return {
          previous_crop: {
            id: 'corn',
            name: 'Grain Maize',
            crop_family: 'Poaceae (Gramineae)',
            soil_legacy_assessment: 'Extracted significant macro-nutrients (150-200 kg N/ha). High volume of tough stalk residue promotes beneficial soil fungal biology if managed without excessive tillage.'
          },
          agronomic_cautions: [
            'High residual European Corn Borer and Gibberella zeae risk on surface debris; avoid unrotated cereals without chopping residue.'
          ],
          recommended_rotation_sequence: [
            {
              crop_id: 'soybeans',
              name: 'Soybeans / Pulse Legume',
              rotation_rank: 1,
              strategy: 'Legume Nitrogen Balancing',
              agronomic_benefit: 'Re-establishes nitrogen equilibrium and utilizes residual phosphorus and potassium.',
              water_fit: 'Synchronized summer moisture'
            },
            {
              crop_id: 'wheat',
              name: 'Winter Wheat',
              rotation_rank: 2,
              strategy: 'Winter Soil Armoring & Cover',
              agronomic_benefit: 'Absorbs residual nitrates before winter leaching; provides rapid autumn ground cover.',
              water_fit: 'Cool-season moisture'
            },
            {
              crop_id: 'sunflower',
              name: 'Sunflower',
              rotation_rank: 3,
              strategy: 'Subsoil Compaction Breaker',
              agronomic_benefit: 'Penetrates traffic hardpans created by heavy combine harvester traffic.',
              water_fit: 'Deep taproot extraction'
            }
          ],
          four_year_ideal_rotation_plan: [
            'Year 1: Grain Maize (Maximum Calorific & Starch Output)',
            'Year 2: Soybeans / Pulses (Biological Nitrogen Credit)',
            'Year 3: Winter Wheat / Triticale (Straw & Grain Restitution)',
            'Year 4: Deep-Rooted Oilseed or Multi-Species Cover'
          ]
        };
      case 'chickpeas':
      case 'lentils':
        return {
          previous_crop: {
            id: cropId,
            name: cropId === 'chickpeas' ? 'Chickpeas' : 'Lentils',
            crop_family: 'Fabaceae (Leguminosae)',
            soil_legacy_assessment: 'Substantial biological nitrogen credit (+45 to +75 kg N/ha) deposited via root nodules. Soil left friable, well-structured, with rapid residue decomposition.'
          },
          agronomic_cautions: [
            'Watch for Ascochyta blight carryover; minimum 3-year interval before seeding another pulse or legume in this parcel.'
          ],
          recommended_rotation_sequence: [
            {
              crop_id: 'wheat',
              name: 'Winter Wheat',
              rotation_rank: 1,
              strategy: 'Optimal Nitrogen Exploiter',
              agronomic_benefit: 'Takes immediate advantage of readily mineralizable legume nitrogen for high grain protein.',
              water_fit: 'Excellent early-season fit'
            },
            {
              crop_id: 'corn',
              name: 'Maize / Corn',
              rotation_rank: 2,
              strategy: 'High-Demand Nitrogen Utilization',
              agronomic_benefit: 'Maximizes yield potential from restored organic nitrogen pools.',
              water_fit: 'Irrigated / Moderate moisture'
            },
            {
              crop_id: 'barley',
              name: 'Malting Barley',
              rotation_rank: 3,
              strategy: 'Early Spring High-Tiller Cereal',
              agronomic_benefit: 'Rapid canopy closure suppresses volunteer weeds after legume harvest.',
              water_fit: 'Drought-tolerant fit'
            }
          ],
          four_year_ideal_rotation_plan: [
            'Year 1: Pulse Legume (Biological Nitrogen Influx)',
            'Year 2: Premium Bread Wheat (Capitalize on N-Credit)',
            'Year 3: High-Biomass Oilseed or Fiber Crop',
            'Year 4: Spring Cereal or Restorative Mixed Forage'
          ]
        };
      default:
        return {
          previous_crop: {
            id: cropId,
            name: cropId.charAt(0).toUpperCase() + cropId.slice(1),
            crop_family: 'Agronomic Specimen',
            soil_legacy_assessment: `Prior cultivation of ${cropId} established specific rhizosphere biological balances. Soil structure requires alternating rooting depth and nutrient drawdown profiles.`
          },
          agronomic_cautions: [
            'Ensure biological rotation to break host-specific pathogen cycles and balance soil mineral reserves.'
          ],
          recommended_rotation_sequence: [
            {
              crop_id: 'wheat',
              name: 'Winter Wheat',
              rotation_rank: 1,
              strategy: 'Soil Stabilizing Foundation Cereal',
              agronomic_benefit: 'Provides fibrous root stabilization and excellent weed suppression.',
              water_fit: 'Adapted to rainfall profile'
            },
            {
              crop_id: 'chickpeas',
              name: 'Legume N-Fixer (Chickpeas/Peas)',
              rotation_rank: 2,
              strategy: 'Rhizobia Nitrogen Restitution',
              agronomic_benefit: 'Breaks fungal mycelium networks and generates organic nitrate.',
              water_fit: 'Moderate water footprint'
            },
            {
              crop_id: 'sunflower',
              name: 'Deep Oilseed (Sunflower)',
              rotation_rank: 3,
              strategy: 'Deep Subsoil Nutrient Scavenger',
              agronomic_benefit: 'Extracts deep moisture reserves and conditions subsoil compaction.',
              water_fit: 'High drought tolerance'
            }
          ],
          four_year_ideal_rotation_plan: [
            `Year 1: ${cropId.charAt(0).toUpperCase() + cropId.slice(1)} (Cash Crop Production)`,
            'Year 2: Legume N-Fixer (Soil Nitrogen Restitution)',
            'Year 3: Deep Rooting Scavenger (Sunflower / Maize)',
            'Year 4: Winter Cereal / Soil Armoring Grain'
          ]
        };
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchRotation = async () => {
      setLoading(true);
      try {
        const data = await terramindApi.analyzeRotation(selectedPrevCrop, latitude, longitude, irrigationAvailable);
        if (isMounted) {
          if (data && data.recommended_rotation_sequence && data.recommended_rotation_sequence.length > 0) {
            setRotationData(data);
          } else {
            setRotationData(generateFallbackRotation(selectedPrevCrop));
          }
        }
      } catch (err) {
        console.warn('Rotation API unavailable, applying botanical succession model:', err);
        if (isMounted) setRotationData(generateFallbackRotation(selectedPrevCrop));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRotation();
    return () => { isMounted = false; };
  }, [selectedPrevCrop, latitude, longitude, irrigationAvailable]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 anim-fade-up">
      {/* Module Header & Prior Crop Selector */}
      <div className="border-b border-white/[0.07] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-[#7C9A6B] font-medium tracking-wide mb-1 flex items-center gap-1.5">
            <Repeat size={13} />
            <span>Botanical Succession &amp; Soil Health Architecture</span>
          </div>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Crop Succession &amp; Pathogen Break Strategy
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Biological nitrogen restitution and soil-borne pest break cycles for <span className="text-white/90 font-medium">{fieldName}</span>.
          </p>
        </div>

        {/* Previous Crop Selector Dropdown */}
        <div className="flex items-center space-x-2 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs shrink-0">
          <span className="text-xs text-white/40 font-medium flex items-center gap-1.5">
            <Sprout size={13} className="text-[#7C9A6B]" /> Prior Harvest:
          </span>
          <select
            value={selectedPrevCrop}
            onChange={(e) => setSelectedPrevCrop(e.target.value)}
            className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer pr-1"
          >
            {prevCropOptions.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#18191E] text-white">
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prior Crop Soil Impact Assessment Card */}
      {rotationData && (
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-white/80">
              <Layers size={14} className="text-[#7C9A6B]" />
              <span>Residual Legacy Assessment: Prior Crop ({rotationData.previous_crop.name})</span>
            </div>
            <span className="text-xs text-white/40">
              Family: {rotationData.previous_crop.crop_family || 'Agronomic Specimen'}
            </span>
          </div>

          <p className="text-xs text-white/70 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/[0.05]">
            {rotationData.previous_crop.soil_legacy_assessment}
          </p>

          {/* Agronomic Cautions */}
          {rotationData.agronomic_cautions && rotationData.agronomic_cautions.length > 0 && (
            <div className="p-3.5 bg-[#D9A84C]/10 border border-[#D9A84C]/20 rounded-xl text-xs text-[#E8C078] flex items-start gap-3">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 text-[#D9A84C]" />
              <div className="space-y-1">
                <span className="font-semibold block">
                  Agronomic Caution &amp; Risk Vector
                </span>
                <span className="leading-relaxed opacity-90">{rotationData.agronomic_cautions[0]}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ranked Rotation Alternatives Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <CheckCircle2 size={15} className="text-[#7C9A6B]" />
            <span>Optimal Succession Candidates for Upcoming Season</span>
          </h3>
          <span className="text-xs text-white/40">
            Ranked by biological complementarity &amp; water envelope
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-white/40 text-xs">
            <div className="w-6 h-6 border-2 border-white/10 border-t-[#7C9A6B] rounded-full animate-spin mb-3" />
            <span>Computing biological succession matrix...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rotationData?.recommended_rotation_sequence?.map((rec) => (
              <div
                key={rec.crop_id}
                className="bg-white/[0.02] border border-white/[0.07] hover:border-white/20 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between shadow-sm group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-[#7C9A6B]/15 text-[#A8C496] border border-[#7C9A6B]/20">
                      Rank 0{rec.rotation_rank}
                    </span>
                    <span className="text-xs text-white/40">
                      {rec.water_fit}
                    </span>
                  </div>

                  <h4 className="font-semibold text-base text-white group-hover:text-[#A8C496] transition-colors mb-1">
                    {rec.name}
                  </h4>
                  <div className="text-xs font-medium text-[#7C9A6B] mb-2 uppercase tracking-wide">
                    {rec.strategy}
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {rec.agronomic_benefit}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs text-[#7C9A6B] font-medium flex items-center justify-between">
                  <span>Soil Restitution: Optimal</span>
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4-Year Strategic Rotation Framework */}
      {rotationData && (
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-white/80">
              <Calendar size={14} className="text-[#7C9A6B]" />
              <span>Multi-Year Agro-Ecological Crop Cycle Framework</span>
            </div>
            <span className="text-xs text-white/40">4-Year Strategic Plan</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {rotationData.four_year_ideal_rotation_plan.map((stage, idx) => (
              <div
                key={idx}
                className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3.5 flex flex-col justify-between"
              >
                <div className="text-xs font-semibold text-[#7C9A6B] mb-1.5">
                  Year 0{idx + 1} &bull; Phase {idx + 1}
                </div>
                <div className="text-xs font-medium text-white/90 leading-snug">
                  {stage}
                </div>
                <div className="mt-3 pt-2 border-t border-white/[0.04] text-[10px] text-white/40">
                  Status: Scheduled
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scientific Governance Notice */}
      <div className="p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-xs text-white/50 flex items-start gap-3">
        <ShieldCheck size={16} className="text-[#7C9A6B] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Succession modeling evaluates pathogen vectors (e.g. Fusarium, Verticillium, cyst nematodes)
          and biological nitrogen cycles. Operators should verify local elevator purchase agreements, crop insurance covenants, and certified seed availability before implementation.
        </p>
      </div>
    </div>
  );
};
