import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  CloudRain, 
  Thermometer, 
  Clock, 
  Droplets, 
  ArrowRight, 
  Check, 
  AlertTriangle,
  Play
} from 'lucide-react';
import { CropRecommendation, ScenarioParams, SimulatedScenarioResult } from '../types/terramind';
import { terramindApi } from '../services/api';

interface WhatIfSimulatorViewProps {
  crops: CropRecommendation[];
  latitude: number;
  longitude: number;
  annualPrecip: number;
  meanTemp: number;
  fieldName: string;
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({
  crops,
  latitude,
  longitude,
  annualPrecip,
  meanTemp,
  fieldName
}) => {
  // Scenario 1: Shock
  const [cropId1, setCropId1] = useState<string>('wheat');
  const [rainPct1, setRainPct1] = useState<number>(-25.0);
  const [tempShift1, setTempShift1] = useState<number>(1.5);
  const [delayDays1, setDelayDays1] = useState<number>(20);
  const [irrig1, setIrrig1] = useState<string>('rainfed');

  // Scenario 2: Adaptation
  const [cropId2, setCropId2] = useState<string>('barley');
  const [rainPct2, setRainPct2] = useState<number>(-25.0);
  const [tempShift2, setTempShift2] = useState<number>(1.5);
  const [delayDays2, setDelayDays2] = useState<number>(0);
  const [irrig2, setIrrig2] = useState<string>('deficit');

  const [simResults, setSimResults] = useState<SimulatedScenarioResult[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const scenarios: ScenarioParams[] = [
        {
          scenario_name: 'Historical Baseline Reference',
          crop_id: cropId1,
          rainfall_change_pct: 0.0,
          temperature_shift_c: 0.0,
          planting_delay_days: 0,
          irrigation_mode: 'rainfed'
        },
        {
          scenario_name: 'Scenario A: Climate Shock & Delayed Planting',
          crop_id: cropId1,
          rainfall_change_pct: rainPct1,
          temperature_shift_c: tempShift1,
          planting_delay_days: delayDays1,
          irrigation_mode: irrig1
        },
        {
          scenario_name: 'Scenario B: Resilient Crop Adaptation',
          crop_id: cropId2,
          rainfall_change_pct: rainPct2,
          temperature_shift_c: tempShift2,
          planting_delay_days: delayDays2,
          irrigation_mode: irrig2
        }
      ];

      const res = await terramindApi.runWhatIfSimulation(latitude, longitude, scenarios);
      setSimResults(res.scenarios_evaluated);
    } catch (err) {
      console.error('Failed to run simulation:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    runSimulation();
  }, [latitude, longitude]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 anim-fade-up">
      {/* Editorial Header */}
      <div className="border-b border-white/[0.07] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-[#7C9A6B] font-medium tracking-wide mb-1 flex items-center gap-1.5">
            <SlidersHorizontal size={13} />
            <span>Empirical Stress Model &bull; FAO 56 Hydrothermal Perturbation</span>
          </div>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Scenario Lab: Climate Anomaly &amp; Sowing Shifts
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Simulate precipitation deficits, thermal anomalies, drilling delays, and irrigation for <span className="text-white/90 font-medium">{fieldName}</span>.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={loading}
          className="btn px-4 py-2 bg-[#7C9A6B] hover:bg-[#6E8A5D] text-[#0E0F12] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
        >
          <Play size={13} className="fill-current" />
          <span>{loading ? 'Computing...' : 'Run Simulation'}</span>
        </button>
      </div>

      {/* Control Levers Grid (Scenario A vs Scenario B) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scenario A */}
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-white/[0.06]">
            <span className="font-semibold text-sm text-white">
              Scenario A: Climate Shock &amp; Delayed Planting
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.04] text-white/40 border border-white/[0.06]">
              Stress Model
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-xs text-white/50 block mb-1.5 font-medium">Crop Specimen</label>
              <select
                value={cropId1}
                onChange={(e) => setCropId1(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white font-medium text-xs focus:outline-none cursor-pointer"
              >
                {crops.map((c) => (
                  <option key={c.crop_id} value={c.crop_id} className="bg-[#18191E] text-white">
                    {c.name} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between mb-1.5 font-medium">
                <span className="text-white/70">Rainfall Anomaly:</span>
                <strong className="text-[#C47B6A]">{rainPct1 > 0 ? `+${rainPct1}` : rainPct1}% ({Math.round(annualPrecip * (1 + rainPct1/100))} mm)</strong>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={rainPct1}
                onChange={(e) => setRainPct1(parseFloat(e.target.value))}
                className="w-full accent-[#7C9A6B] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 font-medium">
                <span className="text-white/70">Temperature Anomaly:</span>
                <strong className="text-white/90">{tempShift1 > 0 ? `+${tempShift1}` : tempShift1}°C ({Math.round((meanTemp + tempShift1)*10)/10}°C)</strong>
              </div>
              <input
                type="range"
                min="-3"
                max="5"
                step="0.5"
                value={tempShift1}
                onChange={(e) => setTempShift1(parseFloat(e.target.value))}
                className="w-full accent-[#7C9A6B] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 font-medium">
                <span className="text-white/70">Sowing Date Shift:</span>
                <strong className="text-white/90">{delayDays1 > 0 ? `+${delayDays1}` : delayDays1} Days</strong>
              </div>
              <input
                type="range"
                min="-20"
                max="45"
                step="5"
                value={delayDays1}
                onChange={(e) => setDelayDays1(parseInt(e.target.value))}
                className="w-full accent-[#7C9A6B] cursor-pointer"
              />
            </div>

            <div>
              <span className="text-xs text-white/50 block mb-1.5 font-medium">Irrigation Regime</span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['rainfed', 'deficit', 'full'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setIrrig1(m)}
                    className={`btn py-1.5 rounded-xl capitalize font-medium cursor-pointer transition-all ${
                      irrig1 === m
                        ? 'bg-[#7C9A6B] text-[#0E0F12] font-semibold shadow-sm'
                        : 'bg-white/[0.03] border border-white/[0.06] text-white/60 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scenario B */}
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-white/[0.06]">
            <span className="font-semibold text-sm text-white">
              Scenario B: Resilient Crop Adaptation
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#7C9A6B]/15 text-[#A8C496] border border-[#7C9A6B]/25 font-medium">
              Adaptation
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-xs text-white/50 block mb-1.5 font-medium">Adapted Specimen</label>
              <select
                value={cropId2}
                onChange={(e) => setCropId2(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white font-medium text-xs focus:outline-none cursor-pointer"
              >
                {crops.map((c) => (
                  <option key={c.crop_id} value={c.crop_id} className="bg-[#18191E] text-white">
                    {c.name} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between mb-1.5 font-medium">
                <span className="text-white/70">Rainfall Anomaly:</span>
                <strong className="text-[#C47B6A]">{rainPct2 > 0 ? `+${rainPct2}` : rainPct2}% ({Math.round(annualPrecip * (1 + rainPct2/100))} mm)</strong>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={rainPct2}
                onChange={(e) => setRainPct2(parseFloat(e.target.value))}
                className="w-full accent-[#7C9A6B] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 font-medium">
                <span className="text-white/70">Temperature Anomaly:</span>
                <strong className="text-white/90">{tempShift2 > 0 ? `+${tempShift2}` : tempShift2}°C ({Math.round((meanTemp + tempShift2)*10)/10}°C)</strong>
              </div>
              <input
                type="range"
                min="-3"
                max="5"
                step="0.5"
                value={tempShift2}
                onChange={(e) => setTempShift2(parseFloat(e.target.value))}
                className="w-full accent-[#7C9A6B] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 font-medium">
                <span className="text-white/70">Timely Sowing Shift:</span>
                <strong className="text-[#7C9A6B]">{delayDays2 > 0 ? `+${delayDays2}` : delayDays2} Days (On Schedule)</strong>
              </div>
              <input
                type="range"
                min="-20"
                max="45"
                step="5"
                value={delayDays2}
                onChange={(e) => setDelayDays2(parseInt(e.target.value))}
                className="w-full accent-[#7C9A6B] cursor-pointer"
              />
            </div>

            <div>
              <span className="text-xs text-white/50 block mb-1.5 font-medium">Irrigation Regime</span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['rainfed', 'deficit', 'full'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setIrrig2(m)}
                    className={`btn py-1.5 rounded-xl capitalize font-medium cursor-pointer transition-all ${
                      irrig2 === m
                        ? 'bg-[#7C9A6B] text-[#0E0F12] font-semibold shadow-sm'
                        : 'bg-white/[0.03] border border-white/[0.06] text-white/60 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Scenario Results Table & Delta Cards */}
      {simResults && (
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/[0.06]">
            <span className="text-xs font-semibold text-white/80">
              Comparative Impact Synthesis &bull; Delta Matrix
            </span>
            <span className="text-xs text-white/40">
              Stress functions calibrated to FAO 56
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {simResults.map((res, idx) => {
              const isBase = idx === 0;
              const isShock = idx === 1;
              const cardBorder = isBase ? 'border-white/[0.06]' : isShock ? 'border-[#C47B6A]/30' : 'border-[#7C9A6B]/40 bg-[#7C9A6B]/5';

              return (
                <div
                  key={res.scenario_name}
                  className={`p-4 border rounded-2xl flex flex-col justify-between ${cardBorder} bg-white/[0.02] shadow-sm`}
                >
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-xs text-white/40 font-medium uppercase tracking-wider">
                        {res.scenario_name.split(':')[0]}
                      </span>
                      <span className="font-semibold text-sm text-white">
                        {res.crop_name}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between my-2 border-y border-white/[0.06] py-2.5">
                      <span className="text-xs text-white/50">Suitability Score:</span>
                      <span className="text-xl font-bold text-[#7C9A6B]">
                        {res.simulated_metrics.overall_suitability_score} <span className="text-xs font-normal text-white/40">/ 100</span>
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-white/70 bg-white/[0.02] p-3 border border-white/[0.05] rounded-xl mb-3">
                      <div className="flex justify-between">
                        <span className="text-white/40">Precipitation:</span>
                        <strong className="text-white">{res.parameters_applied.adjusted_annual_rainfall_mm} mm ({res.parameters_applied.rainfall_change_pct})</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Mean Temp:</span>
                        <strong className="text-white">{res.parameters_applied.adjusted_mean_temp_c}°C ({res.parameters_applied.temperature_shift_c})</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Sowing Shift:</span>
                        <strong className="text-white">{res.parameters_applied.planting_delay_days}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Water Deficit:</span>
                        <strong className="text-[#C47B6A]">{res.simulated_metrics.water_deficit_mm} mm</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Peak Summer Heat:</span>
                        <strong className="text-white">{res.simulated_metrics.peak_summer_temp_c}°C</strong>
                      </div>
                    </div>

                    <div className="text-xs text-white/70 leading-relaxed">
                      <strong className="text-white/90 block mb-1">Primary Challenge:</strong>
                      {res.key_management_challenges[0]}
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-white/[0.06] text-xs text-white/40">
                    {res.delay_impact_analysis}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
