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
  Check
} from 'lucide-react';
import type { VehicleType, RoutingMode, CorridorPreset, PlaceItem, IndianState } from '../types';

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
  // All States & UTs from API
  const [states, setStates] = useState<IndianState[]>([]);
  
  // State selection for Origin and Destination independently
  const [originState, setOriginState] = useState<string>('Rajasthan');
  const [destState, setDestState] = useState<string>('Rajasthan');

  // Cities list loaded per state
  const [originCities, setOriginCities] = useState<PlaceItem[]>([]);
  const [destCities, setDestCities] = useState<PlaceItem[]>([]);

  // Search input & dropdown controls
  const [showOriginDropdown, setShowOriginDropdown] = useState<boolean>(false);
  const [showDestDropdown, setShowDestDropdown] = useState<boolean>(false);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState<boolean>(false);

  const originInputRef = useRef<HTMLInputElement>(null);
  const destInputRef = useRef<HTMLInputElement>(null);
  const originDropdownRef = useRef<HTMLDivElement>(null);
  const destDropdownRef = useRef<HTMLDivElement>(null);

  // 1. Fetch States on mount
  useEffect(() => {
    fetch('/api/places/states')
      .then(res => res.json())
      .then(data => {
        if (data.states) setStates(data.states);
      })
      .catch(e => console.warn('States fetch:', e));
  }, []);

  // 2. Fetch Origin Cities when originState changes
  useEffect(() => {
    const stateQuery = originState ? `?state=${encodeURIComponent(originState)}` : '';
    fetch(`/api/places/cities${stateQuery}`)
      .then(res => res.json())
      .then(data => {
        if (data.cities) setOriginCities(data.cities);
      })
      .catch(e => console.warn('Origin cities fetch:', e));
  }, [originState]);

  // 3. Fetch Destination Cities when destState changes
  useEffect(() => {
    const stateQuery = destState ? `?state=${encodeURIComponent(destState)}` : '';
    fetch(`/api/places/cities${stateQuery}`)
      .then(res => res.json())
      .then(data => {
        if (data.cities) setDestCities(data.cities);
      })
      .catch(e => console.warn('Dest cities fetch:', e));
  }, [destState]);

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

  const handleSelectOriginCity = (city: PlaceItem) => {
    setOrigin(city.name);
    setOriginCoord({ name: city.name, lat: city.lat, lng: city.lng });
    if (city.state) setOriginState(city.state);
    setShowOriginDropdown(false);
  };

  const handleSelectDestCity = (city: PlaceItem) => {
    setDestination(city.name);
    setDestCoord({ name: city.name, lat: city.lat, lng: city.lng });
    if (city.state) setDestState(city.state);
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
        },
        () => {
          setOrigin('Jaipur');
          setOriginCoord({ name: 'Jaipur', lat: 26.9124, lng: 75.7873 });
        }
      );
    }
  };

  // Filter cities by search text
  const filteredOriginCities = originCities.filter(c =>
    c.name.toLowerCase().includes(origin.toLowerCase()) ||
    c.state.toLowerCase().includes(origin.toLowerCase())
  );

  const filteredDestCities = destCities.filter(c =>
    c.name.toLowerCase().includes(destination.toLowerCase()) ||
    c.state.toLowerCase().includes(destination.toLowerCase())
  );

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

      {/* Origin: State & City Selection */}
      <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 mb-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-bold text-qnavy uppercase tracking-wider flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-qgreen ring-4 ring-qgreen/20" />
            <span>ORIGIN: State & City</span>
          </label>
          <button
            type="button"
            onClick={handleUseGps}
            className="text-[10px] text-qblue hover:underline flex items-center space-x-1 font-medium"
          >
            <Crosshair className="w-3 h-3" />
            <span>GPS Location</span>
          </button>
        </div>

        {/* State Dropdown for Origin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
          <div>
            <label className="text-[9px] font-bold text-text-light uppercase tracking-wider block mb-0.5">
              1. Select State / UT:
            </label>
            <select
              value={originState}
              onChange={(e) => {
                setOriginState(e.target.value);
                setOrigin(''); // clear city to let user select
                setShowOriginDropdown(true);
              }}
              className="w-full text-xs py-1.5 px-2.5 bg-white border border-slate-200 rounded-xl font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-qblue/40"
            >
              <option value="">-- All India (Search Any City) --</option>
              {states.map(s => (
                <option key={s.name} value={s.name}>
                  {s.name}{s.isUT ? ' (UT)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* City Input & Dropdown for Origin */}
          <div className="relative">
            <label className="text-[9px] font-bold text-text-light uppercase tracking-wider block mb-0.5">
              2. Select / Search City:
            </label>
            <div className="relative">
              <input
                ref={originInputRef}
                type="text"
                value={origin}
                onChange={e => {
                  setOrigin(e.target.value);
                  setShowOriginDropdown(true);
                }}
                onFocus={() => setShowOriginDropdown(true)}
                placeholder={originState ? `Choose city in ${originState}...` : 'Type city name...'}
                className="w-full pl-3 pr-8 py-1.5 text-xs font-semibold text-text-main bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-qblue/40"
              />
              <button
                type="button"
                onClick={() => setShowOriginDropdown(!showOriginDropdown)}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-qnavy"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* City Dropdown List for Origin */}
            {showOriginDropdown && (
              <div
                ref={originDropdownRef}
                className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-soft-lg max-h-52 overflow-y-auto divide-y divide-slate-100"
              >
                <div className="p-2 bg-slate-50 text-[10px] font-bold text-text-muted flex justify-between">
                  <span>{originState ? `Cities in ${originState}` : 'All Indian Cities'}</span>
                  <span>{filteredOriginCities.length} found</span>
                </div>
                {filteredOriginCities.length > 0 ? (
                  filteredOriginCities.map(city => (
                    <div
                      key={city.name}
                      onClick={() => handleSelectOriginCity(city)}
                      className="p-2 hover:bg-blue-50/70 cursor-pointer transition-smooth flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span className="font-semibold text-text-main">{city.name}</span>
                        {city.isCapital && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                            Capital
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-text-light">{city.state}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-[11px] text-text-muted">
                    No matching city found in {originState || 'India'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Origin City Chips */}
        {originCities.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            <span className="text-[9px] text-text-light self-center mr-1">Quick pick:</span>
            {originCities.slice(0, 6).map(city => (
              <button
                key={city.name}
                type="button"
                onClick={() => handleSelectOriginCity(city)}
                className={`text-[10px] px-2 py-0.5 rounded-lg border transition-smooth ${
                  origin === city.name
                    ? 'bg-qnavy text-white border-qnavy font-semibold'
                    : 'bg-white text-text-muted border-slate-200 hover:border-slate-300'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Swap Button (⇄) */}
      <div className="flex justify-center -my-1 relative z-10">
        <button
          type="button"
          onClick={handleSwap}
          className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-qnavy shadow-soft-sm flex items-center justify-center transition-smooth"
          title="Swap Origin and Destination"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Destination: State & City Selection */}
      <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-bold text-qnavy uppercase tracking-wider flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-qnavy ring-4 ring-qnavy/20" />
            <span>DESTINATION: State & City</span>
          </label>
          <span className="text-[10px] text-text-light font-medium">
            {destState || 'Any State'}
          </span>
        </div>

        {/* State Dropdown for Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
          <div>
            <label className="text-[9px] font-bold text-text-light uppercase tracking-wider block mb-0.5">
              1. Select State / UT:
            </label>
            <select
              value={destState}
              onChange={(e) => {
                setDestState(e.target.value);
                setDestination('');
                setShowDestDropdown(true);
              }}
              className="w-full text-xs py-1.5 px-2.5 bg-white border border-slate-200 rounded-xl font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-qblue/40"
            >
              <option value="">-- All India (Search Any City) --</option>
              {states.map(s => (
                <option key={s.name} value={s.name}>
                  {s.name}{s.isUT ? ' (UT)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* City Input & Dropdown for Destination */}
          <div className="relative">
            <label className="text-[9px] font-bold text-text-light uppercase tracking-wider block mb-0.5">
              2. Select / Search City:
            </label>
            <div className="relative">
              <input
                ref={destInputRef}
                type="text"
                value={destination}
                onChange={e => {
                  setDestination(e.target.value);
                  setShowDestDropdown(true);
                }}
                onFocus={() => setShowDestDropdown(true)}
                placeholder={destState ? `Choose city in ${destState}...` : 'Type city name...'}
                className="w-full pl-3 pr-8 py-1.5 text-xs font-semibold text-text-main bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-qblue/40"
              />
              <button
                type="button"
                onClick={() => setShowDestDropdown(!showDestDropdown)}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-qnavy"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* City Dropdown List for Destination */}
            {showDestDropdown && (
              <div
                ref={destDropdownRef}
                className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-soft-lg max-h-52 overflow-y-auto divide-y divide-slate-100"
              >
                <div className="p-2 bg-slate-50 text-[10px] font-bold text-text-muted flex justify-between">
                  <span>{destState ? `Cities in ${destState}` : 'All Indian Cities'}</span>
                  <span>{filteredDestCities.length} found</span>
                </div>
                {filteredDestCities.length > 0 ? (
                  filteredDestCities.map(city => (
                    <div
                      key={city.name}
                      onClick={() => handleSelectDestCity(city)}
                      className="p-2 hover:bg-blue-50/70 cursor-pointer transition-smooth flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span className="font-semibold text-text-main">{city.name}</span>
                        {city.isCapital && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                            Capital
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-text-light">{city.state}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-[11px] text-text-muted">
                    No matching city found in {destState || 'India'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Dest City Chips */}
        {destCities.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            <span className="text-[9px] text-text-light self-center mr-1">Quick pick:</span>
            {destCities.slice(0, 6).map(city => (
              <button
                key={city.name}
                type="button"
                onClick={() => handleSelectDestCity(city)}
                className={`text-[10px] px-2 py-0.5 rounded-lg border transition-smooth ${
                  destination === city.name
                    ? 'bg-qnavy text-white border-qnavy font-semibold'
                    : 'bg-white text-text-muted border-slate-200 hover:border-slate-300'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        )}
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
