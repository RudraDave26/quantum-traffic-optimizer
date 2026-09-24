import React from 'react';
import { 
  Check, 
  Clock, 
  Fuel, 
  AlertCircle, 
  ShieldCheck, 
  Award, 
  ArrowUpRight,
  TrendingDown,
  Zap,
  Navigation,
  Compass,
  Sparkles,
  MapPin
} from 'lucide-react';
import type { CandidateRoute } from '../types';

interface RouteComparisonProps {
  candidateRoutes: CandidateRoute[];
  selectedRouteId: string | null;
  onSelectRoute: (id: string) => void;
}

export const RouteComparison: React.FC<RouteComparisonProps> = ({
  candidateRoutes,
  selectedRouteId,
  onSelectRoute
}) => {
  if (!candidateRoutes || candidateRoutes.length === 0) return null;

  return (
    <div className="bg-white rounded-card p-5 border border-slate-200/90 shadow-soft">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <h3 className="text-sm font-bold text-qnavy">All Suggested Route Alternatives</h3>
          <p className="text-[11px] text-text-muted">
            Fastest, Eco-Friendly, Safest, Low-Traffic & Quantum-Optimized trajectories
          </p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-qteal/15 text-qnavy border border-qteal/30">
          {candidateRoutes.length} Diverse Options
        </span>
      </div>

      <div className="space-y-3">
        {candidateRoutes.map((route, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isSelected = route.id === selectedRouteId;
          const isRecommended = route.isRecommended;

          // Traffic condition tag colors
          const trafficBadgeClass = 
            route.trafficCondition === 'Low'
              ? 'bg-qgreen/20 text-emerald-800 border-qgreen/40'
              : route.trafficCondition === 'Moderate'
              ? 'bg-qorange/20 text-qorange-dark border-qorange/40'
              : 'bg-qred/20 text-qred-dark border-qred/40';

          // Specific Category Badge & Icon
          const getCategoryBadge = () => {
            if (isRecommended) {
              return (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-qnavy text-white flex items-center space-x-1 shadow-soft-sm">
                  <Sparkles className="w-3 h-3 text-qteal" />
                  <span>⚛️ Q-ROUTE OPTIMAL</span>
                </span>
              );
            }
            if (route.isFastest) {
              return (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-amber-600" />
                  <span>⚡ FASTEST ROUTE</span>
                </span>
              );
            }
            if (route.isEcoFriendly) {
              return (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center space-x-1">
                  <Fuel className="w-3 h-3 text-emerald-600" />
                  <span>🌿 MOST FUEL-EFFICIENT</span>
                </span>
              );
            }
            if (route.isSafest) {
              return (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-indigo-600" />
                  <span>🛡️ SAFEST ROAD</span>
                </span>
              );
            }
            if (route.isLowestTraffic) {
              return (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300 flex items-center space-x-1">
                  <Navigation className="w-3 h-3 text-cyan-600" />
                  <span>🚗 SMOOTH TRAFFIC</span>
                </span>
              );
            }
            if (route.isShortest) {
              return (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300 flex items-center space-x-1">
                  <Compass className="w-3 h-3 text-slate-600" />
                  <span>📏 SHORTEST DISTANCE</span>
                </span>
              );
            }
            return (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-text-muted">
                {route.badge || 'Alternative'}
              </span>
            );
          };

          return (
            <div
              key={route.id}
              onClick={() => onSelectRoute(route.id)}
              className={`p-4 rounded-2xl border transition-smooth cursor-pointer relative ${
                isRecommended
                  ? 'border-qblue/60 bg-gradient-to-r from-blue-50/40 via-white to-teal-50/20 shadow-soft'
                  : isSelected
                  ? 'border-qnavy bg-slate-50 shadow-soft-sm ring-1 ring-qnavy'
                  : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isRecommended ? 'bg-qnavy text-white' : 'bg-slate-200 text-text-main'
                  }`}>
                    {letter}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-text-main flex items-center space-x-1.5">
                      <span>{route.name}</span>
                    </h4>
                    {route.advantageTag && (
                      <span className="text-[10px] font-semibold text-emerald-700 block">
                        ✨ {route.advantageTag}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  {getCategoryBadge()}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3 py-2.5 px-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                {/* Duration & Traffic ETA */}
                <div>
                  <span className="text-[10px] font-medium text-text-light block">Traffic ETA</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-sm font-bold text-qnavy">{route.durationMin} min</span>
                    {route.trafficDelayMin > 0 ? (
                      <span className="text-[10px] font-semibold text-rose-500">
                        (+{route.trafficDelayMin}m)
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-emerald-600">
                        (On-time)
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-text-light">
                    Normal: {route.staticDurationMin} min
                  </span>
                </div>

                {/* Road Distance */}
                <div>
                  <span className="text-[10px] font-medium text-text-light block">Distance</span>
                  <span className="text-sm font-bold text-text-main">{route.distanceKm} km</span>
                  <span className="text-[9px] text-text-light block">Highway Network</span>
                </div>

                {/* Fuel / Energy Consumption */}
                <div>
                  <span className="text-[10px] font-medium text-text-light block">
                    {route.fuelEstimate?.unit === 'kWh' ? 'Energy Est.' : 'Fuel Est.'}
                  </span>
                  <span className="text-sm font-bold text-text-main">
                    {route.fuelEstimate?.value} {route.fuelEstimate?.unit}
                  </span>
                  <span className="text-[9px] text-text-light block">
                    ~{route.fuelEstimate?.estimatedCo2Kg} kg CO₂
                  </span>
                </div>

                {/* Q-Score & Traffic Status */}
                <div>
                  <span className="text-[10px] font-medium text-text-light block">Q-Score / Safety</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-bold text-qnavy font-mono">
                      {route.qScore}/100
                    </span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${trafficBadgeClass}`}>
                      {route.trafficCondition}
                    </span>
                  </div>
                  <span className="text-[9px] text-text-light block">
                    Risk Score: {route.riskScore}/100
                  </span>
                </div>
              </div>

              {/* In-Between Places along this Route */}
              {route.intermediatePlaces && route.intermediatePlaces.length > 0 && (
                <div className="my-2.5 pt-2 pb-1 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-qteal" />
                      <span>In-Between Places ({route.intermediatePlaces.length} Waypoints)</span>
                    </span>
                    <span className="text-slate-400 font-normal lowercase">corridor milestones</span>
                  </div>
                  <div className="flex items-center flex-wrap gap-1.5">
                    {route.intermediatePlaces.map((wp, wIdx) => (
                      <div
                        key={wp.id || wIdx}
                        className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200/80 text-[11px] text-text-main transition-smooth"
                        title={`${wp.name}: ${wp.type || 'Waystation'} (+${wp.kmFromOrigin} km, ~${wp.etaMinutes} min) • Traffic: ${wp.trafficStatus || 'Clear'}`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full bg-qnavy text-white text-[8px] font-bold flex items-center justify-center shrink-0">
                          {wp.stepNumber}
                        </span>
                        <span className="font-semibold text-text-main">{wp.name}</span>
                        <span className="text-[9px] text-text-light">
                          (+{wp.kmFromOrigin}km)
                        </span>
                        {wp.trafficStatus === 'Heavy' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" title="Heavy Traffic" />
                        )}
                        {wp.trafficStatus === 'Moderate' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" title="Moderate Traffic" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rationale explanation & Action */}
              <div className="flex items-center justify-between pt-1">
                <p className="text-[11px] text-text-muted leading-relaxed pr-2 italic">
                  "{route.whyThisRoute}"
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRoute(route.id);
                  }}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg shrink-0 flex items-center space-x-1 transition-smooth ${
                    isSelected
                      ? 'bg-qnavy text-white'
                      : 'bg-white border border-slate-200 text-qnavy hover:bg-slate-100'
                  }`}
                >
                  <span>{isSelected ? 'Selected' : 'View on Map'}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
