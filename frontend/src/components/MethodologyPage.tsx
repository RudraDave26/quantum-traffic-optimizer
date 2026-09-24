import React from 'react';
import { 
  Cpu, 
  ArrowRight, 
  Layers, 
  GitBranch, 
  Sparkles, 
  CheckCircle2, 
  Info,
  ShieldCheck,
  RefreshCw,
  Compass
} from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  const pipelineSteps = [
    {
      step: '01',
      title: 'DATA',
      desc: 'Ingests real-time traffic speeds, road network topology, and historical corridor risk metrics.',
      color: 'bg-qblue text-white'
    },
    {
      step: '02',
      title: 'ROAD GRAPH',
      desc: 'Constructs directed weighted graph representation using OpenStreetMap vector nodes.',
      color: 'bg-qnavy text-white'
    },
    {
      step: '03',
      title: 'TRAFFIC ANALYSIS',
      desc: 'Detects active bottlenecks, delay penalties (+min), and queue build-up on arterial corridors.',
      color: 'bg-qorange-dark text-white'
    },
    {
      step: '04',
      title: 'CANDIDATE ROUTES',
      desc: 'Generates diverse Pareto-diverse path corridors avoiding single-point corridor failure.',
      color: 'bg-qteal text-white'
    },
    {
      step: '05',
      title: 'METAHEURISTIC SEARCH',
      desc: 'Establishes candidate solution vector space across multiple competing constraints.',
      color: 'bg-qlavender text-qnavy'
    },
    {
      step: '06',
      title: 'QUANTUM-INSPIRED OPTIMIZATION',
      desc: 'Explores route configurations using probabilistic Q-bit registers and quantum rotation gates.',
      color: 'bg-qnavy text-white'
    },
    {
      step: '07',
      title: 'BEST ROUTE',
      desc: 'Selects the candidate with lowest composite cost vector matching user preferences.',
      color: 'bg-emerald-600 text-white'
    },
    {
      step: '08',
      title: 'LIVE RE-EVALUATION',
      desc: 'Continuously monitors corridor flow and automatically flags rerouting when conditions shift.',
      color: 'bg-qblue text-white'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-qnavy">Optimization Methodology & Mathematical Framework</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Architecture of the Classical Quantum-Inspired Evolutionary Routing Algorithm (Q-Route QEA).
          </p>
        </div>
        <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-qblue/15 text-qnavy border border-qblue/30 font-semibold">
          Classical QEA Engine
        </span>
      </div>

      {/* Prominent Classical Hardware Clarification Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-slate-50 to-teal-50 border border-qblue/30 shadow-soft-sm flex items-start space-x-3">
        <Sparkles className="w-5 h-5 text-qblue shrink-0 mt-0.5" />
        <div>
          <h3 className="text-xs font-bold text-qnavy uppercase tracking-wide">
            Quantum-Inspired Classical Implementation
          </h3>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            "Quantum-inspired optimization concepts are implemented on a classical computer to explore multiple routing solutions." 
            Q-Route simulates quantum superposition principles using probabilistic Q-bit vectors and rotation gates to efficiently avoid local minima without requiring cryogenically cooled physical quantum hardware.
          </p>
        </div>
      </div>

      {/* Visual Step-by-Step Pipeline */}
      <div className="bg-white rounded-card p-6 border border-slate-200/90 shadow-soft">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-qnavy">End-to-End Optimization Pipeline</h3>
          <span className="text-[11px] text-text-light font-mono">8 Sequential Stages</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pipelineSteps.map((s, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-smooth relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}>
                    Stage {s.step}
                  </span>
                  {idx < pipelineSteps.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 hidden lg:block" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-text-main tracking-wide uppercase mt-1">
                  {s.title}
                </h4>
                <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mathematical Principles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Multi-Objective Cost Formula */}
        <div className="bg-white rounded-card p-5 border border-slate-200/90 shadow-soft">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 mb-3">
            <Layers className="w-4 h-4 text-qnavy" />
            <h3 className="text-xs font-bold text-qnavy uppercase tracking-wider">
              1. Multi-Objective Composite Cost Objective
            </h3>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-qnavy leading-relaxed mb-3">
            Total Cost C(r) = w₁·Time + w₂·Traffic + w₃·Fuel + w₄·Risk + w₅·Distance
          </div>

          <p className="text-xs text-text-muted leading-relaxed mb-3">
            Where each parameter is normalized against the candidate spectrum [0, 1]. Unlike traditional shortest-path engines that optimize purely for static distance, Q-Route evaluates the true thermodynamic and temporal cost of transit.
          </p>

          <div className="space-y-1.5 text-[11px] text-text-muted">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <strong className="text-text-main">Balanced Mode:</strong>
              <span>w₁=0.35, w₂=0.25, w₃=0.20, w₄=0.10, w₅=0.10</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <strong className="text-text-main">Fuel Efficient:</strong>
              <span>w₁=0.15, w₂=0.20, w₃=0.50, w₄=0.05, w₅=0.10</span>
            </div>
            <div className="flex justify-between py-1">
              <strong className="text-text-main">Low Traffic:</strong>
              <span>w₁=0.25, w₂=0.50, w₃=0.15, w₄=0.05, w₅=0.05</span>
            </div>
          </div>
        </div>

        {/* Card 2: Quantum-Inspired Q-Bit State Vectors */}
        <div className="bg-white rounded-card p-5 border border-slate-200/90 shadow-soft">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 mb-3">
            <Cpu className="w-4 h-4 text-qteal" />
            <h3 className="text-xs font-bold text-qnavy uppercase tracking-wider">
              2. Q-Bit State Vectors & Rotation Gates
            </h3>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-qnavy leading-relaxed mb-3">
            |ψ⟩ = α|0⟩ + β|1⟩, &nbsp; where |α|² + |β|² = 1
          </div>

          <p className="text-xs text-text-muted leading-relaxed mb-3">
            Each candidate choice is mapped to an N-qubit probabilistic register. The probability of measuring state |1⟩ equals |β|².
          </p>

          <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-qnavy leading-relaxed">
            <strong className="font-semibold text-qnavy">Quantum Rotation Update:</strong>
            <p className="text-[11px] text-text-muted mt-1 font-mono">
              [α' , β']ᵀ = [cos(Δθ) -sin(Δθ); sin(Δθ) cos(Δθ)] · [α , β]ᵀ
            </p>
            <p className="text-[10px] text-text-light mt-1">
              Qubits gradually rotate toward Pareto-optimal states while maintaining exploratory superposition entropy to escape local congestion traps.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
