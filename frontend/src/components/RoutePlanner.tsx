import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Car, 
  Zap, 
  Bike, 
  Truck, 
  Sparkles, 
  Loader2,
  Navigation,
  ArrowUpDown,
  Building2,
  Globe2,
  Crosshair,
  ChevronDown,
  X,
  Check
} from 'lucide-react';
import type { VehicleType, RoutingMode, CorridorPreset } from '../types';
import { ALL_INDIAN_STATES, CITIES_BY_STATE, ALL_INDIAN_CITIES_FLAT } from '../data/allIndiaCitiesData';
import { groqAiService } from '../services/groqAiService';

interface RoutePlannerProps {
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
  originCoord: { name: string; lat: number; lng: number };
  setOriginCoord: (val: { name: string; lat: number; lng: number }) => void;
  destCoord: { name: string; lat: number; lng: number };
  setDestCoord: (val: { name: string; lat: number; lng: number }) => void;
  vehicleType: VehicleType;
  setVehicleType: (val: VehicleType) => void;
  routingMode: RoutingMode;
  setRoutingMode: (val: RoutingMode) => void;
  onOptimize: () => void;
  isOptimizing: boolean;
  optimizationStep: number;
  presets: CorridorPreset[];
  onSelectPreset: (preset: CorridorPreset) => void;
  selectedPresetId: string | null;
}

const UT_NAMES = new Set([
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi-NCR', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
]);

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  originCoord,
  setOriginCoord,
  destCoord,
  setDestCoord,
  vehicleType,
  setVehicleType,
  routingMode,
  setRoutingMode,
  onOptimize,
  isOptimizing,
  optimizationStep,
  presets,
  onSelectPreset,
  selectedPresetId
}) => {
  // Helper to find state of a city name
  const getStateForCity = (cityName: string): string => {
    if (!cityName) return '';
    const clean = cityName.trim().toLowerCase();
    const exact = ALL_INDIAN_CITIES_FLAT.find(c => c.name.toLowerCase() === clean);
    if (exact) return exact.state;
    const partial = ALL_INDIAN_CITIES_FLAT.find(
      c => clean.startsWith(c.name.toLowerCase()) || clean.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(clean)
    );
    return partial ? partial.state : '';
  };

  // State selection for Origin & Destination
  const [originState, setOriginState] = useState<string>(() => getStateForCity(origin) || 'Rajasthan');
  const [destState, setDestState] = useState<string>(() => getStateForCity(destination) || 'Rajasthan');

  // Search input & dropdown controls
  const [originSearchText, setOriginSearchText] = useState<string>('');
  const [destSearchText, setDestSearchText] = useState<string>('');
  const [showOriginDropdown, setShowOriginDropdown] = useState<boolean>(false);
  const [showDestDropdown, setShowDestDropdown] = useState<boolean>(false);

  // AI Journey Auto-Setup via Groq state
  const [aiPromptText, setAiPromptText] = useState<string>('');
  const [isAiParsing, setIsAiParsing] = useState<boolean>(false);
  const [aiSetupMessage, setAiSetupMessage] = useState<string>('');

  const originInputRef = useRef<HTMLInputElement>(null);
  const destInputRef = useRef<HTMLInputElement>(null);
  const originDropdownRef = useRef<HTMLDivElement>(null);
  const destDropdownRef = useRef<HTMLDivElement>(null);

  const handleAiAutoSetup = async () => {
    if (!aiPromptText.trim() || isAiParsing) return;
    setIsAiParsing(true);
    setAiSetupMessage('');

    try {
      const result = await groqAiService.parseNaturalRouteQuery(aiPromptText);
      if (result.originCity) {
        const foundOrigin = ALL_INDIAN_CITIES_FLAT.find(c => c.name.toLowerCase() === result.originCity!.toLowerCase()) ||
          ALL_INDIAN_CITIES_FLAT.find(c => c.name.toLowerCase().includes(result.originCity!.toLowerCase()));
        if (foundOrigin) {
          setOrigin(foundOrigin.name);
          setOriginCoord({ name: foundOrigin.name, lat: foundOrigin.lat, lng: foundOrigin.lng });
          setOriginState(foundOrigin.state);
        } else {
          setOrigin(result.originCity);
          if (result.originState) setOriginState(result.originState);
        }
      }

      if (result.destCity) {
        const foundDest = ALL_INDIAN_CITIES_FLAT.find(c => c.name.toLowerCase() === result.destCity!.toLowerCase()) ||
          ALL_INDIAN_CITIES_FLAT.find(c => c.name.toLowerCase().includes(result.destCity!.toLowerCase()));
        if (foundDest) {
          setDestination(foundDest.name);
          setDestCoord({ name: foundDest.name, lat: foundDest.lat, lng: foundDest.lng });
          setDestState(foundDest.state);
        } else {
          setDestination(result.destCity);
          if (result.destState) setDestState(result.destState);
        }
      }

      if (result.vehicleType) setVehicleType(result.vehicleType);
      if (result.routingMode) setRoutingMode(result.routingMode);

      setAiSetupMessage(result.explanation || `Configured ${result.originCity || origin} ➔ ${result.destCity || destination}`);
      setTimeout(() => setAiSetupMessage(''), 8000);

      setTimeout(() => {
        onOptimize();
      }, 100);
    } catch (err: any) {
      console.warn('AI setup error:', err);
      setAiSetupMessage('Could not parse route automatically, please pick from dropdowns.');
    } finally {
      setIsAiParsing(false);
    }
  };

  // Sync state dropdown when origin/destination props change (e.g. from preset or initial load)
  useEffect(() => {
    if (origin) {
      const detected = getStateForCity(origin);
      if (detected && detected !== originState) {
        setOriginState(detected);
      }
    }
  }, [origin]);

  useEffect(() => {
    if (destination) {
      const detected = getStateForCity(destination);
      if (detected && detected !== destState) {
        setDestState(detected);
      }
    }
  }, [destination]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (originDropdownRef.current && !originDropdownRef.current.contains(e.target as Node) &&
          originInputRef.current && !originInputRef.current.contains(e.target as Node)) {
        setShowOriginDropdown(false);
      }
      if (destDropdownRef.current && !destDropdownRef.current.contains(e.target as Node) &&
          destInputRef.current && !destInputRef.current.contains(e.target as Node)) {
        setShowDestDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cities for origin based on originState
  const currentOriginStateCities = originState && (CITIES_BY_STATE as Record<string, Array<{ name: string; lat: number; lng: number; isCapital?: boolean }>>)[originState]
    ? (CITIES_BY_STATE as Record<string, Array<{ name: string; lat: number; lng: number; isCapital?: boolean }>>)[originState].map(c => ({ ...c, state: originState }))
    : ALL_INDIAN_CITIES_FLAT;

  const quickOriginCities = currentOriginStateCities.slice(0, 6);

  // Search results for typing across all India
  const searchResultsOrigin = originSearchText.trim()
    ? ALL_INDIAN_CITIES_FLAT.filter(c =>
        c.name.toLowerCase().includes(originSearchText.toLowerCase()) ||
        c.state.toLowerCase().includes(originSearchText.toLowerCase())
      ).slice(0, 15)
    : [];

  // Cities for destination based on destState
  const currentDestStateCities = destState && (CITIES_BY_STATE as Record<string, Array<{ name: string; lat: number; lng: number; isCapital?: boolean }>>)[destState]
    ? (CITIES_BY_STATE as Record<string, Array<{ name: string; lat: number; lng: number; isCapital?: boolean }>>)[destState].map(c => ({ ...c, state: destState }))
    : ALL_INDIAN_CITIES_FLAT;

  const quickDestCities = currentDestStateCities.slice(0, 6);

  // Search results for typing across all India
  const searchResultsDest = destSearchText.trim()
    ? ALL_INDIAN_CITIES_FLAT.filter(c =>
        c.name.toLowerCase().includes(destSearchText.toLowerCase()) ||
        c.state.toLowerCase().includes(destSearchText.toLowerCase())
      ).slice(0, 15)
    : [];

  const handleSelectOriginCity = (city: { name: string; lat: number; lng: number; state?: string }) => {
    setOrigin(city.name);
    setOriginCoord({ name: city.name, lat: city.lat, lng: city.lng });
    if (city.state && city.state !== originState) {
      setOriginState(city.state);
    }
    setOriginSearchText('');
    setShowOriginDropdown(false);
  };

  const handleSelectDestCity = (city: { name: string; lat: number; lng: number; state?: string }) => {
    setDestination(city.name);
    setDestCoord({ name: city.name, lat: city.lat, lng: city.lng });
    if (city.state && city.state !== destState) {
      setDestState(city.state);
    }
    setDestSearchText('');
    setShowDestDropdown(false);
  };

  const handleSwap = () => {
    const tempName = origin;
    const tempCoord = originCoord;
    const tempState = originState;

    setOrigin(destination);
    setOriginCoord(destCoord);
    setOriginState(destState);

    setDestination(tempName);
    setDestCoord(tempCoord);
    setDestState(tempState);
  };

  const handleUseGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setOrigin('Current GPS Location');
          setOriginCoord({ name: 'Current GPS Location', lat, lng });
          setShowOriginDropdown(false);
        },
        () => {
          setOrigin('Jaipur');
          setOriginCoord({ name: 'Jaipur', lat: 26.9124, lng: 75.7873 });
          setOriginState('Rajasthan');
          setShowOriginDropdown(false);
        }
      );
    }
  };

  const steps = [
    'Fetching live traffic...',
    'Generating candidate routes...',
    'Calculating route costs...',
    'Running Q-Route optimization...',
    'Selecting optimal route...'
  ];

  const vehicles: Array<{ id: VehicleType; label: string; icon: any; sub: string }> = [
    { id: 'car_petrol', label: 'Petrol Car', icon: Car, sub: 'Litres (L)' },
    { id: 'car_diesel', label: 'Diesel Car', icon: Car, sub: 'Litres (L)' },
    { id: 'ev', label: 'Electric EV', icon: Zap, sub: 'Energy (kWh)' },
    { id: 'bike', label: 'Motorbike', icon: Bike, sub: 'Litres (L)' },
    { id: 'truck', label: 'Truck / Van', icon: Truck, sub: 'Litres (L)' }
  ];

  const modes: Array<{ id: RoutingMode; label: string; desc: string; focus: string }> = [
    { id: 'balanced', label: 'Balanced', desc: 'Holistic multi-factor balance', focus: 'Time 35% | Traffic 25% | Fuel 20%' },
    { id: 'fastest', label: 'Fastest', desc: 'Minimizes travel duration', focus: 'Time 55% | Traffic 25%' },
    { id: 'fuel_efficient', label: 'Fuel Efficient', desc: 'Eco-friendly minimal consumption', focus: 'Fuel 50% | Traffic 20%' },
    { id: 'low_traffic', label: 'Low Traffic', desc: 'Bypasses severe congestion', focus: 'Traffic 50% | Time 25%' }
  ];

  return (
    <div className="bg-white rounded-card p-5 border border-slate-200/90 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-qnavy/10 flex items-center justify-center text-qnavy">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-qnavy">Pan-India Route Planner</h2>
            <p className="text-[11px] text-text-muted">Select states & cities across all 28 States & 8 UTs</p>
          </div>
        </div>

        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
          <Globe2 className="w-3 h-3 text-emerald-600" />
          <span>500+ Indian Cities</span>
        </span>
      </div>

      {/* AI Smart Journey Auto-Setup via Groq LPU */}
      <div className="p-3.5 mb-3.5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-slate-50 border border-blue-200/80 shadow-soft-sm">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10.5px] font-bold text-qnavy uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-qblue animate-pulse" />
            <span>AI Smart Journey Setup (Groq Cloud LPU)</span>
          </label>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Groq LPU AI Active</span>
          </span>
        </div>
        <p className="text-[10.5px] text-text-muted mb-2">
          Type any natural journey prompt to automatically configure <strong>ORIGIN: State & City</strong> and <strong>DESTINATION: State & City</strong>:
        </p>
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={aiPromptText}
            onChange={e => setAiPromptText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAiAutoSetup();
            }}
            placeholder="e.g. 'Route from Jaipur Rajasthan to Mumbai Maharashtra' or 'Delhi to Ahmedabad in EV'"
            className="flex-1 text-xs py-2 px-3 bg-white border border-slate-200 hover:border-slate-300 focus:border-qblue rounded-xl focus:outline-none focus:ring-2 focus:ring-qblue/20 placeholder:text-slate-400 shadow-soft-sm transition-smooth font-medium text-text-main"
          />
          <button
            type="button"
            onClick={handleAiAutoSetup}
            disabled={isAiParsing || !aiPromptText.trim()}
            className="px-3.5 py-2 bg-qblue hover:bg-qnavy text-white text-xs font-semibold rounded-xl transition-smooth shadow-soft-sm flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isAiParsing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isAiParsing ? 'Analyzing...' : 'AI Auto-Set'}</span>
          </button>
        </div>
        {aiSetupMessage && (
          <p className="text-[11px] text-emerald-800 font-semibold mt-2 px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center space-x-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{aiSetupMessage}</span>
          </p>
        )}
      </div>

      {/* ORIGIN: State & City */}
      <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/90 mb-3 shadow-soft-sm">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-[10.5px] font-bold text-qnavy uppercase tracking-wider flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-qgreen ring-4 ring-qgreen/20" />
            <span>ORIGIN: State & City</span>
          </label>
          <button
            type="button"
            onClick={handleUseGps}
            className="text-[10px] text-qblue hover:text-qnavy flex items-center space-x-1 font-semibold hover:underline cursor-pointer"
            title="Use current GPS location"
          >
            <Crosshair className="w-3 h-3 text-qblue" />
            <span>GPS Location</span>
          </button>
        </div>

        {/* 2-Step Layout: Step 1 (State) and Step 2 (City) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
          {/* Step 1: Select State / UT */}
          <div>
            <label className="text-[9px] font-bold text-text-light uppercase tracking-wider block mb-1">
              1. Select State / UT:
            </label>
            <select
              value={originState}
              onChange={(e) => {
                const newState = e.target.value;
                setOriginState(newState);
                const cities = newState && (CITIES_BY_STATE as Record<string, Array<{ name: string; lat: number; lng: number; isCapital?: boolean }>>)[newState];
                if (cities && cities.length > 0) {
                  const defaultCity = cities.find(c => c.isCapital) || cities[0];
                  setOrigin(defaultCity.name);
                  setOriginCoord({ name: defaultCity.name, lat: defaultCity.lat, lng: defaultCity.lng });
                }
              }}
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-500 rounded-xl font-semibold text-text-main focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-soft-sm transition-smooth cursor-pointer"
            >
              <option value="">-- All India (430+ Cities) --</option>
              {ALL_INDIAN_STATES.map(s => (
                <option key={s} value={s}>
                  {s} {UT_NAMES.has(s) ? '(UT)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select City Dropdown */}
          <div>
            <label className="text-[9px] font-bold text-text-light uppercase tracking-wider block mb-1">
              2. Select City ({currentOriginStateCities.length} available):
            </label>
            <select
              value={origin}
              onChange={(e) => {
                const cityName = e.target.value;
                const found = currentOriginStateCities.find(c => c.name === cityName) || ALL_INDIAN_CITIES_FLAT.find(c => c.name === cityName);
                if (found) {
                  handleSelectOriginCity(found);
                } else if (cityName) {
                  setOrigin(cityName);
                }
              }}
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-500 rounded-xl font-semibold text-text-main focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-soft-sm transition-smooth cursor-pointer"
            >
              <option value="">-- Choose City in {originState || 'India'} --</option>
              {origin && !currentOriginStateCities.some(c => c.name.toLowerCase() === origin.toLowerCase()) && (
                <option value={origin}>{origin} (Selected)</option>
              )}
              {currentOriginStateCities.map(city => (
                <option key={city.name} value={city.name}>
                  {city.name} {city.isCapital ? '★ (Capital)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Origin City Chips */}
        {quickOriginCities.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 pt-1 mb-2 border-t border-slate-200/60">
            <span className="text-[9px] text-text-light font-semibold self-center mr-1">Quick pick:</span>
            {quickOriginCities.map(city => (
              <button
                key={city.name}
                type="button"
                onClick={() => handleSelectOriginCity(city)}
                className={`text-[10px] px-2 py-0.5 rounded-lg border transition-smooth font-medium cursor-pointer ${
                  origin === city.name
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-soft-sm font-semibold'
                    : 'bg-white text-text-muted border-slate-200 hover:border-slate-300 hover:text-text-main'
                }`}
              >
                {city.name} {city.isCapital ? '★' : ''}
              </button>
            ))}
          </div>
        )}

        {/* Search any city across India by typing */}
        <div className="relative">
          <div className="relative flex items-center">
            <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <input
              ref={originInputRef}
              type="text"
              value={originSearchText}
              onChange={e => {
                setOriginSearchText(e.target.value);
                setShowOriginDropdown(true);
              }}
              onFocus={() => setShowOriginDropdown(true)}
              placeholder="Or type to search across all 430+ Indian cities..."
              className="w-full pl-8 pr-7 py-1.5 text-xs text-text-main bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400 shadow-soft-sm transition-smooth"
            />
            {originSearchText && (
              <button
                type="button"
                onClick={() => {
                  setOriginSearchText('');
                  setShowOriginDropdown(false);
                }}
                className="absolute right-2 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {showOriginDropdown && originSearchText.trim().length > 0 && (
            <div
              ref={originDropdownRef}
              className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-soft-lg max-h-52 overflow-y-auto divide-y divide-slate-100"
            >
              <div className="p-2 bg-slate-50 text-[10px] font-bold text-text-muted flex justify-between items-center">
                <span>Search Results ({searchResultsOrigin.length})</span>
                <span className="text-[9px] text-text-light">Select city & auto-switch state</span>
              </div>
              {searchResultsOrigin.length > 0 ? (
                searchResultsOrigin.map(city => (
                  <div
                    key={`${city.state}-${city.name}`}
                    onClick={() => handleSelectOriginCity(city)}
                    className="p-2 hover:bg-emerald-50/70 cursor-pointer transition-smooth flex items-center justify-between text-xs group"
                  >
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700" />
                      <span className="font-semibold text-text-main group-hover:text-emerald-900">{city.name}</span>
                      {city.isCapital && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200">
                          Capital
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-text-light font-medium">{city.state}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-[11px] text-text-muted">
                  No city found matching "{originSearchText}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Swap Button (⇄) */}
      <div className="flex justify-center -my-1.5 relative z-10">
        <button
          type="button"
          onClick={handleSwap}
          className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-qnavy shadow-soft-sm flex items-center justify-center transition-all duration-200 active:rotate-180 active:scale-95 cursor-pointer"
          title="Swap Origin and Destination"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>

      {/* DESTINATION: State & City */}
      <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/90 mb-4 shadow-soft-sm">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-[10.5px] font-bold text-qnavy uppercase tracking-wider flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-qnavy ring-4 ring-qnavy/20" />
            <span>DESTINATION: State & City</span>
          </label>
          <span className="text-[10px] text-text-light font-medium">
            {destState || 'All India'}
          </span>
        </div>

        {/* 2-Step Layout: Step 1 (State) and Step 2 (City) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
          {/* Step 1: Select State / UT */}
          <div>
            <label className="text-[9px] font-bold text-text-light uppercase tracking-wider block mb-1">
              1. Select State / UT:
            </label>
            <select
              value={destState}
              onChange={(e) => {
                const newState = e.target.value;
                setDestState(newState);
                const cities = newState && (CITIES_BY_STATE as Record<string, Array<{ name: string; lat: number; lng: number; isCapital?: boolean }>>)[newState];
                if (cities && cities.length > 0) {
                  const defaultCity = cities.find(c => c.isCapital) || cities[0];
                  setDestination(defaultCity.name);
                  setDestCoord({ name: defaultCity.name, lat: defaultCity.lat, lng: defaultCity.lng });
                }
              }}
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-qnavy rounded-xl font-semibold text-text-main focus:outline-none focus:ring-2 focus:ring-qnavy/20 shadow-soft-sm transition-smooth cursor-pointer"
            >
              <option value="">-- All India (430+ Cities) --</option>
              {ALL_INDIAN_STATES.map(s => (
                <option key={s} value={s}>
                  {s} {UT_NAMES.has(s) ? '(UT)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select City Dropdown */}
          <div>
            <label className="text-[9px] font-bold text-text-light uppercase tracking-wider block mb-1">
              2. Select City ({currentDestStateCities.length} available):
            </label>
            <select
              value={destination}
              onChange={(e) => {
                const cityName = e.target.value;
                const found = currentDestStateCities.find(c => c.name === cityName) || ALL_INDIAN_CITIES_FLAT.find(c => c.name === cityName);
                if (found) {
                  handleSelectDestCity(found);
                } else if (cityName) {
                  setDestination(cityName);
                }
              }}
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-qnavy rounded-xl font-semibold text-text-main focus:outline-none focus:ring-2 focus:ring-qnavy/20 shadow-soft-sm transition-smooth cursor-pointer"
            >
              <option value="">-- Choose City in {destState || 'India'} --</option>
              {destination && !currentDestStateCities.some(c => c.name.toLowerCase() === destination.toLowerCase()) && (
                <option value={destination}>{destination} (Selected)</option>
              )}
              {currentDestStateCities.map(city => (
                <option key={city.name} value={city.name}>
                  {city.name} {city.isCapital ? '★ (Capital)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Dest City Chips */}
        {quickDestCities.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 pt-1 mb-2 border-t border-slate-200/60">
            <span className="text-[9px] text-text-light font-semibold self-center mr-1">Quick pick:</span>
            {quickDestCities.map(city => (
              <button
                key={city.name}
                type="button"
                onClick={() => handleSelectDestCity(city)}
                className={`text-[10px] px-2 py-0.5 rounded-lg border transition-smooth font-medium cursor-pointer ${
                  destination === city.name
                    ? 'bg-qnavy text-white border-qnavy shadow-soft-sm font-semibold'
                    : 'bg-white text-text-muted border-slate-200 hover:border-slate-300 hover:text-text-main'
                }`}
              >
                {city.name} {city.isCapital ? '★' : ''}
              </button>
            ))}
          </div>
        )}

        {/* Search any city across India by typing */}
        <div className="relative">
          <div className="relative flex items-center">
            <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <input
              ref={destInputRef}
              type="text"
              value={destSearchText}
              onChange={e => {
                setDestSearchText(e.target.value);
                setShowDestDropdown(true);
              }}
              onFocus={() => setShowDestDropdown(true)}
              placeholder="Or type to search across all 430+ Indian cities..."
              className="w-full pl-8 pr-7 py-1.5 text-xs text-text-main bg-white border border-slate-200 hover:border-slate-300 focus:border-qnavy rounded-xl focus:outline-none focus:ring-2 focus:ring-qnavy/20 placeholder:text-slate-400 shadow-soft-sm transition-smooth"
            />
            {destSearchText && (
              <button
                type="button"
                onClick={() => {
                  setDestSearchText('');
                  setShowDestDropdown(false);
                }}
                className="absolute right-2 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {showDestDropdown && destSearchText.trim().length > 0 && (
            <div
              ref={destDropdownRef}
              className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-soft-lg max-h-52 overflow-y-auto divide-y divide-slate-100"
            >
              <div className="p-2 bg-slate-50 text-[10px] font-bold text-text-muted flex justify-between items-center">
                <span>Search Results ({searchResultsDest.length})</span>
                <span className="text-[9px] text-text-light">Select city & auto-switch state</span>
              </div>
              {searchResultsDest.length > 0 ? (
                searchResultsDest.map(city => (
                  <div
                    key={`${city.state}-${city.name}`}
                    onClick={() => handleSelectDestCity(city)}
                    className="p-2 hover:bg-blue-50/70 cursor-pointer transition-smooth flex items-center justify-between text-xs group"
                  >
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-qnavy" />
                      <span className="font-semibold text-text-main group-hover:text-qnavy">{city.name}</span>
                      {city.isCapital && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200">
                          Capital
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-text-light font-medium">{city.state}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-[11px] text-text-muted">
                  No city found matching "{destSearchText}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Popular Interstate Corridors */}
      <div className="mb-4">
        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">
          Popular Interstate Expressways & Corridors:
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50/60 rounded-xl border border-slate-100">
          {presets.map(p => {
            const isSelected = selectedPresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p)}
                className={`text-[10.5px] px-2.5 py-1 rounded-lg border transition-smooth font-medium flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-qnavy text-white border-qnavy shadow-soft-sm'
                    : 'bg-white text-text-muted border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
                title={p.description}
              >
                <span>{p.name}</span>
                {p.state && <span className="text-[9px] opacity-75">({p.state.split(' ')[0]})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Vehicle Type Selector */}
      <div className="mb-4">
        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">
          Vehicle Profile
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {vehicles.map(v => {
            const Icon = v.icon;
            const isSelected = vehicleType === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setVehicleType(v.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-smooth ${
                  isSelected
                    ? 'bg-qblue/15 border-qblue text-qnavy font-semibold shadow-soft-sm'
                    : 'bg-slate-50 border-slate-200 text-text-muted hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-qnavy' : 'text-slate-500'}`} />
                <span className="text-[10px] leading-tight font-medium line-clamp-1">{v.label}</span>
                <span className="text-[8px] text-text-light">{v.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Routing Mode Selector */}
      <div className="mb-5">
        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">
          Routing Mode / Multi-Objective Preference
        </label>
        <div className="grid grid-cols-2 gap-2">
          {modes.map(m => {
            const isSelected = routingMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setRoutingMode(m.id)}
                className={`p-2.5 rounded-xl border text-left transition-smooth ${
                  isSelected
                    ? 'bg-qnavy text-white border-qnavy shadow-soft-sm'
                    : 'bg-slate-50 border-slate-200 text-text-muted hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-text-main'}`}>
                    {m.label}
                  </span>
                  {isSelected && <Sparkles className="w-3 h-3 text-qteal" />}
                </div>
                <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-text-muted'}`}>
                  {m.desc}
                </p>
                <span className={`text-[9px] mt-1 block font-mono ${isSelected ? 'text-qteal' : 'text-text-light'}`}>
                  {m.focus}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Animated 5-Step Optimization Progress State */}
      {isOptimizing ? (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-qnavy">
            <span className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 text-qblue animate-spin" />
              <span>Optimizing Pan-India Routes...</span>
            </span>
            <span className="font-mono text-[11px] text-qblue">
              Step {optimizationStep} of 5
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-qnavy h-full transition-all duration-300 ease-out"
              style={{ width: `${(optimizationStep / 5) * 100}%` }}
            />
          </div>

          <div className="space-y-1 pt-1">
            {steps.map((st, idx) => {
              const currentStepNumber = idx + 1;
              const isPast = currentStepNumber < optimizationStep;
              const isCurrent = currentStepNumber === optimizationStep;
              return (
                <div key={idx} className="flex items-center space-x-2 text-[11px]">
                  {isPast ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : isCurrent ? (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-qblue border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-200 shrink-0" />
                  )}
                  <span className={isCurrent ? 'font-semibold text-qnavy' : isPast ? 'text-emerald-700' : 'text-slate-400'}>
                    Step {currentStepNumber}: {st}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          onClick={onOptimize}
          className="w-full py-3 px-4 bg-qnavy hover:bg-qnavy-light text-white font-semibold text-xs tracking-wide rounded-xl shadow-soft hover:shadow-soft-lg flex items-center justify-center space-x-2 transition-smooth group cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-qteal group-hover:rotate-12 transition-smooth" />
          <span>FIND OPTIMAL ROUTE</span>
          <ArrowRight className="w-4 h-4 text-qteal group-hover:translate-x-1 transition-smooth" />
        </button>
      )}
    </div>
  );
};
