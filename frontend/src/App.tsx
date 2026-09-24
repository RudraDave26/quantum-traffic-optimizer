import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LiveMap } from './components/LiveMap';
import { RoutePlanner } from './components/RoutePlanner';
import { RouteComparison } from './components/RouteComparison';
import { RouteSuggestionsBar } from './components/RouteSuggestionsBar';
import { AiRouteAdvisor } from './components/AiRouteAdvisor';
import { RouteScoreCard } from './components/RouteScoreCard';
import { AutoRerouteAlert } from './components/AutoRerouteAlert';
import { LiveTrafficDashboard } from './components/LiveTrafficDashboard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { RouteHistoryPage } from './components/RouteHistoryPage';
import { DataSourcesPage } from './components/DataSourcesPage';
import { MethodologyPage } from './components/MethodologyPage';
import { SystemStatusModal } from './components/SystemStatusModal';
import { generateClientRoutes } from './services/clientRouteOptimizer';
import { POPULAR_INDIAN_CORRIDORS } from './data/allIndiaCitiesData';
import type { 
  CandidateRoute, 
  VehicleType, 
  RoutingMode, 
  TrafficStatus, 
  SystemHealth, 
  CorridorPreset 
} from './types';
import { 
  Compass, 
  Clock, 
  Fuel, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Zap,
  Award
} from 'lucide-react';

export const App: React.FC = () => {
  // Navigation & Mode
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isSystemStatusOpen, setIsSystemStatusOpen] = useState<boolean>(false);

  // System & Traffic telemetry states
  const [trafficStatus, setTrafficStatus] = useState<TrafficStatus | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [presets, setPresets] = useState<CorridorPreset[]>(POPULAR_INDIAN_CORRIDORS);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>('jaipur-ajmer');

  // Route Planning inputs
  const [origin, setOrigin] = useState<string>('Jaipur (MI Road)');
  const [destination, setDestination] = useState<string>('Ajmer (Dargah / Station)');
  const [originCoord, setOriginCoord] = useState<{ name: string; lat: number; lng: number }>({
    name: 'Jaipur (MI Road)',
    lat: 26.9124,
    lng: 75.7873
  });
  const [destCoord, setDestCoord] = useState<{ name: string; lat: number; lng: number }>({
    name: 'Ajmer (Dargah / Station)',
    lat: 26.4499,
    lng: 74.6399
  });
  const [vehicleType, setVehicleType] = useState<VehicleType>('car_petrol');
  const [routingMode, setRoutingMode] = useState<RoutingMode>('balanced');

  // Optimization & Routes state
  const [candidateRoutes, setCandidateRoutes] = useState<CandidateRoute[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [recommendedRoute, setRecommendedRoute] = useState<CandidateRoute | null>(null);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationStep, setOptimizationStep] = useState<number>(0);

  // Map layer controls
  const [showTrafficCongestion, setShowTrafficCongestion] = useState<boolean>(true);
  const [showRiskLayer, setShowRiskLayer] = useState<boolean>(false);

  // Automatic reroute alert state
  const [trafficChangedAlert, setTrafficChangedAlert] = useState<boolean>(false);
  const [delayIncreaseMin, setDelayIncreaseMin] = useState<number>(0);
  const [dynamicSurgeActive, setDynamicSurgeActive] = useState<boolean>(false);

  // Initial load: fetch health, presets, and initial optimal route
  useEffect(() => {
    // 1. Fetch Health
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setSystemHealth(data))
      .catch(e => console.warn('Health check:', e));

    // 2. Fetch Corridors
    fetch('/api/corridors')
      .then(res => res.json())
      .then(data => {
        if (data.corridors && data.corridors.length > 0) {
          setPresets(data.corridors);
        }
      })
      .catch(e => console.warn('Corridors fetch:', e));

    // 3. Fetch initial traffic
    fetch('/api/traffic')
      .then(res => res.json())
      .then(data => setTrafficStatus(data))
      .catch(e => console.warn('Traffic fetch:', e));

    // 4. Initial route optimization calculation
    runOptimization(false);
  }, []);

  // Poll traffic every 10 seconds to check for dynamic updates (Requirement 13 & 14)
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('/api/traffic')
        .then(res => res.json())
        .then(data => {
          setTrafficStatus(data);
          if (data.dynamicSurgeActive && !trafficChangedAlert) {
            setTrafficChangedAlert(true);
            setDelayIncreaseMin(data.surgeDelayAddedMin || 20);
            setDynamicSurgeActive(true);
          } else if (!data.dynamicSurgeActive && trafficChangedAlert) {
            setTrafficChangedAlert(false);
            setDynamicSurgeActive(false);
          }
        })
        .catch(e => console.warn('Traffic poll:', e));
    }, 10000);

    return () => clearInterval(interval);
  }, [trafficChangedAlert]);

  // Execute Quantum-Inspired Optimization flow with 5 animated steps
  const runOptimization = async (showStepAnimation = true) => {
    setIsOptimizing(true);
    setOptimizationStep(1);

    if (showStepAnimation) {
      // Step 1: Fetching live traffic
      await new Promise(r => setTimeout(r, 350));
      setOptimizationStep(2);
      // Step 2: Generating candidate routes
      await new Promise(r => setTimeout(r, 400));
      setOptimizationStep(3);
      // Step 3: Calculating route costs
      await new Promise(r => setTimeout(r, 400));
      setOptimizationStep(4);
      // Step 4: Running Q-Route optimization
      await new Promise(r => setTimeout(r, 450));
      setOptimizationStep(5);
      // Step 5: Selecting optimal route
      await new Promise(r => setTimeout(r, 300));
    }

    try {
      const res = await fetch('/api/routes/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin,
          destination,
          vehicleType,
          routingMode,
          demoMode: isDemoMode,
          presetId: selectedPresetId
        })
      });

      if (!res.ok) throw new Error(`Optimization request failed with status: ${res.status}`);

      const data = await res.json();
      if (!data.candidateRoutes || data.candidateRoutes.length === 0) {
        throw new Error('API returned empty candidate routes');
      }

      setCandidateRoutes(data.candidateRoutes);
      setRecommendedRoute(data.recommendedRoute);
      setSelectedRouteId(data.recommendedRoute.id);

      if (data.origin) {
        setOriginCoord({
          name: data.origin.name || origin,
          lat: data.origin.lat || 26.9124,
          lng: data.origin.lng || 75.7873
        });
      }
      if (data.destination) {
        setDestCoord({
          name: data.destination.name || destination,
          lat: data.destination.lat || 26.4499,
          lng: data.destination.lng || 74.6399
        });
      }
    } catch (err) {
      console.warn('Backend API route optimization unavailable, using local client route engine:', err);
      try {
        const fallback = generateClientRoutes({
          originName: origin,
          destName: destination,
          originCoord,
          destCoord,
          vehicleType,
          routingMode
        });

        if (fallback.candidateRoutes && fallback.candidateRoutes.length > 0) {
          setCandidateRoutes(fallback.candidateRoutes);
          setRecommendedRoute(fallback.recommendedRoute);
          setSelectedRouteId(fallback.recommendedRoute.id);

          if (fallback.origin) {
            setOriginCoord(fallback.origin);
          }
          if (fallback.destination) {
            setDestCoord(fallback.destination);
          }
        }
      } catch (clientErr) {
        console.error('Client route engine error:', clientErr);
      }
    } finally {
      setIsOptimizing(false);
      setOptimizationStep(0);
      setTrafficChangedAlert(false); // cleared on re-optimization
    }
  };

  // Preset Selection Handler
  const handleSelectPreset = (preset: CorridorPreset) => {
    setSelectedPresetId(preset.id);
    setOrigin(preset.origin.name);
    setDestination(preset.destination.name);
    setOriginCoord(preset.origin);
    setDestCoord(preset.destination);
    
    // Automatically re-run optimization for the selected corridor
    setTimeout(() => {
      runOptimization(true);
    }, 50);
  };

  // Hackathon Demonstration: Trigger Dynamic Traffic Surge
  const handleSimulateBottleneck = async (active: boolean) => {
    try {
      const res = await fetch('/api/traffic/simulate-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delayIncreaseMin: 22,
          reset: !active
        })
      });
      const data = await res.json();
      setDynamicSurgeActive(active);
      setTrafficChangedAlert(active);
      setDelayIncreaseMin(active ? 22 : 0);

      // Refresh traffic data
      fetch('/api/traffic')
        .then(r => r.json())
        .then(d => setTrafficStatus(d));
    } catch (err) {
      console.error('Simulate bottleneck error:', err);
    }
  };

  // Selected route object
  const activeRoute = candidateRoutes.find(r => r.id === selectedRouteId) || recommendedRoute || candidateRoutes[0];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
        trafficStatus={trafficStatus}
        systemHealth={systemHealth}
        onOpenSystemStatus={() => setIsSystemStatusOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: MAIN DASHBOARD (10-Second Executive Summary) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Automatic Route Reroute Alert & Demonstration Bar (Requirement 14) */}
            <AutoRerouteAlert
              trafficChanged={trafficChangedAlert}
              delayIncreaseMin={delayIncreaseMin}
              onRecalculate={() => runOptimization(true)}
              isRecalculating={isOptimizing}
              onSimulateBottleneck={handleSimulateBottleneck}
              surgeActive={dynamicSurgeActive}
            />

            {/* 10-Second Judge Executive KPI Header (Requirement 24) */}
            {activeRoute && (
              <div className="bg-white rounded-card p-4 border border-slate-200/90 shadow-soft">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Journey title */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-qnavy flex items-center justify-center text-white shrink-0 shadow-soft-sm">
                      <Compass className="w-5 h-5 text-qteal" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-qnavy uppercase tracking-wider">
                          Active Trajectory
                        </span>
                        {activeRoute.isRecommended && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-qteal/20 text-qnavy border border-qteal/30">
                            ★ Q-ROUTE OPTIMAL
                          </span>
                        )}
                      </div>
                      <h2 className="text-sm font-extrabold text-text-main mt-0.5">
                        {originCoord.name.split('(')[0]} → {destCoord.name.split('(')[0]}
                      </h2>
                    </div>
                  </div>

                  {/* 4 Crucial Fast-Read Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                    <div>
                      <span className="text-[10px] font-medium text-text-light block">Traffic ETA</span>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-base font-extrabold text-qnavy">{activeRoute.durationMin} min</span>
                        {activeRoute.trafficDelayMin > 0 ? (
                          <span className="text-[10px] font-bold text-rose-500">+{activeRoute.trafficDelayMin}m</span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600">On-time</span>
                        )}
                      </div>
                      <span className="text-[9px] text-text-light">Normal: {activeRoute.staticDurationMin}m</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-medium text-text-light block">Road Distance</span>
                      <span className="text-base font-extrabold text-text-main">{activeRoute.distanceKm} km</span>
                      <span className="text-[9px] text-text-light block">National Corridor</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-medium text-text-light block">
                        {activeRoute.fuelEstimate?.unit === 'kWh' ? 'Energy Estimate' : 'Fuel Estimate'}
                      </span>
                      <span className="text-base font-extrabold text-text-main">
                        {activeRoute.fuelEstimate?.value} {activeRoute.fuelEstimate?.unit}
                      </span>
                      <span className="text-[9px] text-text-light block">~{activeRoute.fuelEstimate?.estimatedCo2Kg} kg CO₂</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-medium text-text-light block">Q-Route Score</span>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-base font-extrabold text-emerald-700 font-mono">
                          {activeRoute.qScore}
                        </span>
                        <span className="text-[10px] font-medium text-text-light">/ 100</span>
                      </div>
                      <span className="text-[9px] text-emerald-700 font-semibold block">Lowest multi-cost</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Route Suggestions Bar: Fastest, Eco, Safest, Low Traffic, Shortest & Quantum Optimal */}
            <RouteSuggestionsBar
              candidateRoutes={candidateRoutes}
              selectedRouteId={selectedRouteId}
              onSelectRoute={id => setSelectedRouteId(id)}
            />

            {/* Groq AI Route Co-Pilot & Decision Briefing */}
            <AiRouteAdvisor
              recommendedRoute={activeRoute}
              candidateRoutes={candidateRoutes}
              origin={originCoord.name}
              destination={destCoord.name}
              vehicleType={vehicleType}
              routingMode={routingMode}
            />

            {/* Split Screen: Interactive Live Map & Control / Candidate Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Route Planner + Route Score Card (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <RoutePlanner
                  origin={origin}
                  setOrigin={setOrigin}
                  destination={destination}
                  setDestination={setDestination}
                  originCoord={originCoord}
                  setOriginCoord={setOriginCoord}
                  destCoord={destCoord}
                  setDestCoord={setDestCoord}
                  vehicleType={vehicleType}
                  setVehicleType={setVehicleType}
                  routingMode={routingMode}
                  setRoutingMode={setRoutingMode}
                  onOptimize={() => runOptimization(true)}
                  isOptimizing={isOptimizing}
                  optimizationStep={optimizationStep}
                  presets={presets}
                  onSelectPreset={handleSelectPreset}
                  selectedPresetId={selectedPresetId}
                />

                <RouteScoreCard
                  route={activeRoute}
                  routingMode={routingMode}
                />
              </div>

              {/* Right Column: Live Map + Route Candidates Comparison (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <LiveMap
                  origin={originCoord}
                  destination={destCoord}
                  candidateRoutes={candidateRoutes}
                  selectedRouteId={selectedRouteId}
                  onSelectRoute={id => setSelectedRouteId(id)}
                  showTrafficCongestion={showTrafficCongestion}
                  onToggleTrafficCongestion={() => setShowTrafficCongestion(!showTrafficCongestion)}
                  showRiskLayer={showRiskLayer}
                  onToggleRiskLayer={() => setShowRiskLayer(!showRiskLayer)}
                  isDemoMode={isDemoMode}
                  onSelectOrigin={(place) => {
                    setOrigin(place.name);
                    setOriginCoord({ name: place.name, lat: place.lat, lng: place.lng });
                    setSelectedPresetId(null);
                    setTimeout(() => runOptimization(true), 100);
                  }}
                  onSelectDestination={(place) => {
                    setDestination(place.name);
                    setDestCoord({ name: place.name, lat: place.lat, lng: place.lng });
                    setSelectedPresetId(null);
                    setTimeout(() => runOptimization(true), 100);
                  }}
                  onTriggerRecalculate={() => runOptimization(true)}
                />

                <RouteComparison
                  candidateRoutes={candidateRoutes}
                  selectedRouteId={selectedRouteId}
                  onSelectRoute={id => setSelectedRouteId(id)}
                />
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: LIVE TRAFFIC MONITORING */}
        {activeTab === 'traffic' && (
          <LiveTrafficDashboard
            isDemoMode={isDemoMode}
            onTriggerBottleneck={handleSimulateBottleneck}
            surgeActive={dynamicSurgeActive}
          />
        )}

        {/* TAB 3: ANALYTICS & BENCHMARKS */}
        {activeTab === 'analytics' && <AnalyticsDashboard />}

        {/* TAB 4: ROUTE SEARCH HISTORY */}
        {activeTab === 'history' && <RouteHistoryPage />}

        {/* TAB 5: DATA SOURCES MATRIX */}
        {activeTab === 'sources' && <DataSourcesPage />}

        {/* TAB 6: METHODOLOGY & QUANTUM CLASSICAL EXPLANATION */}
        {activeTab === 'methodology' && <MethodologyPage />}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-qnavy">Q-ROUTE</span>
            <span>—</span>
            <span>Quantum-Inspired Intelligent Traffic Route Optimization System</span>
          </div>
          <div className="text-[11px] text-text-light flex items-center space-x-3">
            <span>Smart India Hackathon Prototype</span>
            <span>•</span>
            <span>Classical QEA Engine</span>
            <span>•</span>
            <button
              onClick={() => setIsSystemStatusOpen(true)}
              className="text-qnavy hover:underline font-semibold"
            >
              System Health
            </button>
          </div>
        </div>
      </footer>

      {/* System Status Modal */}
      <SystemStatusModal
        isOpen={isSystemStatusOpen}
        onClose={() => setIsSystemStatusOpen(false)}
        health={systemHealth}
        isDemoMode={isDemoMode}
      />
    </div>
  );
};

export default App;
