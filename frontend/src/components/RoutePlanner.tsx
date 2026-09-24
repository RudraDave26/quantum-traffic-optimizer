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
  MapPin,
  Search,
  X,
  Check
} from 'lucide-react';
import type { VehicleType, RoutingMode, CorridorPreset, PlaceItem } from '../types';

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
  // 500+ Indian cities loaded from database
  const [allPlaces, setAllPlaces] = useState<PlaceItem[]>([]);
  const [, setLoadingPlaces] = useState<boolean>(false);

  // Search input & dropdown controls
  const [showOriginDropdown, setShowOriginDropdown] = useState<boolean>(false);
  const [showDestDropdown, setShowDestDropdown] = useState<boolean>(false);

  const originInputRef = useRef<HTMLInputElement>(null);
  const destInputRef = useRef<HTMLInputElement>(null);
  const originDropdownRef = useRef<HTMLDivElement>(null);
  const destDropdownRef = useRef<HTMLDivElement>(null);

  // Load all 500+ verified Indian cities on mount
  useEffect(() => {
    setLoadingPlaces(true);
    fetch('/api/places/cities')
      .then(res => res.json())
      .then(data => {
        if (data.cities && Array.isArray(data.cities)) {
          setAllPlaces(data.cities);
        }
      })
      .catch(e => console.warn('Places fetch:', e))
      .finally(() => setLoadingPlaces(false));
  }, []);

  // Dynamic geocoding enrichment for custom typed origin if not found in top 500
  useEffect(() => {
    if (origin.trim().length >= 3 && !allPlaces.some(p => p.name.toLowerCase() === origin.trim().toLowerCase())) {
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/places/search?q=${encodeURIComponent(origin.trim())}`);
          const data = await res.json();
          if (data.places && data.places.length > 0) {
            setAllPlaces(prev => {
              const existing = new Set(prev.map(p => p.name.toLowerCase()));
              const novel = data.places.filter((p: PlaceItem) => !existing.has(p.name.toLowerCase()));
              return novel.length > 0 ? [...novel, ...prev] : prev;
            });
          }
        } catch (e) {
          // ignore
        }
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [origin, allPlaces]);

  // Dynamic geocoding enrichment for custom typed destination
  useEffect(() => {
    if (destination.trim().length >= 3 && !allPlaces.some(p => p.name.toLowerCase() === destination.trim().toLowerCase())) {
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/places/search?q=${encodeURIComponent(destination.trim())}`);
          const data = await res.json();
          if (data.places && data.places.length > 0) {
            setAllPlaces(prev => {
              const existing = new Set(prev.map(p => p.name.toLowerCase()));
              const novel = data.places.filter((p: PlaceItem) => !existing.has(p.name.toLowerCase()));
              return novel.length > 0 ? [...novel, ...prev] : prev;
            });
          }
        } catch (e) {
          // ignore
        }
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [destination, allPlaces]);

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

  // Quick popular hubs across India
  const POPULAR_HUBS = [
    'Mumbai', 'Delhi', 'Bengaluru', 'Jaipur', 'Hyderabad', 
    'Pune', 'Chennai', 'Kolkata', 'Ahmedabad', 'Agra', 'Chandigarh'
  ];

  // Smart filtering: starts with name -> contains name -> contains state
  const getSuggestions = (query: string) => {
    const q = (query || '').trim().toLowerCase();
    if (!q) {
      return allPlaces
        .filter(p => POPULAR_HUBS.includes(p.name))
        .slice(0, 10);
    }
    const startsWithName = allPlaces.filter(p => p.name.toLowerCase().startsWith(q));
    const containsName = allPlaces.filter(p => !p.name.toLowerCase().startsWith(q) && p.name.toLowerCase().includes(q));
    const containsState = allPlaces.filter(p => !p.name.toLowerCase().includes(q) && p.state.toLowerCase().includes(q));
    return [...startsWithName, ...containsName, ...containsState].slice(0, 15);
  };

  const originSuggestions = getSuggestions(origin);
  const destSuggestions = getSuggestions(destination);

  const handleSelectOrigin = (place: PlaceItem) => {
    setOrigin(place.name);
    setOriginCoord({ name: place.name, lat: place.lat, lng: place.lng });
    setShowOriginDropdown(false);
  };

  const handleSelectDest = (place: PlaceItem) => {
    setDestination(place.name);
    setDestCoord({ name: place.name, lat: place.lat, lng: place.lng });
    setShowDestDropdown(false);
  };

  const handleSwap = () => {
    const tempName = origin;
    const tempCoord = originCoord;

    setOrigin(destination);
    setOriginCoord(destCoord);

    setDestination(tempName);
    setDestCoord(tempCoord);
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
            <p className="text-[11px] text-text-muted">Unified Pan-India search across all 28 States & 8 UTs</p>
          </div>
        </div>

        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
          <Globe2 className="w-3 h-3 text-emerald-600" />
          <span>500+ Indian Cities</span>
        </span>
      </div>

      {/* Google Maps Style Origin & Destination Unified Search Rail */}
      <div className="relative bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3 mb-4 shadow-soft-sm">
        
        {/* Main Search Inputs with Connected Rail */}
        <div className="relative flex items-center">
          
          {/* Left Column: Visual Connected Rail (Green Origin dot -> Dotted line -> Navy Destination pin) */}
          <div className="flex flex-col items-center justify-between self-stretch py-3 pr-2.5 pl-0.5">
            {/* Origin Green Dot */}
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 flex items-center justify-center flex-shrink-0" title="Origin">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            {/* Dotted Vertical Connector Line */}
            <div className="w-0 flex-1 border-l-2 border-dotted border-slate-300 my-1.5" />

            {/* Destination Pin */}
            <div className="w-3.5 h-3.5 rounded-full bg-qnavy ring-4 ring-slate-200 flex items-center justify-center flex-shrink-0" title="Destination">
              <MapPin className="w-2.5 h-2.5 text-white" />
            </div>
          </div>

          {/* Middle Column: Inputs for Origin & Destination */}
          <div className="flex-1 space-y-2">
            
            {/* 1. Origin Input */}
            <div className="relative">
              <div className="relative flex items-center">
                <input
                  ref={originInputRef}
                  type="text"
                  value={origin}
                  onChange={e => {
                    setOrigin(e.target.value);
                    setShowOriginDropdown(true);
                  }}
                  onFocus={() => setShowOriginDropdown(true)}
                  placeholder="Choose starting point (e.g. Mumbai, Delhi, Jaipur)..."
                  className="w-full pl-3 pr-16 py-2 text-xs font-semibold text-text-main bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-smooth shadow-soft-sm"
                />

                <div className="absolute right-1.5 flex items-center space-x-1">
                  {origin && (
                    <button
                      type="button"
                      onClick={() => {
                        setOrigin('');
                        setOriginCoord({ name: '', lat: 0, lng: 0 });
                        originInputRef.current?.focus();
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-smooth"
                      title="Clear origin"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleUseGps}
                    className="p-1 text-qblue hover:text-qnavy rounded-full hover:bg-blue-50 transition-smooth"
                    title="Use GPS current location"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Origin Autocomplete Dropdown */}
              {showOriginDropdown && (
                <div
                  ref={originDropdownRef}
                  className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-soft-lg max-h-56 overflow-y-auto divide-y divide-slate-100"
                >
                  <div className="p-2 bg-slate-50 text-[10px] font-bold text-text-muted flex justify-between items-center">
                    <span className="flex items-center space-x-1">
                      <Search className="w-3 h-3 text-slate-400" />
                      <span>{origin ? `Matching "${origin}"` : 'Popular Starting Hubs'}</span>
                    </span>
                    <span className="text-[9px] text-text-light">{originSuggestions.length} places</span>
                  </div>

                  {originSuggestions.length > 0 ? (
                    originSuggestions.map(place => (
                      <div
                        key={place.id || `${place.name}-${place.state}`}
                        onClick={() => handleSelectOrigin(place)}
                        className="p-2.5 hover:bg-emerald-50/60 cursor-pointer transition-smooth flex items-center justify-between text-xs group"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-500 group-hover:text-emerald-700 transition-smooth shrink-0">
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-semibold text-text-main group-hover:text-emerald-900 block leading-tight">
                              {place.name}
                            </span>
                            <span className="text-[10px] text-text-light">{place.state}</span>
                          </div>
                        </div>

                        {place.category && (
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                            place.category.includes('Capital')
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {place.category.includes('Capital') ? 'Capital' : place.state}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-[11px] text-text-muted">
                      No matching place found. Try typing another city or town name.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Destination Input */}
            <div className="relative">
              <div className="relative flex items-center">
                <input
                  ref={destInputRef}
                  type="text"
                  value={destination}
                  onChange={e => {
                    setDestination(e.target.value);
                    setShowDestDropdown(true);
                  }}
                  onFocus={() => setShowDestDropdown(true)}
                  placeholder="Choose destination (e.g. Pune, Bengaluru, Agra)..."
                  className="w-full pl-3 pr-9 py-2 text-xs font-semibold text-text-main bg-white border border-slate-200 hover:border-slate-300 focus:border-qnavy rounded-xl focus:outline-none focus:ring-2 focus:ring-qnavy/20 transition-smooth shadow-soft-sm"
                />

                {destination && (
                  <button
                    type="button"
                    onClick={() => {
                      setDestination('');
                      setDestCoord({ name: '', lat: 0, lng: 0 });
                      destInputRef.current?.focus();
                    }}
                    className="absolute right-2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-smooth"
                    title="Clear destination"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Destination Autocomplete Dropdown */}
              {showDestDropdown && (
                <div
                  ref={destDropdownRef}
                  className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-soft-lg max-h-56 overflow-y-auto divide-y divide-slate-100"
                >
                  <div className="p-2 bg-slate-50 text-[10px] font-bold text-text-muted flex justify-between items-center">
                    <span className="flex items-center space-x-1">
                      <Search className="w-3 h-3 text-slate-400" />
                      <span>{destination ? `Matching "${destination}"` : 'Popular Destinations'}</span>
                    </span>
                    <span className="text-[9px] text-text-light">{destSuggestions.length} places</span>
                  </div>

                  {destSuggestions.length > 0 ? (
                    destSuggestions.map(place => (
                      <div
                        key={place.id || `${place.name}-${place.state}`}
                        onClick={() => handleSelectDest(place)}
                        className="p-2.5 hover:bg-blue-50/70 cursor-pointer transition-smooth flex items-center justify-between text-xs group"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-slate-500 group-hover:text-qnavy transition-smooth shrink-0">
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-semibold text-text-main group-hover:text-qnavy block leading-tight">
                              {place.name}
                            </span>
                            <span className="text-[10px] text-text-light">{place.state}</span>
                          </div>
                        </div>

                        {place.category && (
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                            place.category.includes('Capital')
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {place.category.includes('Capital') ? 'Capital' : place.state}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-[11px] text-text-muted">
                      No matching destination found. Try typing another city or town name.
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Swap Button */}
          <div className="pl-2">
            <button
              type="button"
              onClick={handleSwap}
              className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-500 hover:text-qnavy shadow-soft-sm flex items-center justify-center transition-all duration-200 active:scale-90"
              title="Swap Origin and Destination"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Quick Hub Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2.5 mt-2 border-t border-slate-200/60">
          <span className="text-[9.5px] font-bold text-text-light uppercase tracking-wider">Quick pick:</span>
          {['Mumbai', 'Delhi', 'Jaipur', 'Pune', 'Bengaluru', 'Agra', 'Ahmedabad'].map(cityName => (
            <button
              key={cityName}
              type="button"
              onClick={() => {
                const found = allPlaces.find(p => p.name.toLowerCase() === cityName.toLowerCase());
                if (found) {
                  if (!origin || (origin && destination)) {
                    setDestination(found.name);
                    setDestCoord({ name: found.name, lat: found.lat, lng: found.lng });
                  } else {
                    setDestination(found.name);
                    setDestCoord({ name: found.name, lat: found.lat, lng: found.lng });
                  }
                }
              }}
              className={`text-[10px] px-2 py-0.5 rounded-lg border transition-smooth font-medium ${
                destination === cityName || origin === cityName
                  ? 'bg-qnavy text-white border-qnavy shadow-soft-sm'
                  : 'bg-white text-text-muted border-slate-200 hover:border-slate-300 hover:text-text-main'
              }`}
            >
              {cityName}
            </button>
          ))}
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
