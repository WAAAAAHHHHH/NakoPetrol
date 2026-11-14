import React from 'react';
import { 
  Layers, 
  FlaskConical, 
  AlertCircle, 
  Check, 
  ShieldCheck,
  Droplet
} from 'lucide-react';
import { SoilData } from '../types/terramind';

interface SoilIntelligenceViewProps {
  soil: SoilData | null;
  fieldName: string;
}

export const SoilIntelligenceView: React.FC<SoilIntelligenceViewProps> = ({
  soil,
  fieldName
}) => {
  if (!soil) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-white/40 text-xs">
        <div className="w-6 h-6 border-2 border-white/10 border-t-[#7C9A6B] rounded-full animate-spin mb-3" />
        <span>Retrieving SoilGrids 250m pedological horizons...</span>
      </div>
    );
  }

  const props = soil.properties;
  const evalData = soil.agronomic_evaluation;

  return (
    <div className="max-w-6xl mx-auto space-y-6 anim-fade-up">
      {/* Header */}
      <div className="border-b border-white/[0.07] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-[#7C9A6B] font-medium tracking-wide mb-1 flex items-center gap-1.5">
            <Layers size={13} />
            <span>ISRIC SoilGrids 2.0 &bull; Pedological Horizons &amp; Core Analysis</span>
          </div>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Soil Analysis &amp; Textural Classification
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Depth-stratified physical and chemical profile for <span className="text-white/90 font-medium">{fieldName}</span>.
          </p>
        </div>

        <div className="text-xs text-[#A8C496] bg-[#7C9A6B]/10 border border-[#7C9A6B]/20 px-3.5 py-1.5 rounded-xl font-medium">
          WRB Taxonomy: <strong className="text-white font-semibold">{props.soil_type_wrb}</strong>
        </div>
      </div>

      {/* 4 Quantitative Metric Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* pH Reaction Card */}
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between text-xs text-white/40 font-medium mb-1.5">
              <span>Reaction (pH H2O)</span>
              <span className="font-semibold text-[#7C9A6B]">
                {props.ph_h2o > 7.5 ? 'Alkaline' : props.ph_h2o < 6.0 ? 'Acidic' : 'Neutral'}
              </span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {props.ph_h2o}
            </div>

            {/* pH Linear Scale */}
            <div className="mt-3">
              <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden flex">
                <div className="w-1/3 bg-white/20" />
                <div className="w-1/3 bg-[#7C9A6B]" />
                <div className="w-1/3 bg-[#D9A84C]" />
              </div>
              <div className="flex justify-between text-[10px] text-white/40 mt-1.5 font-medium">
                <span>4.5 Acid</span>
                <span>6.5 Neutral</span>
                <span>8.5 Alk</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-white/50 mt-3 pt-2.5 border-t border-white/[0.06]">
            {props.ph_h2o > 7.6 ? 'Zinc & phosphorus fixation tendency' : 'Optimal micro-nutrient bioavailability'}
          </div>
        </div>

        {/* USDA Texture */}
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-xs text-white/40 font-medium mb-1.5">
              USDA Textural Class
            </div>
            <div className="font-semibold text-lg text-white">
              {props.usda_texture}
            </div>

            <div className="mt-2.5 space-y-1.5 text-xs text-white/70">
              <div className="flex justify-between">
                <span className="text-white/40">Clay (&lt;0.002mm):</span>
                <strong className="text-white">{props.clay_pct}%</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Silt (0.002-0.05mm):</span>
                <strong className="text-white">{props.silt_pct}%</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Sand (0.05-2.0mm):</span>
                <strong className="text-white">{props.sand_pct}%</strong>
              </div>
            </div>
          </div>
          <div className="text-xs text-white/50 mt-3 pt-2.5 border-t border-white/[0.06]">
            Drainage: <strong className="text-white/80 font-medium">{props.drainage_class}</strong>
          </div>
        </div>

        {/* Organic Carbon (SOC) */}
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-xs text-white/40 font-medium mb-1.5">
              Organic Carbon (0-30cm)
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {props.soc_g_kg} <span className="text-xs font-normal text-white/40">g/kg</span>
            </div>
            <div className="text-xs text-[#7C9A6B] font-medium mt-1">
              ~{props.soc_percentage}% Organic Matter
            </div>
            <p className="text-xs text-white/60 mt-2 leading-relaxed">
              {props.soc_g_kg < 12 
                ? 'Sub-optimal humus levels; conservation tillage advised.' 
                : 'Favorable biological structural aggregate stability.'}
            </p>
          </div>
          <div className="text-xs text-white/50 mt-3 pt-2.5 border-t border-white/[0.06]">
            Bulk Density: <strong className="text-white/80 font-medium">{props.bulk_density_g_cm3} g/cm³</strong>
          </div>
        </div>

        {/* CEC and Salinity */}
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-xs text-white/40 font-medium mb-1.5">
              Cation Exchange Capacity
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {props.cec_cmolc_kg} <span className="text-xs font-normal text-white/40">cmol/kg</span>
            </div>
            <div className="text-xs text-[#7C9A6B] font-medium mt-1">
              {props.cec_cmolc_kg > 25 ? 'High Nutrient Buffer' : 'Moderate Nutrient Buffer'}
            </div>
            <div className="mt-2 text-xs text-white/70">
              Electrical Cond: <strong className="text-white">{props.salinity_ec_ds_m} dS/m</strong>
            </div>
          </div>
          <div className="text-xs text-white/50 mt-3 pt-2.5 border-t border-white/[0.06]">
            Leaching Risk: <strong className="text-[#7C9A6B] font-medium">Low (Retentive Soil)</strong>
          </div>
        </div>
      </div>

      {/* Depth-Stratified Horizons Table */}
      <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
          <span className="text-xs font-semibold text-white/80">
            Depth-Resolved Stratification Matrix (ISRIC Standard Horizons)
          </span>
          <span className="text-xs text-white/40">Units: pH, %, g/kg</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-white/[0.02] text-white/40 uppercase text-[10px] font-medium tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="py-2.5 px-5">Depth</th>
                <th className="py-2.5 px-5">Tier</th>
                <th className="py-2.5 px-5">pH (H2O)</th>
                <th className="py-2.5 px-5">Clay %</th>
                <th className="py-2.5 px-5">SOC (g/kg)</th>
                <th className="py-2.5 px-5">Agronomic Function</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-white/90">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-5 font-semibold text-[#7C9A6B]">0 - 5 cm</td>
                <td className="py-3 px-5 font-medium">Seedbed Surface Horizon</td>
                <td className="py-3 px-5">{props.depth_intervals["0-5cm"]?.ph || props.ph_h2o}</td>
                <td className="py-3 px-5">{props.depth_intervals["0-5cm"]?.clay || props.clay_pct}%</td>
                <td className="py-3 px-5">{props.depth_intervals["0-5cm"]?.soc || props.soc_g_kg}</td>
                <td className="py-3 px-5 text-white/60">Direct contact layer for germination and early rootlet emergence.</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-5 font-semibold text-[#7C9A6B]">5 - 15 cm</td>
                <td className="py-3 px-5 font-medium">Crown &amp; Tillage Root Zone</td>
                <td className="py-3 px-5">{props.depth_intervals["5-15cm"]?.ph || props.ph_h2o}</td>
                <td className="py-3 px-5">{props.depth_intervals["5-15cm"]?.clay || props.clay_pct}%</td>
                <td className="py-3 px-5">{props.depth_intervals["5-15cm"]?.soc || props.soc_g_kg}</td>
                <td className="py-3 px-5 text-white/60">Primary uptake zone for nitrogen and phosphorus fertilizer bands.</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-5 font-semibold text-[#7C9A6B]">15 - 30 cm</td>
                <td className="py-3 px-5 font-medium">Subsoil Moisture Store</td>
                <td className="py-3 px-5">{props.depth_intervals["15-30cm"]?.ph || props.ph_h2o}</td>
                <td className="py-3 px-5">{props.depth_intervals["15-30cm"]?.clay || props.clay_pct}%</td>
                <td className="py-3 px-5">{props.depth_intervals["15-30cm"]?.soc || props.soc_g_kg}</td>
                <td className="py-3 px-5 text-white/60">Capillary moisture reserve tapped during grain anthesis.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytical Diagnostic Observations & Testing Caveat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Findings */}
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 space-y-3">
          <span className="text-xs font-semibold text-white/80 block">
            Pedological Diagnostic Observations
          </span>
          <ul className="space-y-2 text-xs text-white/80">
            {evalData.key_findings.map((f, i) => (
              <li key={i} className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] leading-relaxed">
                &bull; {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Limitations */}
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-white/80 block">
              Methodological Limitations &amp; Lab Coring Guidance
            </span>
            <p className="text-xs text-white/60 leading-relaxed mt-2">
              {soil.metadata.disclaimer}
            </p>
          </div>
          <div className="p-3 bg-[#7C9A6B]/10 border border-[#7C9A6B]/20 rounded-xl text-xs text-[#A8C496]">
            <strong>Recommendation:</strong> {evalData.fertility_guidance}
          </div>
        </div>
      </div>
    </div>
  );
};
