import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Gauge, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Radio, 
  ShieldAlert, 
  ArrowUpRight,
  RefreshCw,
  Zap
} from 'lucide-react';
import type { TrafficStatus } from '../types';

interface LiveTrafficDashboardProps {
  isDemoMode: boolean;
  onTriggerBottleneck: (active: boolean) => void;
  surgeActive: boolean;
}

export const LiveTrafficDashboard: React.FC<LiveTrafficDashboardProps> = ({
  isDemoMode,
  onTriggerBottleneck,
  surgeActive
}) => {
  const [traffic, setTraffic] = useState<TrafficStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(2);

  const fetchTraffic = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/traffic');
      if (res.ok) {
        const data = await res.json();
        setTraffic(data);
        setSecondsAgo(0);
      }
    } catch (err) {
      console.error('Error fetching traffic:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraffic();
    const interval = setInterval(fetchTraffic, 10000); // 10s poll as requested
    const timer = setInterval(() => setSecondsAgo(s => s + 1), 1000);
    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-qnavy">Live Traffic Surveillance & Congestion Monitoring</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE FEED</span>
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Continuous telemetry of arterial highways, choke-point delay indexes, and intersection bottleneck dynamics.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-[11px] text-text-light flex items-center space-x-1 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-soft-sm">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Updated {secondsAgo}s ago</span>
          </div>
          <button
            onClick={fetchTraffic}
            disabled={loading}
            className="p-2 rounded-xl bg-white border border-slate-200 text-qnavy hover:bg-slate-50 transition-smooth shadow-soft-sm"
            title="Refresh traffic telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Card 1: Traffic Condition */}
        <div className="bg-white p-4 rounded-card border border-slate-200/90 shadow-soft">
          <div className="flex items-center justify-between text-text-light mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Current Traffic</span>
            <Activity className="w-4 h-4 text-qnavy" />
          </div>
          <div className="text-lg font-bold text-qnavy mt-1">
            {traffic?.condition || 'Moderate'}
          </div>
          <div className="mt-1 flex items-center space-x-1">
            <span className={`w-2 h-2 rounded-full ${
              traffic?.condition === 'Heavy' ? 'bg-qred' : traffic?.condition === 'Moderate' ? 'bg-qorange' : 'bg-qgreen'
            }`} />
            <span className="text-[10px] text-text-muted">Regional network status</span>
          </div>
        </div>

        {/* Card 2: Average Speed */}
        <div className="bg-white p-4 rounded-card border border-slate-200/90 shadow-soft">
          <div className="flex items-center justify-between text-text-light mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Average Speed</span>
            <Gauge className="w-4 h-4 text-qblue" />
          </div>
          <div className="text-lg font-bold text-qnavy mt-1">
            {traffic?.averageSpeed || '44 km/h'}
          </div>
          <span className="text-[10px] text-text-muted mt-1 block">Arterial corridor flow</span>
        </div>

        {/* Card 3: Congested Segments */}
        <div className="bg-white p-4 rounded-card border border-slate-200/90 shadow-soft">
          <div className="flex items-center justify-between text-text-light mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Congested Segments</span>
            <AlertTriangle className="w-4 h-4 text-qorange-dark" />
          </div>
          <div className="text-lg font-bold text-qnavy mt-1">
            {traffic?.congestedSegmentsCount || 2} Corridors
          </div>
          <span className="text-[10px] text-rose-600 mt-1 block font-medium">Bottlenecks monitored</span>
        </div>

        {/* Card 4: Active Routes Monitored */}
        <div className="bg-white p-4 rounded-card border border-slate-200/90 shadow-soft">
          <div className="flex items-center justify-between text-text-light mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Routes</span>
            <Radio className="w-4 h-4 text-qteal" />
          </div>
          <div className="text-lg font-bold text-qnavy mt-1">
            {traffic?.activeRoutesMonitored || 14} Corridors
          </div>
          <span className="text-[10px] text-text-muted mt-1 block">Telemetry streams</span>
        </div>

        {/* Card 5: Traffic Delay Index */}
        <div className="bg-white p-4 rounded-card border border-slate-200/90 shadow-soft col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-text-light mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Average Delay</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-lg font-bold text-rose-600 mt-1">
            +{traffic?.trafficDelayAvgMin || 6.8} min
          </div>
          <span className="text-[10px] text-text-muted mt-1 block">vs Free-flow baseline</span>
        </div>
      </div>

      {/* Traffic Incidents Feed & Choke Points */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-card p-5 border border-slate-200/90 shadow-soft">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-qnavy" />
              <h3 className="text-sm font-bold text-qnavy">Active Incident & Congestion Feed</h3>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-text-muted">
              Live Indian Corridors
            </span>
          </div>

          <div className="space-y-3">
            {traffic?.incidentFeed?.map(inc => (
              <div
                key={inc.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-smooth flex items-start justify-between"
              >
                <div className="flex items-start space-x-3">
                  <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                    inc.severity === 'High' ? 'bg-qred' : inc.severity === 'Moderate' ? 'bg-qorange' : 'bg-qgreen'
                  }`} />
                  <div>
                    <h4 className="text-xs font-bold text-text-main">{inc.location}</h4>
                    <p className="text-[11px] text-text-muted mt-0.5">{inc.type}</p>
                    <span className="text-[10px] text-text-light mt-1 block">Reported at {inc.timestamp}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                    inc.severity === 'High' 
                      ? 'bg-rose-100 text-rose-700' 
                      : inc.severity === 'Moderate' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {inc.delay}
                  </span>
                  <span className="text-[10px] text-text-light block mt-1">Severity: {inc.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Traffic Legend & Demo Trigger */}
        <div className="space-y-4">
          <div className="bg-white rounded-card p-5 border border-slate-200/90 shadow-soft">
            <h3 className="text-xs font-bold text-qnavy uppercase tracking-wider mb-3">
              Traffic Status Legend
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-qgreen" />
                  <span className="font-semibold text-emerald-900">Low Traffic</span>
                </div>
                <span className="text-[11px] text-emerald-700">Delay &lt; 3 min</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-100">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-qorange" />
                  <span className="font-semibold text-amber-900">Moderate Traffic</span>
                </div>
                <span className="text-[11px] text-amber-700">Delay 4 - 10 min</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50 border border-rose-100">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-qred" />
                  <span className="font-semibold text-rose-900">Heavy Traffic</span>
                </div>
                <span className="text-[11px] text-rose-700">Delay &gt; 10 min</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-text-light">
              <p>Telemetry updates every 10 seconds. In absence of active enterprise Google Routes quota, Demo Traffic Mode provides continuous simulation.</p>
            </div>
          </div>

          {/* Hackathon Live Simulator Card */}
          <div className="bg-gradient-to-br from-qnavy to-qnavy-dark text-white rounded-card p-5 shadow-soft">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-qteal" />
              <h4 className="text-xs font-bold tracking-wide uppercase">Hackathon Presentation Tool</h4>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
              Demonstrate the automatic route re-optimization capability to judges by injecting sudden corridor bottleneck slowdowns.
            </p>

            <button
              onClick={() => onTriggerBottleneck(!surgeActive)}
              className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs transition-smooth shadow-soft flex items-center justify-center space-x-1.5 ${
                surgeActive 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                  : 'bg-qteal hover:bg-teal-400 text-qnavy'
              }`}
            >
              <span>{surgeActive ? 'Clear Simulated Bottleneck' : 'Inject Arterial Bottleneck (+20m)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
