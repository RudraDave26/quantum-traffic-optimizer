import React from 'react';
import { AlertTriangle, RefreshCw, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface AutoRerouteAlertProps {
  trafficChanged: boolean;
  delayIncreaseMin: number;
  onRecalculate: () => void;
  isRecalculating: boolean;
  onSimulateBottleneck: (addDelay: boolean) => void;
  surgeActive: boolean;
}

export const AutoRerouteAlert: React.FC<AutoRerouteAlertProps> = ({
  trafficChanged,
  delayIncreaseMin,
  onRecalculate,
  isRecalculating,
  onSimulateBottleneck,
  surgeActive
}) => {
  return (
    <div className="space-y-2">
      {/* Dynamic Traffic Change Alert Banner */}
      {trafficChanged && (
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-300 rounded-2xl p-4 shadow-soft transition-smooth">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-amber-900 tracking-wide uppercase">
                    ⚠ Traffic conditions changed
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                    +{delayIncreaseMin} min delay detected
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-0.5">
                  "Your current route may no longer be optimal due to an active arterial corridor slowdown."
                </p>

                {/* Workflow progression indicator */}
                <div className="flex items-center space-x-1.5 text-[10px] text-amber-900/80 font-medium mt-2">
                  <span className="line-through text-slate-400">Previous Route</span>
                  <ArrowRight className="w-3 h-3 text-amber-600" />
                  <span className="font-semibold text-rose-600">Traffic Changed</span>
                  <ArrowRight className="w-3 h-3 text-amber-600" />
                  <span className="text-qblue-dark">Re-optimization</span>
                  <ArrowRight className="w-3 h-3 text-amber-600" />
                  <span className="text-emerald-700 font-bold">New Recommended Route</span>
                </div>
              </div>
            </div>

            <button
              onClick={onRecalculate}
              disabled={isRecalculating}
              className="px-4 py-2 bg-qnavy hover:bg-qnavy-light text-white text-xs font-semibold rounded-xl shadow-soft hover:shadow-soft-lg flex items-center space-x-2 transition-smooth shrink-0 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-qteal ${isRecalculating ? 'animate-spin' : ''}`} />
              <span>{isRecalculating ? 'Re-optimizing...' : 'RECALCULATE ROUTE'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Hackathon Demonstration Simulator Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div className="flex items-center space-x-2 text-text-muted">
          <Zap className="w-4 h-4 text-qorange-dark" />
          <span className="font-medium text-text-main">Hackathon Demonstration Control:</span>
          <span className="text-[11px] text-text-light hidden md:inline">
            Test live dynamic rerouting triggers
          </span>
        </div>

        <div className="flex items-center space-x-2 mt-1 sm:mt-0">
          {!surgeActive ? (
            <button
              onClick={() => onSimulateBottleneck(true)}
              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-semibold transition-smooth flex items-center space-x-1"
            >
              <span>Simulate Traffic Bottleneck (+20 min)</span>
            </button>
          ) : (
            <button
              onClick={() => onSimulateBottleneck(false)}
              className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-semibold transition-smooth flex items-center space-x-1"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Clear Bottleneck / Normal Flow</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
