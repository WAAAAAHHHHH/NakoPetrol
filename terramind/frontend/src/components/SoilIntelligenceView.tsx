import React from 'react';
import { 
  Layers, 
  FlaskConical, 
  AlertCircle, 
  Check, 
  ShieldCheck 
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
      <div className="p-8 text-center text-[#8E929C] font-mono text-xs">
        RETRIEVING SOILGRID 250M HORIZONS...
      </div>
    );
  }

  const props = soil.properties;
  const evalData = soil.agronomic_evaluation;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-white/10 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#8E929C]">
            ISRIC SoilGrids 2.0 &bull; Pedological Horizons
          </div>
          <h1 className="font-serif text-xl font-bold text-white">
            Soil Analysis &amp; Textural Classification
          </h1>
          <p className="text-xs text-stone-300 mt-0.5">
            Depth-stratified physical and chemical profile for <strong className="text-white">{fieldName}</strong>.
          </p>
        </div>

        <div className="font-mono text-xs text-[#22C55E] bg-[#18191E] border border-white/10 px-3 py-1.5 rounded-sm">
          WRB TAXONOMY: <strong>{props.soil_type_wrb}</strong>
        </div>
      </div>

      {/* 4 Quantitative Metric Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* pH Reaction Card */}
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between text-[10px] font-mono uppercase text-[#8E929C] mb-1">
              <span>Reaction (pH H2O)</span>
              <span className="font-bold text-[#22C55E]">
                {props.ph_h2o > 7.5 ? 'ALKALINE' : props.ph_h2o < 6.0 ? 'ACIDIC' : 'NEUTRAL'}
              </span>
            </div>
            <div className="font-mono text-2xl font-bold text-white mt-0.5">
              {props.ph_h2o}
            </div>

            {/* pH Linear Scale */}
            <div className="mt-2.5">
              <div className="h-1.5 w-full bg-[rgba(255,255,255,0.1)] rounded-xs overflow-hidden flex">
                <div className="w-1/3 bg-[#8E929C]" />
                <div className="w-1/3 bg-[#22C55E]" />
                <div className="w-1/3 bg-[#A6B58A]" />
              </div>
              <div className="flex justify-between text-[8px] font-mono text-[#8E929C] mt-1">
                <span>4.5 ACID</span>
                <span>6.5 NEUTRAL</span>
                <span>8.5 ALK</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-[#8E929C] mt-3 pt-2 border-t border-white/10">
            {props.ph_h2o > 7.6 ? 'Zinc/Phosphorus fixation tendency' : 'Optimal micro-nutrient availability'}
          </div>
        </div>

        {/* USDA Texture */}
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-3.5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase text-[#8E929C] mb-1">
              USDA Textural Class
            </div>
            <div className="font-serif font-bold text-base text-white mt-0.5">
              {props.usda_texture}
            </div>

            <div className="mt-2.5 space-y-1 font-mono text-[10px] text-stone-300">
              <div className="flex justify-between">
                <span>Clay (&lt;0.002mm):</span>
                <strong className="text-white">{props.clay_pct}%</strong>
              </div>
              <div className="flex justify-between">
                <span>Silt (0.002-0.05mm):</span>
                <strong className="text-white">{props.silt_pct}%</strong>
              </div>
              <div className="flex justify-between">
                <span>Sand (0.05-2.0mm):</span>
                <strong className="text-white">{props.sand_pct}%</strong>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-[#8E929C] mt-3 pt-2 border-t border-white/10">
            Drainage: <strong className="text-white">{props.drainage_class}</strong>
          </div>
        </div>

        {/* Organic Carbon (SOC) */}
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-3.5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase text-[#8E929C] mb-1">
              Organic Carbon (0-30cm)
            </div>
            <div className="font-mono text-2xl font-bold text-white mt-0.5">
              {props.soc_g_kg} <span className="text-xs font-normal text-[#8E929C]">g/kg</span>
            </div>
            <div className="text-[11px] font-mono text-[#22C55E] font-semibold mt-0.5">
              ~{props.soc_percentage}% Organic Matter
            </div>
            <p className="text-[11px] text-stone-300 mt-1.5 leading-relaxed">
              {props.soc_g_kg < 12 
                ? 'Sub-optimal humus levels; conservation tillage advised.' 
                : 'Favorable biological structural aggregate stability.'}
            </p>
          </div>
          <div className="text-[10px] text-[#8E929C] mt-3 pt-2 border-t border-white/10">
            Bulk Density: <strong className="text-white font-mono">{props.bulk_density_g_cm3} g/cm³</strong>
          </div>
        </div>

        {/* CEC and Salinity */}
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-3.5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase text-[#8E929C] mb-1">
              Cation Exchange Capacity
            </div>
            <div className="font-mono text-2xl font-bold text-white mt-0.5">
              {props.cec_cmolc_kg} <span className="text-xs font-normal text-[#8E929C]">cmol/kg</span>
            </div>
            <div className="text-[11px] font-mono text-[#22C55E] font-semibold mt-0.5">
              {props.cec_cmolc_kg > 25 ? 'High Nutrient Buffer' : 'Moderate Nutrient Buffer'}
            </div>
            <div className="mt-2 text-[11px] font-mono text-stone-300">
              Electrical Cond. (ECe): <strong className="text-white">{props.salinity_ec_ds_m} dS/m</strong>
            </div>
          </div>
          <div className="text-[10px] text-[#8E929C] mt-3 pt-2 border-t border-white/10">
            Leaching Risk: <strong className="text-[#22C55E]">LOW (Retentive Clay-Loam)</strong>
          </div>
        </div>
      </div>

      {/* Depth-Stratified Horizons Table */}
      <div className="bg-[#18191E] border border-white/10 rounded-sm overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E929C] font-semibold">
            Depth-Resolved Stratification Matrix (ISRIC Standard Horizons)
          </span>
          <span className="text-[10px] font-mono text-[#8E929C]">UNITS: pH, %, g/kg</span>
        </div>

        <table className="w-full text-xs text-left">
          <thead className="bg-[#202229] text-stone-300 font-mono text-[10px] uppercase border-b border-white/10">
            <tr>
              <th className="py-2 px-4">Horizon Depth</th>
              <th className="py-2 px-4">Pedological Tier</th>
              <th className="py-2 px-4">Soil pH (H2O)</th>
              <th className="py-2 px-4">Clay %</th>
              <th className="py-2 px-4">SOC (g/kg)</th>
              <th className="py-2 px-4">Agronomic Function</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.1)] text-white font-mono text-[11px]">
            <tr className="hover:bg-[#202229]/40">
              <td className="py-2.5 px-4 font-bold text-[#22C55E]">0 - 5 cm</td>
              <td className="py-2.5 px-4 font-sans text-xs">Seedbed Surface Horizon</td>
              <td className="py-2.5 px-4">{props.depth_intervals["0-5cm"]?.ph || props.ph_h2o}</td>
              <td className="py-2.5 px-4">{props.depth_intervals["0-5cm"]?.clay || props.clay_pct}%</td>
              <td className="py-2.5 px-4">{props.depth_intervals["0-5cm"]?.soc || props.soc_g_kg}</td>
              <td className="py-2.5 px-4 font-sans text-xs text-stone-300">Direct contact layer for seed germination and early rootlet emergence.</td>
            </tr>
            <tr className="hover:bg-[#202229]/40">
              <td className="py-2.5 px-4 font-bold text-[#22C55E]">5 - 15 cm</td>
              <td className="py-2.5 px-4 font-sans text-xs">Crown &amp; Tillage Root Zone</td>
              <td className="py-2.5 px-4">{props.depth_intervals["5-15cm"]?.ph || props.ph_h2o}</td>
              <td className="py-2.5 px-4">{props.depth_intervals["5-15cm"]?.clay || props.clay_pct}%</td>
              <td className="py-2.5 px-4">{props.depth_intervals["5-15cm"]?.soc || props.soc_g_kg}</td>
              <td className="py-2.5 px-4 font-sans text-xs text-stone-300">Primary uptake zone for nitrogen and phosphorus fertilizer bands.</td>
            </tr>
            <tr className="hover:bg-[#202229]/40">
              <td className="py-2.5 px-4 font-bold text-[#22C55E]">15 - 30 cm</td>
              <td className="py-2.5 px-4 font-sans text-xs">Subsoil Moisture Store</td>
              <td className="py-2.5 px-4">{props.depth_intervals["15-30cm"]?.ph || props.ph_h2o}</td>
              <td className="py-2.5 px-4">{props.depth_intervals["15-30cm"]?.clay || props.clay_pct}%</td>
              <td className="py-2.5 px-4">{props.depth_intervals["15-30cm"]?.soc || props.soc_g_kg}</td>
              <td className="py-2.5 px-4 font-sans text-xs text-stone-300">Capillary moisture reserve tapped during grain anthesis.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Analytical Diagnostic Observations & Testing Caveat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Findings */}
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-4 space-y-2">
          <span className="text-[10px] font-mono uppercase text-[#8E929C] font-semibold block">
            Pedological Diagnostic Observations
          </span>
          <ul className="space-y-1.5 text-xs text-white">
            {evalData.key_findings.map((f, i) => (
              <li key={i} className="bg-[#202229] p-2 border border-white/10 leading-relaxed">
                &bull; {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Limitations */}
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-4 space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#8E929C] font-semibold block">
              Methodological Limitations &amp; Lab Coring Guidance
            </span>
            <p className="text-xs text-stone-300 leading-relaxed mt-1">
              {soil.metadata.disclaimer}
            </p>
          </div>
          <div className="p-2.5 bg-[#202229] border border-white/10 text-[11px] text-[#22C55E] font-mono font-medium">
            RECOMMENDATION: {evalData.fertility_guidance}
          </div>
        </div>
      </div>
    </div>
  );
};
