import React, { useState, useEffect } from 'react';
import {
  Compass,
  MapPin,
  Sprout,
  Layers,
  Calendar,
  Satellite,
  Sliders,
  FileText,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { FarmelsterTab } from './EarthEyeHeader';

interface TutorialTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: FarmelsterTab;
  setActiveTab: (tab: FarmelsterTab) => void;
  onOpenDossier?: () => void;
}

interface TourStep {
  tab?: FarmelsterTab;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  actionHint?: string;
}

export const TutorialTourModal: React.FC<TutorialTourModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onOpenDossier
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps: TourStep[] = [
    {
      tab: 'dashboard',
      badge: 'Welcome to Farmelster',
      title: 'Global Earth Observation Platform',
      highlight: 'Built for NASA Space Apps Challenge 2026',
      description:
        'Farmelster bridges NASA POWER MERRA-2 agroclimatology, ISRIC SoilGrids 250m resolution, and Sentinel-2 optical imagery to empower sustainable farming decisions worldwide.',
      icon: <Sparkles size={24} className="text-[#A8C496]" />,
      iconBg: 'bg-[#7C9A6B]/20 border-[#7C9A6B]/40',
      actionHint: 'Take a quick 1-minute tour of the key features, or skip directly to explore.'
    },
    {
      tab: 'dashboard',
      badge: 'Step 1 of 6 • Dashboard & Map',
      title: 'Interactive Map & Global Parcels',
      highlight: 'Click anywhere on Earth or select demo fields',
      description:
        'Select pre-analyzed agricultural regions (Konya, Thrace, Çukurova, Bordeaux) or click anywhere on the global map to create a custom polygon. Our deterministic spatial classifier even identifies open ocean vs. arable land!',
      icon: <MapPin size={24} className="text-[#7C9A6B]" />,
      iconBg: 'bg-[#7C9A6B]/15 border-[#7C9A6B]/30',
      actionHint: 'Notice the map and satellite layers in the main dashboard view.'
    },
    {
      tab: 'crops',
      badge: 'Step 2 of 6 • Crop Planning',
      title: 'Scientific Crop Suitability Scoring',
      highlight: 'Multi-Attribute Utility Theory (MAUT)',
      description:
        'Evaluates 11 core crops (Wheat, Cotton, Olives, Chickpea, Soybeans, etc.) against local temperature curves, precipitation, soil constraints, and climate risks with weighted agronomic scoring.',
      icon: <Sprout size={24} className="text-emerald-400" />,
      iconBg: 'bg-emerald-500/15 border-emerald-500/30',
      actionHint: 'Switch to Crop Planning to see ranked suitability percentages.'
    },
    {
      tab: 'soil',
      badge: 'Step 3 of 6 • Soil Intelligence',
      title: 'ISRIC SoilGrids Physical Profile',
      highlight: '250m resolution down to 200cm depth',
      description:
        'Accurate soil data for your exact field coordinates: pH levels, USDA soil texture triangle (clay, sand, silt), cation exchange capacity (CEC), bulk density, and soil organic carbon.',
      icon: <Layers size={24} className="text-amber-400" />,
      iconBg: 'bg-amber-500/15 border-amber-500/30',
      actionHint: 'Explore soil horizon depths and salinity risks.'
    },
    {
      tab: 'calendar',
      badge: 'Step 4 of 6 • Planting Calendar',
      title: 'Phenological Sowing & Harvest Windows',
      highlight: 'Thermal Growing Degree Days & Frost Safety',
      description:
        'Calculates optimal sowing, vegetative growth, flowering, and harvest dates tailored to local frost-free intervals and base temperatures. Never plant too early or harvest too late!',
      icon: <Calendar size={24} className="text-sky-400" />,
      iconBg: 'bg-sky-500/15 border-sky-500/30',
      actionHint: 'Select any crop to see its month-by-month phenological progression.'
    },
    {
      tab: 'satellite',
      badge: 'Step 5 of 6 • Remote Sensing',
      title: 'Sentinel-2 & MODIS Vegetation Index',
      highlight: 'NDVI = (NIR - Red) / (NIR + Red)',
      description:
        'Monitor photosynthetic vitality, canopy density, and drought stress with real optical formulas. Open water naturally yields negative spectral values, while dense crops show high green vitality.',
      icon: <Satellite size={24} className="text-purple-400" />,
      iconBg: 'bg-purple-500/15 border-purple-500/30',
      actionHint: 'View NDVI time-series trends and canopy vigor curves.'
    },
    {
      tab: 'scenario',
      badge: 'Step 6 of 6 • Scenario Lab',
      title: 'What-If Climate Simulator & PDF Export',
      highlight: 'Simulate climate shifts (-50% rain, +5°C temp)',
      description:
        'Test farm resilience against climate shocks with custom temperature anomalies, precipitation shifts, and irrigation regimes. When finished, click "Export Dossier" in the top bar for a printable PDF report!',
      icon: <Sliders size={24} className="text-[#A8C496]" />,
      iconBg: 'bg-[#7C9A6B]/20 border-[#7C9A6B]/40',
      actionHint: 'Ready to test climate scenarios and export your field dossier.'
    }
  ];

  // Whenever step changes, switch the active tab to showcase the live view behind the modal
  useEffect(() => {
    if (!isOpen) return;
    const targetTab = steps[currentStep]?.tab;
    if (targetTab && targetTab !== activeTab) {
      setActiveTab(targetTab);
    }
  }, [currentStep, isOpen]);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm anim-fade-in">
      <div className="dark-glass-panel rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-white/[0.12] relative anim-scale-in text-xs overflow-hidden">
        {/* Glow ambient background accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#7C9A6B]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#7C9A6B]">
              <Compass size={16} />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7C9A6B]">
              {step.badge}
            </span>
          </div>

          <button
            onClick={onClose}
            className="btn text-white/40 hover:text-white p-1.5 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Skip / Close tutorial"
            title="Close tour"
          >
            <X size={16} />
          </button>
        </div>

        {/* Step Content */}
        <div className="flex items-start gap-4 mb-5">
          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${step.iconBg} shadow-md`}
          >
            {step.icon}
          </div>

          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {step.title}
            </h2>
            <p className="text-xs font-medium text-[#A8C496] mt-0.5">
              {step.highlight}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/75 text-xs sm:text-sm leading-relaxed mb-4 bg-white/[0.02] p-3.5 rounded-2xl border border-white/[0.05]">
          {step.description}
        </p>

        {/* Hint banner */}
        {step.actionHint && (
          <div className="flex items-center gap-2 text-[11px] text-white/50 mb-5 px-1">
            <CheckCircle2 size={13} className="text-[#7C9A6B] shrink-0" />
            <span>{step.actionHint}</span>
          </div>
        )}

        {/* Step Indicators / Dots */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStep
                    ? 'w-6 bg-[#7C9A6B]'
                    : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                title={`Go to step ${idx + 1}`}
                aria-label={`Step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="btn px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-white/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="btn px-3 py-2 text-white/40 hover:text-white/80 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              Skip Tour
            </button>

            <button
              onClick={handleNext}
              className="btn px-4 py-2 bg-[#7C9A6B] hover:bg-[#6E8A5D] text-[#0E0F12] font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-[#7C9A6B]/20"
            >
              <span>{isLast ? "Let's Explore!" : isFirst ? 'Start Tour' : 'Next'}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

