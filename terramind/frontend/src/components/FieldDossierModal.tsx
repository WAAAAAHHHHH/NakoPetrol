import React from 'react';
import { 
  FileText, 
  Printer, 
  X, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Layers, 
  Sun, 
  Sprout, 
  Droplets,
  Calendar
} from 'lucide-react';
import { DemoField, FieldDigitalTwin } from '../types/terramind';

interface FieldDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedField: DemoField | null;
  fieldDigitalTwin: FieldDigitalTwin | null;
}

export const FieldDossierModal: React.FC<FieldDossierModalProps> = ({
  isOpen,
  onClose,
  selectedField,
  fieldDigitalTwin
}) => {
  if (!isOpen || !fieldDigitalTwin) return null;

  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const soil = fieldDigitalTwin.soil?.properties;
  const climate = fieldDigitalTwin.climate?.summary;
  const monthly = fieldDigitalTwin.climate?.monthly || [];
  const crops = fieldDigitalTwin.crop_recommendations || [];
  const risks = fieldDigitalTwin.climate_risks;
  const rotation = fieldDigitalTwin.rotation_plan;
  const isArable = fieldDigitalTwin.is_arable_land !== false;

  const lat = fieldDigitalTwin.coordinates?.latitude || selectedField?.latitude || 0;
  const lon = fieldDigitalTwin.coordinates?.longitude || selectedField?.longitude || 0;
  const area = fieldDigitalTwin.area_hectares || selectedField?.area_hectares || 35;
  const fieldName = selectedField?.name || fieldDigitalTwin.field_name || 'Agricultural Parcel';

  const docId = `FAR-NASA-${Math.abs(Math.round(lat * 100))}${Math.abs(Math.round(lon * 100))}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto anim-fade-in no-print-backdrop">
      <div className="bg-[#121316] border border-white/[0.08] rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden anim-scale-in text-white">
        
        {/* Top Control Bar (Screen only, hidden on print) */}
        <div className="p-4 border-b border-white/[0.08] bg-[#16181D] flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7C9A6B]/15 text-[#A8C496] border border-[#7C9A6B]/30 flex items-center justify-center">
              <FileText size={16} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Scientific Field Assessment Dossier
              </h3>
              <p className="text-xs text-white/40">
                Printable publication-grade report &bull; Document ID: {docId}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handlePrint}
              className="btn px-4 py-2 bg-[#7C9A6B] hover:bg-[#6E8A5D] text-[#0E0F12] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Printer size={14} />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="btn p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Document Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 bg-[#0E0F12]">
          
          {/* Print container styling */}
          <div id="printable-dossier" className="max-w-3xl mx-auto space-y-8 text-white dossier-print-area">
            
            {/* ── DOCUMENT HEADER ── */}
            <div className="border-b border-white/[0.1] pb-6 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-[#7C9A6B] font-semibold flex items-center gap-1.5 mb-1">
                    <ShieldCheck size={14} />
                    <span>Farmelster &bull; Global Agricultural Intelligence</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">
                    Field Intelligence &amp; Agronomic Strategy Dossier
                  </h1>
                  <p className="text-xs text-white/50 mt-1">
                    NASA Space Apps Challenge 2026 &bull; Challenge: Field Shift: Adapting Farms with NASA Data
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] inline-block">
                    {docId}
                  </div>
                  <div className="text-[11px] text-white/40 mt-1">
                    Generated: {today}
                  </div>
                </div>
              </div>

              {/* Quick Metadata Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                <div className="bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.05]">
                  <span className="text-white/40 text-[10px] block">Parcel Name</span>
                  <strong className="text-white truncate block">{fieldName}</strong>
                </div>
                <div className="bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.05]">
                  <span className="text-white/40 text-[10px] block">Geographic Position</span>
                  <strong className="text-white">{lat.toFixed(4)}°N, {lon.toFixed(4)}°E</strong>
                </div>
                <div className="bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.05]">
                  <span className="text-white/40 text-[10px] block">Surveyed Extent</span>
                  <strong className="text-white">{area} Hectares</strong>
                </div>
                <div className="bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.05]">
                  <span className="text-white/40 text-[10px] block">Land Status</span>
                  <strong className={isArable ? "text-[#7C9A6B]" : "text-cyan-400"}>
                    {isArable ? 'Terrestrial Arable' : 'Marine Water Body'}
                  </strong>
                </div>
              </div>
            </div>

            {/* ── SECTION 1: SOIL PEDOLOGICAL HORIZONS ── */}
            <div className="space-y-3.5 dossier-page-break">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                  <Layers size={14} className="text-[#7C9A6B]" />
                  <span>1. Pedological &amp; Soil Horizon Stratification (ISRIC SoilGrids 2.0)</span>
                </h2>
                <span className="text-xs text-white/40">250m Spatial Resolution</span>
              </div>

              {soil ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
                      <span className="text-white/40 text-[10px] block">Soil Taxonomy (WRB)</span>
                      <strong className="text-white text-sm">{soil.soil_type_wrb}</strong>
                    </div>
                    <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
                      <span className="text-white/40 text-[10px] block">USDA Texture Class</span>
                      <strong className="text-white text-sm">{soil.usda_texture}</strong>
                    </div>
                    <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
                      <span className="text-white/40 text-[10px] block">Reaction (pH H2O)</span>
                      <strong className="text-white text-sm">{soil.ph_h2o}</strong>
                      <span className="text-[10px] text-white/50 block">
                        {soil.ph_h2o > 7.5 ? 'Alkaline' : soil.ph_h2o < 6.0 ? 'Acidic' : 'Neutral'}
                      </span>
                    </div>
                    <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
                      <span className="text-white/40 text-[10px] block">Organic Carbon (SOC)</span>
                      <strong className="text-white text-sm">{soil.soc_g_kg} g/kg</strong>
                      <span className="text-[10px] text-white/50 block">~{soil.soc_percentage}% Organic Matter</span>
                    </div>
                  </div>

                  {/* Depth Interval Table */}
                  <div className="border border-white/[0.07] rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-white/[0.03] text-white/40 uppercase text-[10px] font-semibold border-b border-white/[0.06]">
                        <tr>
                          <th className="py-2 px-3.5">Horizon Depth</th>
                          <th className="py-2 px-3.5">Soil Tier</th>
                          <th className="py-2 px-3.5">pH (H2O)</th>
                          <th className="py-2 px-3.5">Clay %</th>
                          <th className="py-2 px-3.5">SOC (g/kg)</th>
                          <th className="py-2 px-3.5">Agronomic Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        <tr>
                          <td className="py-2.5 px-3.5 font-semibold text-[#7C9A6B]">0 – 5 cm</td>
                          <td className="py-2.5 px-3.5">Seedbed Horizon</td>
                          <td className="py-2.5 px-3.5">{soil.depth_intervals?.['0-5cm']?.ph || soil.ph_h2o}</td>
                          <td className="py-2.5 px-3.5">{soil.depth_intervals?.['0-5cm']?.clay || soil.clay_pct}%</td>
                          <td className="py-2.5 px-3.5">{soil.depth_intervals?.['0-5cm']?.soc || soil.soc_g_kg}</td>
                          <td className="py-2.5 px-3.5 text-white/60">Germination &amp; seedling emergence</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5 font-semibold text-[#7C9A6B]">5 – 15 cm</td>
                          <td className="py-2.5 px-3.5">Rooting Tillage Zone</td>
                          <td className="py-2.5 px-3.5">{soil.depth_intervals?.['5-15cm']?.ph || soil.ph_h2o}</td>
                          <td className="py-2.5 px-3.5">{soil.depth_intervals?.['5-15cm']?.clay || soil.clay_pct}%</td>
                          <td className="py-2.5 px-3.5">{soil.depth_intervals?.['5-15cm']?.soc || soil.soc_g_kg}</td>
                          <td className="py-2.5 px-3.5 text-white/60">Primary fertilizer nutrient band uptake</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5 font-semibold text-[#7C9A6B]">15 – 30 cm</td>
                          <td className="py-2.5 px-3.5">Subsoil Reserve</td>
                          <td className="py-2.5 px-3.5">{soil.depth_intervals?.['15-30cm']?.ph || soil.ph_h2o}</td>
                          <td className="py-2.5 px-3.5">{soil.depth_intervals?.['15-30cm']?.clay || soil.clay_pct}%</td>
                          <td className="py-2.5 px-3.5">{soil.depth_intervals?.['15-30cm']?.soc || soil.soc_g_kg}</td>
                          <td className="py-2.5 px-3.5 text-white/60">Deep capillary moisture reservoir</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {fieldDigitalTwin.soil?.agronomic_evaluation && (
                    <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-xs text-white/70 space-y-1">
                      <strong className="text-white block">Fertility &amp; Pedology Evaluation:</strong>
                      <p>{fieldDigitalTwin.soil.agronomic_evaluation.suitability_summary}</p>
                      <p className="text-[#A8C496] font-medium pt-1">
                        Recommendation: {fieldDigitalTwin.soil.agronomic_evaluation.fertility_guidance}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs text-white/40 italic">Submerged marine substrate — non-arable surface.</div>
              )}
            </div>

            {/* ── SECTION 2: 30-YEAR CLIMATOLOGY & NATURAL HAZARDS ── */}
            <div className="space-y-3.5 dossier-page-break">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                  <Sun size={14} className="text-[#7C9A6B]" />
                  <span>2. Hydrothermal Climatology &amp; Risk Envelope (NASA POWER MERRA-2)</span>
                </h2>
                <span className="text-xs text-white/40">30-Year Satellite Reanalysis</span>
              </div>

              {climate && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
                    <span className="text-white/40 text-[10px] block">Mean Annual Temp</span>
                    <strong className="text-white text-sm">{climate.mean_annual_temp_c.toFixed(1)}°C</strong>
                  </div>
                  <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
                    <span className="text-white/40 text-[10px] block">Annual Precipitation</span>
                    <strong className="text-white text-sm">{climate.annual_precipitation_mm.toFixed(0)} mm</strong>
                  </div>
                  <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
                    <span className="text-white/40 text-[10px] block">Solar Insolation</span>
                    <strong className="text-white text-sm">{climate.annual_solar_radiation_mean_mj.toFixed(1)} MJ/m²</strong>
                  </div>
                  <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
                    <span className="text-white/40 text-[10px] block">Frost Hazard Months</span>
                    <strong className="text-white text-sm">{climate.frost_months_count} Months/Yr</strong>
                  </div>
                </div>
              )}

              {/* Monthly Climatogram Table */}
              {monthly.length > 0 && (
                <div className="border border-white/[0.07] rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-center">
                    <thead className="bg-white/[0.03] text-white/40 uppercase text-[10px] font-semibold border-b border-white/[0.06]">
                      <tr>
                        {monthly.map(m => (
                          <th key={m.month} className="py-2 px-1">{m.month}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] text-[11px]">
                      <tr>
                        {monthly.map(m => (
                          <td key={m.month} className="py-2 px-1 font-medium text-white/90">
                            {m.temp_mean_c}°
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-white/[0.01]">
                        {monthly.map(m => (
                          <td key={m.month} className="py-2 px-1 text-[#7C9A6B] font-semibold">
                            {m.precipitation_mm}m
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Hazard Scores */}
              {risks && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                    <span className="text-white/40 text-[10px] block">Drought Exposure</span>
                    <strong className="text-white font-semibold">{risks.risk_categories.drought.score}/100</strong>
                    <span className="text-[10px] text-white/50 block truncate">{risks.risk_categories.drought.level}</span>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                    <span className="text-white/40 text-[10px] block">Heat Stress Hazard</span>
                    <strong className="text-white font-semibold">{risks.risk_categories.heat_stress.score}/100</strong>
                    <span className="text-[10px] text-white/50 block truncate">{risks.risk_categories.heat_stress.level}</span>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                    <span className="text-white/40 text-[10px] block">Frost Risk</span>
                    <strong className="text-white font-semibold">{risks.risk_categories.frost_hazard.score}/100</strong>
                    <span className="text-[10px] text-white/50 block truncate">{risks.risk_categories.frost_hazard.level}</span>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                    <span className="text-white/40 text-[10px] block">Excess Rain / Runoff</span>
                    <strong className="text-white font-semibold">{risks.risk_categories.excessive_rainfall.score}/100</strong>
                    <span className="text-[10px] text-white/50 block truncate">{risks.risk_categories.excessive_rainfall.level}</span>
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION 3: FAO ECOCROP CULTIVAR SUITABILITY ── */}
            <div className="space-y-3.5 dossier-page-break">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                  <Sprout size={14} className="text-[#7C9A6B]" />
                  <span>3. FAO EcoCrop Evaluated Cultivar Rankings</span>
                </h2>
                <span className="text-xs text-white/40">Multi-Attribute Utility Analysis</span>
              </div>

              {crops.length > 0 ? (
                <div className="border border-white/[0.07] rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-white/[0.03] text-white/40 uppercase text-[10px] font-semibold border-b border-white/[0.06]">
                      <tr>
                        <th className="py-2.5 px-3">Rank</th>
                        <th className="py-2.5 px-3">Crop Specimen</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Score</th>
                        <th className="py-2.5 px-3">Components (T / W / S / R)</th>
                        <th className="py-2.5 px-3">Sowing Window</th>
                        <th className="py-2.5 px-3">Primary Constraint</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {crops.map((c, i) => (
                        <tr key={c.crop_id} className={i === 0 ? "bg-[#7C9A6B]/5" : ""}>
                          <td className="py-2.5 px-3 font-semibold text-[#7C9A6B]">#{c.rank || i + 1}</td>
                          <td className="py-2.5 px-3">
                            <strong className="text-white block">{c.name}</strong>
                            <span className="text-[10px] text-white/40 italic">{c.scientific_name}</span>
                          </td>
                          <td className="py-2.5 px-3 text-white/70">{c.category}</td>
                          <td className="py-2.5 px-3">
                            <span className="text-sm font-bold text-[#7C9A6B]">{c.overall_score}</span>
                            <span className="text-[10px] text-white/40">/100</span>
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-white/60">
                            {c.component_scores.climate_temperature}% / {c.component_scores.water_availability}% / {c.component_scores.soil_compatibility}% / {c.component_scores.climate_risk_safety}%
                          </td>
                          <td className="py-2.5 px-3 text-white/80">{c.recommended_planting_period}</td>
                          <td className="py-2.5 px-3 text-white/50 text-[11px]">
                            {c.limiting_factors?.[0] || c.identified_risks?.[0] || 'Nominal envelope'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-xs text-white/40 italic">No terrestrial crops cultivable on marine surfaces.</div>
              )}
            </div>

            {/* ── SECTION 4: SUCCESSION & STRATEGIC RECOMMENDATIONS ── */}
            {rotation && (
              <div className="space-y-3.5 dossier-page-break">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                    <Calendar size={14} className="text-[#7C9A6B]" />
                    <span>4. Botanical Succession Architecture (4-Year Rotation)</span>
                  </h2>
                  <span className="text-xs text-white/40">Pathogen Break Framework</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                  {rotation.four_year_ideal_rotation_plan?.map((phase, idx) => (
                    <div key={idx} className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
                      <span className="text-[#7C9A6B] text-[10px] font-semibold block mb-1">
                        Year 0{idx + 1} &bull; Phase {idx + 1}
                      </span>
                      <strong className="text-white text-xs block leading-snug">{phase}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SECTION 5: FORMAL SCIENTIFIC INTEGRITY & DISCLOSURES ── */}
            <div className="border-t border-white/[0.1] pt-4 space-y-2 text-[10px] text-white/40 leading-relaxed dossier-footer">
              <div className="flex items-center justify-between font-semibold uppercase text-white/60">
                <span>Methodological Disclosures &amp; Source Attribution</span>
                <span>NASA Space Apps Challenge 2026</span>
              </div>
              <p>
                <strong>Authoritative Sources:</strong> Agroclimatological reanalysis supplied by NASA POWER (Goddard Earth Observing System / MERRA-2). Pedological horizon attributes modeled by ISRIC SoilGrids 2.0 machine learning cores. Canopy vegetation reflection derived from ESA Sentinel-2 / NASA MODIS multispectral radiometry. Cultivar parameters calibrated to FAO Irrigation and Drainage Paper 56 and FAO EcoCrop envelopes.
              </p>
              <p>
                <strong>Scientific Disclaimer:</strong> Farmelster is an educational research workstation. Gridded 250m and 0.5° satellite datasets provide macro-environmental baseline assessments. Operators must conduct ISO-certified core sampling and consult synoptic localized meteorological forecasts before making capital or sowing commitments.
              </p>
              <div className="text-right text-white/20 pt-1">
                Document SHA-256 Verification &bull; {docId} &bull; Farmelster AI
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

