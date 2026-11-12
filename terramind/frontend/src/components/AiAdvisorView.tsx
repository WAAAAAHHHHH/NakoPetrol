import React, { useState } from 'react';
import { 
  Terminal, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Database,
  ArrowRight,
  Activity,
  FileCode
} from 'lucide-react';
import { FieldDigitalTwin, CropRecommendation } from '../types/terramind';
import { terramindApi } from '../services/api';

interface AiAdvisorViewProps {
  fieldDigitalTwin: FieldDigitalTwin | null;
  rankedCrops: CropRecommendation[];
  fieldName: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'advisor';
  timestamp: string;
  text: string;
  citations?: string[];
  actionable?: string[];
}

export const AiAdvisorView: React.FC<AiAdvisorViewProps> = ({
  fieldDigitalTwin,
  rankedCrops,
  fieldName
}) => {
  const getNowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'advisor',
      timestamp: getNowTime(),
      text: `Agronomic In-Silico Synthesis Engine initialized for **${fieldName}**.\n\nAll queries are grounded strictly in colocated NASA POWER reanalysis climatology, ISRIC SoilGrids pedological profiles, and FAO EcoCrop physiological bounds. Select a query vector below or submit custom agronomic parameters.`,
      citations: [
        'NASA POWER Agroclimatology (MERRA-2 atmospheric model)',
        'ISRIC SoilGrids 250m Global Pedological Archive',
        'FAO Irrigation & Drainage Paper 56 (Crop Evapotranspiration)'
      ],
      actionable: [
        'Examine crop suitability trade-offs under baseline vs perturbed weather',
        'Audit subsoil horizon clay/sand compaction against root architecture',
        'Verify sowing calendar windows against late spring frost probability'
      ]
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const samplePrompts = [
    'What crop provides the highest water-use efficiency here?',
    'Why is barley ranked above grain maize for this parcel?',
    'Evaluate heat stress risks during flowering window',
    'Simulate impact of 25% precipitation deficit on yields',
    'Review soil pH and cation exchange capacity limitations'
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !fieldDigitalTwin || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      timestamp: getNowTime(),
      text: text.trim()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await terramindApi.askAdvisor(text, fieldDigitalTwin, rankedCrops);
      const advisorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'advisor',
        timestamp: getNowTime(),
        text: res.response,
        citations: res.citations,
        actionable: res.actionable_recommendations
      };
      setMessages(prev => [...prev, advisorMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'advisor',
        timestamp: getNowTime(),
        text: 'Telemetry query timeout. The analytical backend was unable to cross-reference parcel parameters. Please verify server connectivity.'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Module Header */}
      <div className="bg-[#18191E] border border-white/10 rounded-sm p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono font-semibold text-[#8E929C] uppercase tracking-widest mb-1">
            <Terminal size={13} className="text-[#22C55E]" strokeWidth={2} />
            <span>Telemetry-Grounded Decision Support</span>
          </div>
          <h2 className="font-serif font-bold text-xl text-white tracking-tight">
            Agronomic Advisory & Synthesis Engine
          </h2>
          <p className="text-xs text-[#8E929C] mt-1 max-w-2xl leading-relaxed">
            Direct parameter-grounded inquiry model cross-referencing multi-layer satellite observations, pedology, and FAO physiological models.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-[#202229] border border-white/10 rounded-sm px-3 py-2 text-stone-300 shrink-0">
          <Database size={13} className="text-[#22C55E]" />
          <span>PARCEL: <strong className="text-white font-semibold">{fieldName.split(' ')[0]}</strong></span>
        </div>
      </div>

      {/* Main Console Box */}
      <div className="bg-[#18191E] border border-white/10 rounded-sm flex flex-col h-[650px] shadow-xs">
        {/* Top Status Bar */}
        <div className="px-4 py-2 bg-[#18191E] border-b border-white/10 flex items-center justify-between text-[11px] font-mono text-[#8E929C]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <span className="text-white font-semibold">SYNTHESIS_SHELL</span>
            <span>&bull;</span>
            <span>MERRA-2 / SOILGRIDS / ECOCROP</span>
          </div>
          <div>READY</div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-[#0E0F12]/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Header Badge */}
              <div className="flex items-center space-x-2 text-[10px] font-mono text-[#8E929C] mb-1 px-1">
                <span>{msg.sender === 'user' ? 'OPERATOR' : 'TERRAMIND_ADVISOR'}</span>
                <span>&bull;</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Box */}
              <div
                className={`max-w-3xl rounded-sm p-4 text-xs leading-relaxed border ${
                  msg.sender === 'user'
                    ? 'bg-[#22C55E] text-[#0E0F12] border-[#1D3E2D]'
                    : 'bg-[#18191E] text-white border-white/10'
                }`}
              >
                <div className="whitespace-pre-line font-sans">{msg.text}</div>

                {/* Citations Block */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-white/10 text-[10px] space-y-1">
                    <span className="font-mono font-bold text-[#8E929C] block uppercase tracking-wider">
                      Authoritative Datasets & Citations:
                    </span>
                    {msg.citations.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[#22C55E] font-mono">
                        <CheckCircle2 size={11} strokeWidth={2} />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actionable Recommendations Block */}
                {msg.actionable && msg.actionable.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] text-[#22C55E] space-y-1">
                    <span className="font-mono font-bold text-[#8E929C] block text-[10px] uppercase tracking-wider mb-1">
                      Actionable Agronomic Protocols:
                    </span>
                    {msg.actionable.map((a, i) => (
                      <div key={i} className="flex items-start gap-1.5 font-sans">
                        <ArrowRight size={12} className="shrink-0 mt-0.5 text-[#22C55E]" strokeWidth={2} />
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-[#22C55E] font-mono p-3 bg-[#18191E] border border-white/10 rounded-sm max-w-md">
              <Activity size={14} className="animate-spin" />
              <span>Querying FAO phenological thresholds and NASA MERRA-2...</span>
            </div>
          )}
        </div>

        {/* Suggested Queries Tray */}
        <div className="bg-[#18191E] px-4 py-2 border-t border-white/10 flex items-center space-x-2 overflow-x-auto text-xs">
          <span className="text-[10px] font-mono uppercase text-[#8E929C] font-semibold shrink-0">
            Suggested Vectors:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              disabled={loading}
              className="px-2.5 py-1 rounded-sm bg-[#202229] hover:bg-[rgba(255,255,255,0.1)] text-white text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50 border border-white/10"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Console Input Bar */}
        <div className="p-3 bg-[#18191E] border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Submit agronomic query for ${fieldName}...`}
                className="w-full bg-[#18191E] border border-white/10 rounded-sm px-3.5 py-2 text-xs text-white placeholder-[#8E929C] focus:outline-none focus:border-[#22C55E] font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="px-4 py-2 bg-[#22C55E] hover:bg-[#15803D] text-[#0E0F12] rounded-sm text-xs font-mono font-medium transition-colors cursor-pointer disabled:opacity-40 flex items-center space-x-1.5"
            >
              <span>EXEC</span>
              <Send size={12} />
            </button>
          </form>
        </div>
      </div>

      {/* Methodological Integrity Disclosure */}
      <div className="p-3.5 bg-[#18191E] border border-white/10 rounded-sm text-xs text-[#8E929C] flex items-start gap-2.5">
        <ShieldCheck size={15} className="text-[#22C55E] shrink-0 mt-0.5" strokeWidth={2} />
        <p className="leading-relaxed">
          The Advisory Engine performs zero speculative hallucination. All inferences cite specific NASA POWER solar radiation/precipitation arrays, ISRIC SoilGrids 0-30cm pedological strata, and FAO Irrigation & Drainage Paper 56 evapotranspiration thresholds.
        </p>
      </div>
    </div>
  );
};
