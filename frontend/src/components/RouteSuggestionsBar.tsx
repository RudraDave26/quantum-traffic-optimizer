import React from 'react';
import { 
  Zap, 
  Fuel, 
  ShieldCheck, 
  Navigation, 
  Sparkles, 
  ArrowRight,
  Clock,
  Compass,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';
import type { CandidateRoute } from '../types';

interface RouteSuggestionsBarProps {
  candidateRoutes: CandidateRoute[];
  selectedRouteId: string | null;
  onSelectRoute: (id: string) => void;
}

export const RouteSuggestionsBar: React.FC<RouteSuggestionsBarProps> = ({
  candidateRoutes,
  selectedRouteId,
  onSelectRoute
}) => {
  if (!candidateRoutes || candidateRoutes.length === 0) return null;

  // Find category representatives
  const optimalRoute = candidateRoutes.find(r => r.isRecommended) || candidateRoutes[0];
  const fastestRoute = candidateRoutes.find(r => r.isFastest) || candidateRoutes.reduce((a, b) => b.durationMin < a.durationMin ? b : a, candidateRoutes[0]);
  const ecoRoute = candidateRoutes.find(r => r.isEcoFriendly) || candidateRoutes.reduce((a, b) => (b.fuelEstimate?.value || 999) < (a.fuelEstimate?.value || 999) ? b : a, candidateRoutes[0]);
  const safestRoute = candidateRoutes.find(r => r.isSafest) || candidateRoutes.reduce((a, b) => (b.riskScore || 999) < (a.riskScore || 999) ? b : a, candidateRoutes[0]);
  const lowTrafficRoute = candidateRoutes.find(r => r.isLowestTraffic) || candidateRoutes.reduce((a, b) => (b.trafficDelayMin || 0) < (a.trafficDelayMin || 0) ? b : a, candidateRoutes[0]);
  const shortestRoute = candidateRoutes.find(r => r.isShortest) || candidateRoutes.reduce((a, b) => b.distanceKm < a.distanceKm ? b : a, candidateRoutes[0]);

  // Define categorized suggestion cards
  const suggestions = [
    {
      type: 'optimal',
      route: optimalRoute,
      title: 'Q-Route Optimal',
      tagline: 'Best Multi-Cost Balance',
      icon: Sparkles,
      iconColor: 'text-qteal',
      badgeColor: 'bg-qnavy text-white',
      accentBorder: 'border-qblue',
      activeRing: 'ring-2 ring-qnavy shadow-md',
      highlightMetric: `${optimalRoute.qScore}/100`,
      metricLabel: 'Q-Score'
    },
    {
      type: 'fastest',
      route: fastestRoute,
      title: 'Fastest Route',
      tagline: fastestRoute.advantageTag || 'Minimum Travel Time',
      icon: Zap,
      iconColor: 'text-amber-500',
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300',
      accentBorder: 'border-amber-400',
      activeRing: 'ring-2 ring-amber-500 shadow-md',
      highlightMetric: `${fastestRoute.durationMin} min`,
      metricLabel: fastestRoute.trafficDelayMin > 0 ? `+${fastestRoute.trafficDelayMin}m delay` : 'Zero delay'
    },
    {
      type: 'eco_friendly',
      route: ecoRoute,
      title: 'Eco-Friendly',
      tagline: ecoRoute.advantageTag || 'Lowest Fuel / kWh',
      icon: Fuel,
      iconColor: 'text-emerald-500',
      badgeColor: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
      accentBorder: 'border-emerald-400',
      activeRing: 'ring-2 ring-emerald-500 shadow-md',
      highlightMetric: `${ecoRoute.fuelEstimate?.value} ${ecoRoute.fuelEstimate?.unit}`,
      metricLabel: `~${ecoRoute.fuelEstimate?.estimatedCo2Kg} kg CO₂`
    },
    {
      type: 'safest',
      route: safestRoute,
      title: 'Safest Road',
      tagline: safestRoute.advantageTag || 'Lowest Accident Risk',
      icon: ShieldCheck,
      iconColor: 'text-indigo-500',
      badgeColor: 'bg-indigo-100 text-indigo-900 border border-indigo-300',
      accentBorder: 'border-indigo-400',
      activeRing: 'ring-2 ring-indigo-500 shadow-md',
      highlightMetric: `Risk: ${safestRoute.riskScore}/100`,
      metricLabel: safestRoute.riskDetails?.level || 'Low Risk'
    },
    {
      type: 'low_traffic',
      route: lowTrafficRoute,
      title: 'Smooth Flow',
      tagline: lowTrafficRoute.advantageTag || 'Avoids Choke-Points',
      icon: Navigation,
      iconColor: 'text-cyan-500',
      badgeColor: 'bg-cyan-100 text-cyan-900 border border-cyan-300',
      accentBorder: 'border-cyan-400',
      activeRing: 'ring-2 ring-cyan-500 shadow-md',
      highlightMetric: `+${lowTrafficRoute.trafficDelayMin}m`,
      metricLabel: 'Bottleneck Delay'
    },
    {
      type: 'shortest',
      route: shortestRoute,
      title: 'Shortest Distance',
      tagline: shortestRoute.advantageTag || 'Direct Highway Line',
      icon: Compass,
      iconColor: 'text-slate-500',
      badgeColor: 'bg-slate-100 text-slate-800 border border-slate-300',
      accentBorder: 'border-slate-400',
      activeRing: 'ring-2 ring-slate-600 shadow-md',
      highlightMetric: `${shortestRoute.distanceKm} km`,
      metricLabel: 'Road Distance'
    }
  ];

  // Remove duplicates if same route wins multiple categories
  const seenIds = new Set<string>();
  const uniqueSuggestions = suggestions.filter(item => {
    if (!item.route) return false;
    const key = `${item.type}-${item.route.id}`;
    if (seenIds.has(key)) return false;
    seenIds.add(key);
    return true;
  });

  return (
    <div className="bg-white rounded-card p-4 border border-slate-200/90 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-3 gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-qnavy/10 flex items-center justify-center text-qnavy font-bold text-xs">
            🚦
          </div>
          <div>
            <h3 className="text-xs font-bold text-qnavy uppercase tracking-wider">
              Smart Route Alternatives & Suggestions
            </h3>
            <p className="text-[11px] text-text-muted">
              Select any route preference below to view on the map:
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full self-start sm:self-auto border border-emerald-200">
          ⚡ Fastest • 🌿 Eco • 🛡️ Safe • 🚗 Low Traffic
        </span>
      </div>

      {/* Suggestion Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {uniqueSuggestions.map(item => {
          const isSelected = item.route.id === selectedRouteId;
          const Icon = item.icon;

          return (
            <button
              key={`${item.type}-${item.route.id}`}
              onClick={() => onSelectRoute(item.route.id)}
              className={`p-2.5 rounded-xl border text-left transition-smooth relative flex flex-col justify-between ${
                isSelected
                  ? `bg-slate-50 ${item.accentBorder} ${item.activeRing}`
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className="flex items-center space-x-1.5 truncate">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${item.iconColor}`} />
                  <span className="text-xs font-bold text-text-main truncate">
                    {item.title}
                  </span>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-qnavy shrink-0" />
                )}
              </div>

              {/* Main Metric */}
              <div className="my-1">
                <div className="text-sm font-extrabold text-qnavy font-mono">
                  {item.highlightMetric}
                </div>
                <div className="text-[9px] text-text-muted truncate">
                  {item.metricLabel}
                </div>
              </div>

              {/* In-Between Places snippet */}
              {item.route.intermediatePlaces && item.route.intermediatePlaces.length > 0 && (
                <div className="text-[9px] text-slate-600 font-medium truncate my-1 flex items-center space-x-1" title={item.route.intermediatePlaces.map(p => p.name).join(' → ')}>
                  <span className="text-qteal font-bold shrink-0">via</span>
                  <span className="truncate">
                    {item.route.intermediatePlaces.slice(0, 2).map(p => p.name.split('/')[0].split('(')[0].trim()).join(', ')}
                    {item.route.intermediatePlaces.length > 2 ? ` +${item.route.intermediatePlaces.length - 2}` : ''}
                  </span>
                </div>
              )}

              {/* Advantage Tagline */}
              <div className="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between text-[9px] text-text-light">
                <span className="truncate">{item.route.durationMin}m ({item.route.distanceKm}km)</span>
                <ArrowRight className="w-2.5 h-2.5 shrink-0 ml-1 text-slate-400" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
