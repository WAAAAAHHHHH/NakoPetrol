import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  CloudRain, 
  Thermometer, 
  Clock, 
  Droplets, 
  ArrowRight, 
  Check, 
  AlertTriangle 
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
    <div className="space-y-4">
      {/* Editorial Header */}
      <div className="border-b border-white/10 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#8E929C]">
            Empirical Stress Model &bull; Perturbation Analysis
          </div>
          <h1 className="font-serif text-xl font-bold text-white">
            Scenario Lab: Climate Anomaly &amp; Sowing Shifts
          </h1>
          <p className="text-xs text-stone-300 mt-0.5">
            Evaluate how precipitation deficits, thermal warming, delayed drilling, and irrigation modify suitability for <strong className="text-white">{fieldName}</strong>.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={loading}
          className="px-3.5 py-1.5 bg-[#22C55E] hover:bg-[#15803D] text-[#0E0F12] rounded-sm font-mono text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
        >
          {loading ? 'COMPUTING SIMULATION...' : 'RUN SCENARIO SIMULATION'}
        </button>
      </div>

      {/* Control Levers Grid (Scenario A vs Scenario B) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Scenario A */}
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-4 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <span className="font-serif font-bold text-sm text-white">
              Scenario A: Climate Shock &amp; Delayed Planting
            </span>
            <span className="text-[10px] font-mono text-[#8E929C]">STRESS MODEL</span>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            <div>
              <label className="text-[10px] text-[#8E929C] block mb-1">CROP SPECIMEN</label>
              <select
                value={cropId1}
                onChange={(e) => setCropId1(e.target.value)}
                className="w-full bg-[#202229] border border-white/10 px-2 py-1 text-white font-serif font-bold text-xs"
              >
                {crops.map((c) => (
                  <option key={c.crop_id} value={c.crop_id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Rainfall Anomaly:</span>
                <strong className="text-[#22C55E]">{rainPct1 > 0 ? `+${rainPct1}` : rainPct1}% ({Math.round(annualPrecip * (1 + rainPct1/100))} mm)</strong>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={rainPct1}
                onChange={(e) => setRainPct1(parseFloat(e.target.value))}
                className="w-full accent-[#22C55E] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Temperature Anomaly:</span>
                <strong className="text-white">{tempShift1 > 0 ? `+${tempShift1}` : tempShift1}°C ({Math.round((meanTemp + tempShift1)*10)/10}°C)</strong>
              </div>
              <input
                type="range"
                min="-3"
                max="5"
                step="0.5"
                value={tempShift1}
                onChange={(e) => setTempShift1(parseFloat(e.target.value))}
                className="w-full accent-[#22C55E] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Sowing Date Shift:</span>
                <strong className="text-white">{delayDays1 > 0 ? `+${delayDays1}` : delayDays1} Days</strong>
              </div>
              <input
                type="range"
                min="-20"
                max="45"
                step="5"
                value={delayDays1}
                onChange={(e) => setDelayDays1(parseInt(e.target.value))}
                className="w-full accent-[#22C55E] cursor-pointer"
              />
            </div>

            <div>
              <span className="text-[10px] text-[#8E929C] block mb-1">IRRIGATION REGIME</span>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
                {['rainfed', 'deficit', 'full'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setIrrig1(m)}
                    className={`py-1 border rounded-xs uppercase font-semibold cursor-pointer ${
                      irrig1 === m
                        ? 'bg-[#22C55E] border-[#22C55E] text-[#0E0F12]'
                        : 'bg-[#202229] border-white/10 text-stone-300'
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
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-4 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <span className="font-serif font-bold text-sm text-white">
              Scenario B: Resilient Crop Adaptation
            </span>
            <span className="text-[10px] font-mono text-[#22C55E] font-bold">ADAPTATION</span>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            <div>
              <label className="text-[10px] text-[#8E929C] block mb-1">ADAPTED SPECIMEN</label>
              <select
                value={cropId2}
                onChange={(e) => setCropId2(e.target.value)}
                className="w-full bg-[#202229] border border-white/10 px-2 py-1 text-white font-serif font-bold text-xs"
              >
                {crops.map((c) => (
                  <option key={c.crop_id} value={c.crop_id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Rainfall Anomaly:</span>
                <strong className="text-[#22C55E]">{rainPct2 > 0 ? `+${rainPct2}` : rainPct2}% ({Math.round(annualPrecip * (1 + rainPct2/100))} mm)</strong>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={rainPct2}
                onChange={(e) => setRainPct2(parseFloat(e.target.value))}
                className="w-full accent-[#22C55E] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Temperature Anomaly:</span>
                <strong className="text-white">{tempShift2 > 0 ? `+${tempShift2}` : tempShift2}°C ({Math.round((meanTemp + tempShift2)*10)/10}°C)</strong>
              </div>
              <input
                type="range"
                min="-3"
                max="5"
                step="0.5"
                value={tempShift2}
                onChange={(e) => setTempShift2(parseFloat(e.target.value))}
                className="w-full accent-[#22C55E] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Timely Sowing Shift:</span>
                <strong className="text-[#22C55E]">{delayDays2 > 0 ? `+${delayDays2}` : delayDays2} Days (On Schedule)</strong>
              </div>
              <input
                type="range"
                min="-20"
                max="45"
                step="5"
                value={delayDays2}
                onChange={(e) => setDelayDays2(parseInt(e.target.value))}
                className="w-full accent-[#22C55E] cursor-pointer"
              />
            </div>

            <div>
              <span className="text-[10px] text-[#8E929C] block mb-1">IRRIGATION REGIME</span>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
                {['rainfed', 'deficit', 'full'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setIrrig2(m)}
                    className={`py-1 border rounded-xs uppercase font-semibold cursor-pointer ${
                      irrig2 === m
                        ? 'bg-[#22C55E] border-[#22C55E] text-[#0E0F12]'
                        : 'bg-[#202229] border-white/10 text-stone-300'
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
        <div className="bg-[#18191E] border border-white/10 rounded-sm p-4">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/10">
            <span className="font-mono text-[10px] uppercase text-[#8E929C] font-semibold">
              Comparative Impact Synthesis &bull; Delta Matrix
            </span>
            <span className="text-[10px] font-mono text-[#8E929C]">
              STRESS FUNCTIONS CALIBRATED TO FAO 56
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {simResults.map((res, idx) => {
              const isBase = idx === 0;
              const isShock = idx === 1;
              return (
                <div
                  key={res.scenario_name}
                  className={`p-3.5 border rounded-xs flex flex-col justify-between ${
                    isBase
                      ? 'bg-[#18191E] border-white/10'
                      : isShock
                      ? 'bg-[#202229] border-white/10'
                      : 'bg-[#22C55E]/5 border-[#22C55E]'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="font-mono text-[10px] uppercase font-bold text-[#8E929C]">
                        {res.scenario_name.split(':')[0]}
                      </span>
                      <span className="font-serif font-bold text-xs text-white">
                        {res.crop_name}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between my-2 border-y border-white/10 py-2">
                      <span className="text-xs text-[#8E929C]">Suitability Score:</span>
                      <span className="font-mono text-xl font-bold text-[#22C55E]">
                        {res.simulated_metrics.overall_suitability_score} <span className="text-xs font-normal text-[#8E929C]">/ 100</span>
                      </span>
                    </div>

                    <div className="space-y-1 font-mono text-[10px] text-stone-300 bg-[#18191E] p-2 border border-white/10 rounded-xs mb-3">
                      <div className="flex justify-between">
                        <span>Precipitation:</span>
                        <strong className="text-white">{res.parameters_applied.adjusted_annual_rainfall_mm} mm ({res.parameters_applied.rainfall_change_pct})</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Mean Temp:</span>
                        <strong className="text-white">{res.parameters_applied.adjusted_mean_temp_c}°C ({res.parameters_applied.temperature_shift_c})</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Sowing Shift:</span>
                        <strong className="text-white">{res.parameters_applied.planting_delay_days}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Water Deficit:</span>
                        <strong className="text-[#22C55E]">{res.simulated_metrics.water_deficit_mm} mm</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Summer Peak Heat:</span>
                        <strong className="text-white">{res.simulated_metrics.peak_summer_temp_c}°C</strong>
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-300 leading-relaxed">
                      <strong className="text-white block mb-0.5">Primary Challenge:</strong>
                      {res.key_management_challenges[0]}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/10 text-[9px] font-mono text-[#8E929C]">
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
