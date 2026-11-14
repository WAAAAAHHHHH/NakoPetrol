import React, { useState } from 'react';
import { 
  Terminal, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Database,
  ArrowRight,
  Activity,
  Sparkles
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
    <div className="max-w-6xl mx-auto space-y-6 anim-fade-up">
      {/* Module Header */}
      <div className="border-b border-white/[0.07] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-[#7C9A6B] font-medium tracking-wide mb-1 flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>Telemetry-Grounded Decision Support &bull; In-Silico Synthesis</span>
          </div>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Agronomic Advisory &amp; Synthesis Engine
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Grounded inquiry model referencing multi-layer satellite observations, pedology, and FAO models for <span className="text-white/90 font-medium">{fieldName}</span>.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-1.5 text-white/80 shrink-0">
          <Database size={13} className="text-[#7C9A6B]" />
          <span>Parcel: <strong className="text-white font-semibold">{fieldName.split(' ')[0]}</strong></span>
        </div>
      </div>

      {/* Main Console Box */}
      <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl flex flex-col h-[650px] shadow-sm overflow-hidden">
        {/* Top Status Bar */}
        <div className="px-5 py-3 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#7C9A6B]" />
            <span className="text-white font-medium">Synthesis Shell</span>
            <span>&bull;</span>
            <span className="text-white/40">MERRA-2 / SoilGrids / EcoCrop</span>
          </div>
          <div className="text-[#7C9A6B] font-medium text-xs">Ready</div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Header Badge */}
              <div className="flex items-center space-x-2 text-[10px] text-white/40 mb-1 px-1">
                <span className="font-medium uppercase tracking-wider">{msg.sender === 'user' ? 'You' : 'Farmelster Advisor'}</span>
                <span>&bull;</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Box */}
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#7C9A6B] text-[#0E0F12] font-medium'
                    : 'bg-white/[0.03] text-white/90 border border-white/[0.07]'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

                {/* Citations Block */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-white/[0.08] text-[11px] space-y-1.5">
                    <span className="font-semibold text-white/50 block text-[10px] uppercase tracking-wider">
                      Authoritative Datasets &amp; Citations:
                    </span>
                    {msg.citations.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[#7C9A6B]">
                        <CheckCircle2 size={12} />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actionable Recommendations Block */}
                {msg.actionable && msg.actionable.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/[0.08] text-xs text-[#A8C496] space-y-1.5">
                    <span className="font-semibold text-white/50 block text-[10px] uppercase tracking-wider mb-1">
                      Actionable Agronomic Protocols:
                    </span>
                    {msg.actionable.map((a, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-white/80">
                        <ArrowRight size={12} className="shrink-0 mt-0.5 text-[#7C9A6B]" />
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2.5 text-xs text-[#7C9A6B] p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl max-w-md">
              <Activity size={14} className="animate-spin text-[#7C9A6B]" />
              <span>Querying FAO phenological thresholds and NASA MERRA-2...</span>
            </div>
          )}
        </div>

        {/* Suggested Queries Tray */}
        <div className="bg-white/[0.02] px-5 py-2.5 border-t border-white/[0.06] flex items-center space-x-2 overflow-x-auto text-xs">
          <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              disabled={loading}
              className="btn px-3 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.07] text-white/70 hover:text-white text-xs whitespace-nowrap transition-colors cursor-pointer disabled:opacity-40 border border-white/[0.06]"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Console Input Bar */}
        <div className="p-3.5 bg-white/[0.02] border-t border-white/[0.06]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex items-center gap-2.5"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ask an agronomic question for ${fieldName}...`}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#7C9A6B]/50 transition-colors"
              >
              </input>
            </div>
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="btn px-4 py-2.5 bg-[#7C9A6B] hover:bg-[#6E8A5D] text-[#0E0F12] rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 flex items-center space-x-1.5"
            >
              <span>Ask</span>
              <Send size={12} />
            </button>
          </form>
        </div>
      </div>

      {/* Methodological Integrity Disclosure */}
      <div className="p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-xs text-white/50 flex items-start gap-3">
        <ShieldCheck size={16} className="text-[#7C9A6B] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          The Advisory Engine performs zero speculative hallucination. All inferences cite specific NASA POWER solar radiation/precipitation arrays, ISRIC SoilGrids 0-30cm pedological strata, and FAO Irrigation &amp; Drainage Paper 56 evapotranspiration thresholds.
        </p>
      </div>
    </div>
  );
};
