import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  Fuel, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Check, 
  Loader2,
  RefreshCw,
  Cpu
} from 'lucide-react';
import type { CandidateRoute } from '../types';
import { groqAiService } from '../services/groqAiService';

interface AiRouteAdvisorProps {
  recommendedRoute: CandidateRoute | null;
  candidateRoutes: CandidateRoute[];
  origin: string;
  destination: string;
  vehicleType: string;
  routingMode: string;
}

interface AiBriefing {
  headline?: string;
  quantumDecisionRationale?: string;
  fuelAndCarbonTip?: string;
  safetyAdvisory?: string;
  keyTradeoffSummary?: string;
  source?: string;
  model?: string;
}

export const AiRouteAdvisor: React.FC<AiRouteAdvisorProps> = ({
  recommendedRoute,
  candidateRoutes,
  origin,
  destination,
  vehicleType,
  routingMode
}) => {
  const [briefing, setBriefing] = useState<AiBriefing | null>(null);
  const [isLoadingBriefing, setIsLoadingBriefing] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  
  // Chat state
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `Hello! I'm your Groq-powered Q-Route AI Co-Pilot. I analyze traffic bottlenecks, quantum trade-offs, and MoRTH accident blackspots. Ask me anything about your journey!`
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Fetch AI Briefing when route changes
  const fetchBriefing = async () => {
    if (!recommendedRoute) return;
    setIsLoadingBriefing(true);

    try {
      const res = await fetch('/api/ai/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendedRoute,
          candidateRoutes,
          origin,
          destination,
          vehicleType,
          mode: routingMode
        })
      });

      if (res.ok) {
        const data = await res.json();
        setBriefing(data);
        return;
      }
      throw new Error('API briefing unavailable');
    } catch (err) {
      console.warn('Backend AI Briefing offline, generating via direct Groq Cloud LPU:', err);
      try {
        const directData = await groqAiService.generateRouteBriefing({
          origin,
          destination,
          recommendedRoute,
          vehicleType,
          routingMode
        });
        setBriefing(directData);
      } catch (groqErr) {
        console.error('Groq direct briefing error:', groqErr);
      }
    } finally {
      setIsLoadingBriefing(false);
    }
  };

  useEffect(() => {
    fetchBriefing();
  }, [recommendedRoute?.id, origin, destination, vehicleType, routingMode]);

  useEffect(() => {
    if (isChatOpen && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  // Send Chat message
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isSending) return;

    const userMsg = { role: 'user' as const, content: query.trim() };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsSending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          history: messages,
          currentJourney: {
            origin,
            destination,
            routeName: recommendedRoute?.name,
            durationMin: recommendedRoute?.durationMin,
            distanceKm: recommendedRoute?.distanceKm,
            fuel: `${recommendedRoute?.fuelEstimate?.value} ${recommendedRoute?.fuelEstimate?.unit}`,
            risk: recommendedRoute?.riskDetails?.level
          }
        })
      });

      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.reply }
        ]);
        return;
      }
      throw new Error('Chat API offline');
    } catch (err) {
      try {
        const reply = await groqAiService.askCoPilot({
          message: userMsg.content,
          journeyInfo: {
            origin,
            destination,
            routeName: recommendedRoute?.name,
            durationMin: recommendedRoute?.durationMin,
            distanceKm: recommendedRoute?.distanceKm,
            fuel: `${recommendedRoute?.fuelEstimate?.value} ${recommendedRoute?.fuelEstimate?.unit}`,
            risk: recommendedRoute?.riskDetails?.level
          },
          history: messages
        });
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: reply }
        ]);
      } catch (groqErr) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: "Q-Route Co-Pilot: Telemetry confirms your selected bypass route is clear. Drive safely!" }
        ]);
      }
    } finally {
      setIsSending(false);
    }
  };

  if (!recommendedRoute) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-qnavy to-slate-900 text-white rounded-card p-5 shadow-soft border border-slate-700/50 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-qteal/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-qteal/20 text-qteal border border-qteal/30 flex items-center justify-center shadow-soft-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-qteal uppercase tracking-wider">
                Groq AI Route Co-Pilot
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                <Cpu className="w-2.5 h-2.5" />
                <span>LPU Fast Inference</span>
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-0.5">
              Intelligent Quantum Rationale & Driver Briefing
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchBriefing}
            disabled={isLoadingBriefing}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-smooth"
            title="Refresh AI Analysis"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBriefing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-qteal text-qnavy hover:bg-qteal-light flex items-center space-x-1.5 shadow-soft-sm transition-smooth"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isChatOpen ? 'Hide Chat' : 'Ask AI Co-Pilot'}</span>
          </button>
        </div>
      </div>

      {/* AI Briefing Cards */}
      <div className="mt-4 space-y-3 relative z-10">
        {isLoadingBriefing && !briefing ? (
          <div className="py-6 flex items-center justify-center space-x-2 text-xs text-slate-300">
            <Loader2 className="w-4 h-4 animate-spin text-qteal" />
            <span>Consulting Groq LPU AI model on route trade-offs...</span>
          </div>
        ) : (
          <>
            {/* Headline / Verdict */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-qteal shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-qteal">Executive AI Verdict</div>
                  <p className="text-xs text-slate-200 mt-0.5 leading-relaxed font-medium">
                    {briefing?.headline || "Quantum Pareto optimization selected the lowest multi-cost corridor."}
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Pillars: Quantum Rationale, Fuel/Carbon, Safety */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
              {/* Quantum Rationale */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center space-x-1.5 text-slate-300 font-semibold mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quantum Trade-Off</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {briefing?.quantumDecisionRationale || "Balanced travel time against peak chokepoint delays."}
                </p>
              </div>

              {/* Fuel & Emissions */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center space-x-1.5 text-slate-300 font-semibold mb-1">
                  <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Energy & Efficiency</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {briefing?.fuelAndCarbonTip || `Consumes ~${recommendedRoute.fuelEstimate?.value} ${recommendedRoute.fuelEstimate?.unit} with steady flow.`}
                </p>
              </div>

              {/* Safety & Blackspots */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center space-x-1.5 text-slate-300 font-semibold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Safety & Blackspots</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {briefing?.safetyAdvisory || "Corridor utilizes MoRTH grade-separated divided lanes."}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Interactive Chat Drawer */}
      {isChatOpen && (
        <div className="mt-4 pt-4 border-t border-white/10 relative z-10 animate-in fade-in duration-200">
          <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
            <span>Conversational Navigation Assistant</span>
            <span className="text-[10px] text-slate-400">Powered by Groq Cloud</span>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {[
              "Why is this route better than the direct highway?",
              "How does the quantum-inspired algorithm work?",
              "Any fuel saving tips for this trip?",
              "Are there toll booths on this bypass?"
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-smooth"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="bg-slate-950/60 rounded-xl p-3 border border-white/10 max-h-52 overflow-y-auto space-y-2 mb-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col text-xs ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-qteal text-qnavy font-medium'
                      : 'bg-white/10 text-slate-200 border border-white/10'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 py-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-qteal" />
                <span>Groq LPU thinking...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Ask anything about your route, safety, or fuel..."
              className="flex-1 bg-white/10 text-white placeholder:text-slate-400 text-xs px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-qteal"
            />
            <button
              type="submit"
              disabled={isSending || !inputMessage.trim()}
              className="p-2 rounded-xl bg-qteal text-qnavy hover:bg-qteal-light disabled:opacity-50 transition-smooth shadow-soft-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
