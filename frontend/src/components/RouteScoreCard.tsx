import { Award, Info, Sparkles, ShieldCheck, MapPin } from 'lucide-react';
import type { CandidateRoute } from '../types';

interface RouteScoreCardProps {
  route: CandidateRoute | null;
  routingMode: string;
}

export const RouteScoreCard: React.FC<RouteScoreCardProps> = ({ route, routingMode }) => {
  if (!route) return null;

  const score = route.qScore || 92;
  const breakdown = route.breakdownPercent || {
    travelTime: 35,
    traffic: 25,
    fuel: 20,
    distance: 10,
    risk: 10
  };

  const bars = [
    { label: 'Travel Time Optimization', value: breakdown.travelTime, color: 'bg-qnavy', textColor: 'text-qnavy' },
    { label: 'Traffic Bottleneck Avoidance', value: breakdown.traffic, color: 'bg-qblue', textColor: 'text-qblue-dark' },
    { label: 'Fuel / Energy Efficiency', value: breakdown.fuel, color: 'bg-qteal', textColor: 'text-teal-700' },
    { label: 'Distance Traveled Factor', value: breakdown.distance, color: 'bg-qorange', textColor: 'text-qorange-dark' },
    { label: 'Historical Road Risk Factor', value: breakdown.risk, color: 'bg-qlavender', textColor: 'text-purple-700' }
  ];

  return (
    <div className="bg-white rounded-card p-5 border border-slate-200/90 shadow-soft">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <h3 className="text-sm font-bold text-qnavy">Q-Route Multi-Criteria Score</h3>
          <p className="text-[11px] text-text-muted">Pareto optimality breakdown for selected candidate</p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-text-muted border border-slate-200">
          Preference: {routingMode.toUpperCase()}
        </span>
      </div>

      {/* Hero Score Badge */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/20 to-teal-50/20 border border-slate-200/80 mb-5">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-text-light block">
            Composite Optimization Index
          </span>
          <div className="flex items-baseline space-x-1.5 mt-0.5">
            <span className="text-3xl font-extrabold text-qnavy tracking-tight">{score}</span>
            <span className="text-sm font-semibold text-text-light">/ 100</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold flex items-center space-x-1 mt-1">
            <Sparkles className="w-3 h-3 text-qteal" />
            <span>Optimal balance found in classical QEA search</span>
          </span>
        </div>

        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="26"
              stroke="#E2E8F0"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="32"
              cy="32"
              r="26"
              stroke="#163B63"
              strokeWidth="5"
              strokeDasharray={163.3}
              strokeDashoffset={163.3 - (163.3 * score) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Award className="w-6 h-6 text-qteal" />
          </div>
        </div>
      </div>

      {/* Horizontal Breakdown Bars */}
      <div className="space-y-3 mb-4">
        {bars.map((bar, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-medium text-text-main">{bar.label}</span>
              <span className={`font-mono font-bold ${bar.textColor}`}>{bar.value}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`${bar.color} h-full rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${Math.min(100, Math.max(5, bar.value))}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Guidance Note */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-2 text-[11px] text-text-muted mb-4">
        <Info className="w-4 h-4 text-qblue shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-text-main">Objective:</strong> "Lower total route cost = better candidate." Cost incorporates live congestion delays, vehicle kinetic friction, and historical safety blackspots.
        </p>
      </div>

      {/* In-Between Places / Waypoints Corridor Timeline */}
      {route.intermediatePlaces && route.intermediatePlaces.length > 0 && (
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-qteal" />
              <h4 className="text-xs font-bold text-qnavy uppercase tracking-wider">
                In-Between Route Waypoints
              </h4>
            </div>
            <span className="text-[10px] font-semibold text-qteal bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              {route.intermediatePlaces.length} Stops Along Route
            </span>
          </div>

          <div className="space-y-2 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {route.intermediatePlaces.map((wp, idx) => (
              <div key={wp.id || idx} className="relative flex items-start space-x-3 pl-0.5">
                <span className="w-5 h-5 rounded-full bg-qnavy text-white text-[9px] font-bold flex items-center justify-center shrink-0 z-10 shadow-sm border border-white">
                  {wp.stepNumber}
                </span>
                <div className="flex-1 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 hover:bg-blue-50/40 transition-smooth">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-main">{wp.name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      wp.trafficStatus === 'Heavy' ? 'bg-red-100 text-red-700' :
                      wp.trafficStatus === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {wp.trafficStatus || 'Clear'}
                    </span>
                  </div>
                  <div className="text-[10px] text-text-muted mt-1 flex items-center justify-between">
                    <span className="truncate">{wp.type || wp.highwayTag || 'Highway Corridor'}</span>
                    <span className="font-mono text-qnavy font-semibold shrink-0 ml-1">
                      +{wp.kmFromOrigin} km • ~{wp.etaMinutes}m
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
