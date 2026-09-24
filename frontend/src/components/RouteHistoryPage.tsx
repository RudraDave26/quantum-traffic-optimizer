import React, { useState, useEffect } from 'react';
import { History, Search, Calendar, Car, Zap, Bike, Truck, ArrowRight, Award, Clock } from 'lucide-react';

export const RouteHistoryPage: React.FC = () => {
  const [searches, setSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        setSearches(data.searches || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching history:', err);
        setLoading(false);
      });
  }, []);

  const filtered = searches.filter(s => {
    const q = filterText.toLowerCase();
    return (
      (s.origin || '').toLowerCase().includes(q) ||
      (s.destination || '').toLowerCase().includes(q) ||
      (s.selectedRoute || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-qnavy">Optimization Log & Search History</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Persisted search sessions, evaluated trajectories, and selected optimal paths stored in local SQLite database.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search saved journeys..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-qblue/40 shadow-soft-sm"
          />
        </div>
      </div>

      {/* History List */}
      {loading ? (
        <div className="text-center py-12 text-text-muted text-xs">
          Loading history from SQLite database...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-card p-12 text-center border border-slate-200 shadow-soft">
          <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-text-main">No searches found</h3>
          <p className="text-xs text-text-muted mt-1">Run an optimization from the dashboard to log your first route search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => {
            const dateStr = s.created_at ? new Date(s.created_at).toLocaleString() : 'Recent';
            return (
              <div
                key={s.id}
                className="bg-white p-4 rounded-card border border-slate-200/90 shadow-soft hover:shadow-soft-lg transition-smooth"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-qnavy">{s.origin}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-bold text-qnavy">{s.destination}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-text-muted border border-slate-200">
                      {s.routing_mode || s.routingMode}
                    </span>
                    <span className="text-[10px] text-text-light flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{dateStr}</span>
                    </span>
                  </div>
                </div>

                <div className="text-xs text-text-muted mb-3 flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5 text-qteal shrink-0" />
                  <span className="font-semibold text-text-main">Selected:</span>
                  <span>{s.selected_route || s.selectedRoute}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                  <div>
                    <span className="text-text-light block">Duration</span>
                    <strong className="text-qnavy">{s.duration_min || s.durationMin} min</strong>
                    {s.traffic_delay_min > 0 && (
                      <span className="text-rose-500 ml-1 font-semibold">(+{s.traffic_delay_min}m delay)</span>
                    )}
                  </div>

                  <div>
                    <span className="text-text-light block">Distance</span>
                    <strong className="text-text-main">{s.distance_km || s.distanceKm} km</strong>
                  </div>

                  <div>
                    <span className="text-text-light block">Consumption</span>
                    <strong className="text-text-main">{s.fuel_consumed || s.fuelConsumed} {s.fuel_unit || s.fuelUnit}</strong>
                  </div>

                  <div>
                    <span className="text-text-light block">Q-Score</span>
                    <strong className="text-emerald-700 font-bold font-mono">{s.q_score || s.qScore} / 100</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
