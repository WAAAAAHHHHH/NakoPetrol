import React from 'react';
import {
  Sprout,
  Thermometer,
  CloudRain,
  Sun,
  Layers,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  Droplets
} from 'lucide-react';
import { FieldDigitalTwin, CropRecommendation } from '../types/terramind';

interface SimplifiedDashboardProps {
  fieldDigitalTwin: FieldDigitalTwin | null;
  fieldName: string;
  loading: boolean;
  onNavigateToTab: (tab: string) => void;
}

function ScoreRing({ score }: { score: number }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color =
    score >= 70 ? '#7C9A6B' :
    score >= 50 ? '#D9A84C' :
                  '#C47B6A';

  return (
    <svg width={56} height={56} viewBox="0 0 56 56" className="shrink-0">
      {/* track */}
      <circle cx={28} cy={28} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3.5} />
      {/* fill */}
      <circle
        cx={28} cy={28} r={r}
        fill="none"
        stroke={color}
        strokeWidth={3.5}
        strokeDasharray={`${fill} ${circ - fill}`}
        strokeLinecap="round"
        strokeDashoffset={circ * 0.25}
        style={{ transition: 'stroke-dasharray 600ms cubic-bezier(0.19,1,0.22,1)' }}
      />
      <text x={28} y={28} textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize={12} fontWeight={700} fontFamily="IBM Plex Mono">
        {score}
      </text>
    </svg>
  );
}

function CropCard({ crop, rank, delay }: { crop: CropRecommendation; rank: number; delay: number }) {
  const scoreColor =
    crop.overall_score >= 70 ? 'text-[#7C9A6B]' :
    crop.overall_score >= 50 ? 'text-[#D9A84C]' :
                                'text-[#C47B6A]';

  const badgeColor =
    crop.overall_score >= 70 ? 'bg-[#7C9A6B]/10 text-[#A8C496] border-[#7C9A6B]/20' :
    crop.overall_score >= 50 ? 'bg-[#D9A84C]/10 text-[#E8C078] border-[#D9A84C]/20' :
                                'bg-[#C47B6A]/10 text-[#DFA090] border-[#C47B6A]/20';

  return (
    <div
      className={`card p-4 flex items-center gap-4 anim-fade-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-[11px] font-mono text-[#525660] w-4 shrink-0">#{rank}</div>
      <ScoreRing score={crop.overall_score} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm text-white truncate">{crop.name}</span>
          {rank === 1 && (
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#7C9A6B]/15 text-[#A8C496] border border-[#7C9A6B]/25 shrink-0">
              Best fit
            </span>
          )}
        </div>
        <div className="text-[11px] text-[#8E929C] mb-2 leading-relaxed line-clamp-2">
          {crop.suitability_description || crop.reasons?.[0] || `${crop.category} — ${crop.recommended_planting_period}`}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(crop.limiting_factors || crop.identified_risks || []).slice(0, 2).map((f: string, i: number) => (
            <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-[#8E929C] border border-white/[0.07]">
              ⚠ {f}
            </span>
          ))}
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${badgeColor}`}>
            {crop.recommended_planting_period}
          </span>
        </div>
      </div>
      <div className={`text-lg font-bold font-mono ${scoreColor} shrink-0`}>
        {crop.overall_score}
        <span className="text-[10px] text-[#525660] font-normal">/100</span>
      </div>
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
  unit,
  delay
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  delay?: number;
}) {
  return (
    <div
      className="flex items-center gap-3 bg-[#13141A] border border-white/[0.07] rounded-xl px-4 py-3 anim-fade-up"
      style={{ animationDelay: `${delay || 0}ms` }}
    >
      <div className="text-[#8E929C] shrink-0">{icon}</div>
      <div>
        <div className="text-[9px] font-mono uppercase tracking-widest text-[#525660]">{label}</div>
        <div className="text-sm font-semibold text-white font-mono">
          {value}<span className="text-[#525660] text-[10px] font-normal ml-0.5">{unit}</span>
        </div>
      </div>
    </div>
  );
}

export const SimplifiedDashboard: React.FC<SimplifiedDashboardProps> = ({
  fieldDigitalTwin,
  fieldName,
  loading,
  onNavigateToTab
}) => {
  const climate = fieldDigitalTwin?.climate?.summary;
  const soil = fieldDigitalTwin?.soil?.properties;
  const crops = fieldDigitalTwin?.crop_recommendations || [];
  const topCrops = crops.slice(0, 3);
  const isArable = fieldDigitalTwin?.is_arable_land !== false;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-[#525660]">
        <div className="w-8 h-8 border-2 border-white/10 border-t-[#7C9A6B] rounded-full animate-spin" />
        <span className="text-xs font-mono">Retrieving field data…</span>
      </div>
    );
  }

  if (!fieldDigitalTwin) {
    return (
      <div className="flex items-center justify-center h-full text-[#525660] text-sm font-mono">
        No field selected
      </div>
    );
  }

  if (!isArable) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-[#8E929C]">
        <Droplets size={32} className="text-[#4A7C9A] opacity-60" />
        <p className="text-sm font-mono text-center">
          {fieldDigitalTwin.marine_water_body || 'Marine water body'}<br />
          <span className="text-[#525660] text-xs">Non-arable — no crop analysis available</span>
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-5 py-7 space-y-6">

        {/* Header row */}
        <div className="anim-fade-up flex items-start justify-between">
          <div>
            <div className="text-[9px] font-mono uppercase tracking-widest text-[#525660] mb-1">Field overview</div>
            <h2 className="text-lg font-semibold text-white leading-tight">{fieldName}</h2>
            {climate && (
              <p className="text-[11px] text-[#8E929C] mt-1 font-mono">
                {climate.aridity_classification} · {climate.mean_annual_temp_c.toFixed(1)}°C avg · {climate.annual_precipitation_mm.toFixed(0)} mm/yr
              </p>
            )}
          </div>
          <button
            onClick={() => onNavigateToTab('dashboard')}
            className="btn flex items-center gap-1.5 text-[11px] text-[#8E929C] hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.07]"
          >
            <span>Full map</span>
            <ChevronRight size={11} />
          </button>
        </div>

        {/* Key stats strip */}
        {climate && soil && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <StatPill icon={<Thermometer size={14} />} label="Avg temp"    value={climate.mean_annual_temp_c.toFixed(1)} unit="°C"  delay={50}  />
            <StatPill icon={<CloudRain  size={14} />} label="Rainfall"    value={climate.annual_precipitation_mm.toFixed(0)} unit="mm" delay={100} />
            <StatPill icon={<Layers    size={14} />} label="Soil pH"      value={soil.ph_h2o.toFixed(1)}                             delay={150} />
            <StatPill icon={<Sun       size={14} />} label="Frost months" value={climate.frost_months_count}                         delay={200} />
          </div>
        )}

        {/* Soil quick note */}
        {soil && (
          <div className="simplified-banner rounded-lg px-4 py-3 anim-fade-up anim-delay-200">
            <div className="text-[9px] font-mono uppercase tracking-widest text-[#7C9A6B] mb-1.5">Soil snapshot</div>
            <p className="text-[12px] text-[#C8CCCC] leading-relaxed">
              <span className="font-medium text-white">{soil.usda_texture}</span> texture · {soil.soil_type_wrb} ·{' '}
              SOC {soil.soc_g_kg} g/kg · CEC {soil.cec_cmolc_kg.toFixed(1)} cmolc/kg
            </p>
            {fieldDigitalTwin.soil?.agronomic_evaluation?.suitability_summary && (
              <p className="text-[11px] text-[#8E929C] mt-1.5 leading-relaxed">
                {fieldDigitalTwin.soil.agronomic_evaluation.suitability_summary}
              </p>
            )}
          </div>
        )}

        {/* Top 3 crops */}
        <div>
          <div className="flex items-center justify-between mb-3 anim-fade-up anim-delay-200">
            <div>
              <div className="text-[9px] font-mono uppercase tracking-widest text-[#525660]">Recommended crops</div>
              <div className="text-xs text-[#8E929C] mt-0.5">Top 3 — ranked by field suitability score</div>
            </div>
            <button
              onClick={() => onNavigateToTab('crops')}
              className="btn text-[10px] text-[#7C9A6B] hover:text-[#A8C496] flex items-center gap-1 font-mono"
            >
              See all <ChevronRight size={10} />
            </button>
          </div>

          <div className="space-y-2.5">
            {topCrops.length === 0 ? (
              <div className="card p-5 text-center text-[#525660] text-xs font-mono">
                No crop data available yet
              </div>
            ) : (
              topCrops.map((crop, i) => (
                <CropCard key={crop.crop_id} crop={crop} rank={i + 1} delay={250 + i * 60} />
              ))
            )}
          </div>
        </div>

        {/* Quick nav row */}
        <div className="grid grid-cols-3 gap-2 anim-fade-up anim-delay-300">
          {[
            { tab: 'scenario', icon: <TrendingUp size={14} />, label: 'What-If Sim' },
            { tab: 'calendar', icon: <Clock size={14} />, label: 'Planting Dates' },
            { tab: 'climate',  icon: <CloudRain size={14} />, label: 'Climate Data' },
          ].map(({ tab, icon, label }) => (
            <button
              key={tab}
              onClick={() => onNavigateToTab(tab)}
              className="btn card p-3 flex flex-col items-center gap-2 text-[#8E929C] hover:text-white hover:border-white/15 rounded-xl"
            >
              <div className="text-[#7C9A6B]">{icon}</div>
              <span className="text-[10px] font-mono text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-[10px] text-[#3A3D45] font-mono text-center anim-fade-up anim-delay-300">
          Data: NASA POWER · ISRIC SoilGrids · Sentinel-2 / MODIS · Natural Earth
        </p>
      </div>
    </div>
  );
};
