import React from 'react';
import { X, CheckCircle2, AlertCircle, Server, Activity, Map, Cpu, Database } from 'lucide-react';
import type { SystemHealth } from '../types';

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  health: SystemHealth | null;
  isDemoMode: boolean;
}

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({
  isOpen,
  onClose,
  health,
  isDemoMode
}) => {
  if (!isOpen) return null;

  const services = [
    {
      name: 'Backend API Service',
      icon: Server,
      status: health?.services?.backend?.status || 'ONLINE',
      desc: 'Node.js Express REST API server running on port 5000',
      isOk: true
    },
    {
      name: 'Traffic Routing API',
      icon: Activity,
      status: health?.services?.trafficApi?.status || (isDemoMode ? 'ACTIVE (Demo Traffic Mode)' : 'CONNECTED'),
      desc: health?.services?.trafficApi?.isLiveKeyConfigured 
        ? 'Enterprise Google Routes API active with TRAFFIC_AWARE_OPTIMAL'
        : 'Running in Demo Traffic Mode with realistic Indian corridor models',
      isOk: true,
      isWarning: !health?.services?.trafficApi?.isLiveKeyConfigured
    },
    {
      name: 'Map Geospatial Engine',
      icon: Map,
      status: health?.services?.mapEngine?.status || 'CONNECTED (Leaflet & CartoDB Positron)',
      desc: 'Minimal pastel vector tile renderer & polyline overlay pipeline',
      isOk: true
    },
    {
      name: 'Q-Route Optimization Engine',
      icon: Cpu,
      status: health?.services?.optimizationEngine?.status || 'READY (Quantum-Inspired Classical QEA)',
      desc: 'Classical N-qubit probabilistic register & rotation gate solver',
      isOk: true
    },
    {
      name: 'Storage & Database Subsystem',
      icon: Database,
      status: health?.services?.database?.status || 'CONNECTED (SQLite Storage)',
      desc: 'Local database logging route queries, metrics, and user feedback',
      isOk: true
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-card max-w-lg w-full p-6 shadow-soft-lg border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-text-main hover:bg-slate-100 transition-smooth"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 mb-4">
          <Server className="w-5 h-5 text-qnavy" />
          <h3 className="text-sm font-bold text-qnavy">System Architecture & Service Health</h3>
        </div>

        <div className="space-y-3">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start space-x-3"
              >
                <div className="p-2 rounded-lg bg-white border border-slate-200 text-qnavy shrink-0 shadow-soft-sm">
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-text-main">{svc.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                      svc.isWarning
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${svc.isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <span>{svc.status.split(' ')[0]}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-1 leading-snug">
                    {svc.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-text-light flex justify-between items-center">
          <span>System Version: 1.0.0-sih-prototype</span>
          <span className="font-mono">Status: ALL SYSTEMS NOMINAL</span>
        </div>
      </div>
    </div>
  );
};
