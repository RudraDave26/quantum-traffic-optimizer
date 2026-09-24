import React from 'react';
import { Database, ShieldCheck, CheckCircle2, AlertCircle, Info, ExternalLink } from 'lucide-react';

export const DataSourcesPage: React.FC = () => {
  const sources = [
    {
      category: 'ROAD NETWORK',
      provider: 'OpenStreetMap (OSM) & CartoDB',
      type: 'GEOSPATIAL TOPOLOGY',
      badge: 'LIVE ROAD GRAPH',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      tag: 'REAL-TIME DATA',
      tagType: 'realtime',
      description: 'Global crowdsourced road vector geometries, lane configurations, turn restrictions, and highway classifications.'
    },
    {
      category: 'TRAFFIC & ROUTING',
      provider: 'Google Maps Routes API (TRAFFIC_AWARE_OPTIMAL) / OSRM',
      type: 'FLOW TELEMETRY',
      badge: 'TRAFFIC_AWARE',
      badgeColor: 'bg-blue-100 text-qnavy border-blue-200',
      tag: 'REAL-TIME DATA',
      tagType: 'realtime',
      description: 'Real-time road transit speeds, choke-point incident detection, and live congestion-aware duration calculation.'
    },
    {
      category: 'ACCIDENT & SAFETY',
      provider: 'MoRTH & Open Government Data (data.gov.in)',
      type: 'SAFETY BLACKSPOTS',
      badge: 'CORRIDOR INDEX',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      tag: 'HISTORICAL DATA',
      tagType: 'historical',
      description: 'Historical multi-year accident statistics, intersection hazard indexes, and high-frequency blackspot classifications.'
    },
    {
      category: 'CORRIDOR DEMO SUITE',
      provider: 'Q-Route High-Fidelity Indian Mobility Generator',
      type: 'TELEMETRY SIMULATOR',
      badge: 'FALLBACK ENGINE',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      tag: 'SIMULATED DATA',
      tagType: 'simulated',
      description: 'High-fidelity simulation model for major Indian corridors (Jaipur-Ajmer, Delhi-Gurgaon, Bengaluru, Mumbai) for offline hackathon evaluations.'
    },
    {
      category: 'ENERGY ESTIMATES',
      provider: 'Empirical Kinetic Friction & Idle Consumption Matrix',
      type: 'PHYSICS VEHICLE MODEL',
      badge: 'CONSUMPTION ESTIMATE',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      tag: 'ESTIMATED DATA',
      tagType: 'estimated',
      description: 'Vehicle class fuel burn rates (L/100km) and EV battery depletion (kWh/100km) modulated by traffic stop-and-go idle friction.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-qnavy">Data Architecture & Integrity Matrix</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Strict separation between Real-Time Data, Historical Benchmarks, Estimated Models, and Simulation fallbacks.
          </p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-qnavy text-white shadow-soft-sm">
          SIH Transparency Standard
        </span>
      </div>

      {/* Distinction Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-card bg-emerald-50/70 border border-emerald-200 shadow-soft-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
            REAL-TIME DATA
          </span>
          <p className="text-xs text-emerald-950 font-semibold mt-1">Live Traffic API & Maps</p>
          <p className="text-[11px] text-emerald-800/80 mt-1 leading-snug">
            Sourced directly from live API responses when credentials and internet connectivity are active.
          </p>
        </div>

        <div className="p-3.5 rounded-card bg-amber-50/70 border border-amber-200 shadow-soft-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
            HISTORICAL DATA
          </span>
          <p className="text-xs text-amber-950 font-semibold mt-1">MoRTH Accident Records</p>
          <p className="text-[11px] text-amber-800/80 mt-1 leading-snug">
            Accident risk indicators derived from published national highway reports; NOT live crash alerts.
          </p>
        </div>

        <div className="p-3.5 rounded-card bg-teal-50/70 border border-teal-200 shadow-soft-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
            ESTIMATED DATA
          </span>
          <p className="text-xs text-teal-950 font-semibold mt-1">Fuel / Energy Physics</p>
          <p className="text-[11px] text-teal-800/80 mt-1 leading-snug">
            Estimated consumption based on vehicle efficiency profile and traffic delay multiplier.
          </p>
        </div>

        <div className="p-3.5 rounded-card bg-purple-50/70 border border-purple-200 shadow-soft-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block">
            SIMULATED DATA
          </span>
          <p className="text-xs text-purple-950 font-semibold mt-1">Demo Traffic Mode</p>
          <p className="text-[11px] text-purple-800/80 mt-1 leading-snug">
            High-fidelity synthetic traffic dynamics used for offline resilience and hackathon demonstrations.
          </p>
        </div>
      </div>

      {/* Detailed Sources Table */}
      <div className="bg-white rounded-card border border-slate-200/90 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-qnavy">Integrated Telemetry Providers</h3>
          <span className="text-[11px] text-text-light font-mono">5 Active Layers</span>
        </div>

        <div className="divide-y divide-slate-100">
          {sources.map((src, idx) => (
            <div key={idx} className="p-4 hover:bg-slate-50/50 transition-smooth">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted px-2 py-0.5 rounded bg-slate-100">
                    {src.category}
                  </span>
                  <h4 className="text-xs font-bold text-text-main">{src.provider}</h4>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${src.badgeColor}`}>
                    {src.badge}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    src.tagType === 'realtime'
                      ? 'bg-emerald-600 text-white'
                      : src.tagType === 'historical'
                      ? 'bg-amber-600 text-white'
                      : src.tagType === 'estimated'
                      ? 'bg-teal-600 text-white'
                      : 'bg-purple-600 text-white'
                  }`}>
                    {src.tag}
                  </span>
                </div>
              </div>

              <p className="text-xs text-text-muted mt-2 leading-relaxed">
                {src.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
