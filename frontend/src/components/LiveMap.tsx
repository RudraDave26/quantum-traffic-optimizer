import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  Maximize2, 
  Navigation, 
  ShieldCheck, 
  Globe, 
  Search, 
  MapPin, 
  Check, 
  Settings2, 
  X, 
  Sparkles,
  ExternalLink,
  Compass,
  ArrowRight
} from 'lucide-react';
import type { CandidateRoute } from '../types';

interface LiveMapProps {
  origin: { name: string; lat?: number; lng?: number; state?: string };
  destination: { name: string; lat?: number; lng?: number; state?: string };
  candidateRoutes: CandidateRoute[];
  selectedRouteId: string | null;
  onSelectRoute: (id: string) => void;
  showTrafficCongestion: boolean;
  onToggleTrafficCongestion: () => void;
  showRiskLayer: boolean;
  onToggleRiskLayer: () => void;
  isDemoMode: boolean;
  onSelectOrigin?: (place: { name: string; lat: number; lng: number; state?: string }) => void;
  onSelectDestination?: (place: { name: string; lat: number; lng: number; state?: string }) => void;
  onTriggerRecalculate?: () => void;
}

interface TileProvider {
  id: string;
  name: string;
  icon: string;
  url: string;
  subdomains?: string;
  attribution: string;
  maxZoom: number;
}

const TILE_PROVIDERS: TileProvider[] = [
  {
    id: 'google_roadmap',
    name: 'Google Maps (Roadmap)',
    icon: '🚗',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: 'Map data © Google',
    maxZoom: 20
  },
  {
    id: 'google_satellite',
    name: 'Google Maps (Satellite / Hybrid)',
    icon: '🛰️',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: 'Imagery © Google',
    maxZoom: 20
  },
  {
    id: 'osm',
    name: 'OpenStreetMap Standard (OSM)',
    icon: '🌍',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  },
  {
    id: 'carto_positron',
    name: 'CartoDB Positron (Pastel Light)',
    icon: '🎨',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    subdomains: 'abcd',
    attribution: '© CARTO, © OpenStreetMap',
    maxZoom: 19
  },
  {
    id: 'esri_nav',
    name: 'Esri World Navigation',
    icon: '🛣️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles © Esri',
    maxZoom: 19
  }
];

export const LiveMap: React.FC<LiveMapProps> = ({
  origin,
  destination,
  candidateRoutes,
  selectedRouteId,
  onSelectRoute,
  showTrafficCongestion,
  onToggleTrafficCongestion,
  showRiskLayer,
  onToggleRiskLayer,
  isDemoMode,
  onSelectOrigin,
  onSelectDestination,
  onTriggerRecalculate
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const polylinesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const congestionLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const animMarkerRef = useRef<L.Marker | null>(null);
  const animIntervalRef = useRef<any>(null);

  // Active tile layer state
  const [selectedProviderId, setSelectedProviderId] = useState<string>(() => {
    return localStorage.getItem('qroute_map_provider') || 'google_roadmap';
  });
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [showApiModal, setShowApiModal] = useState<boolean>(false);

  // Search Bar State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const searchDebounceRef = useRef<any>(null);

  // Click & reverse geocode state
  const [clickedLocation, setClickedLocation] = useState<{
    name: string;
    lat: number;
    lng: number;
    state?: string;
  } | null>(null);

  // Active Route Info Pill
  const [activeRouteInfo, setActiveRouteInfo] = useState<CandidateRoute | null>(null);
  const [showWaypoints, setShowWaypoints] = useState<boolean>(true);

  // API Key management
  const [googleApiKey, setGoogleApiKey] = useState<string>(() => {
    return localStorage.getItem('qroute_google_api_key') || '';
  });
  const [apiKeySavedNotice, setApiKeySavedNotice] = useState<boolean>(false);

  // Helper: Switch Map Tile Layer smoothly
  const applyTileLayer = useCallback((providerId: string, map: L.Map) => {
    const provider = TILE_PROVIDERS.find(p => p.id === providerId) || TILE_PROVIDERS[0];
    
    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const newLayer = L.tileLayer(provider.url, {
      maxZoom: provider.maxZoom,
      subdomains: provider.subdomains || 'abc',
      attribution: provider.attribution
    });

    newLayer.addTo(map);
    currentTileLayerRef.current = newLayer;
    localStorage.setItem('qroute_map_provider', providerId);
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = origin.lat || 22.9734;
    const initialLng = origin.lng || 78.6569;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 6,
      zoomControl: false,
      attributionControl: false
    });

    // Apply selected Map Tile Provider API
    applyTileLayer(selectedProviderId, map);

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Layer groups for dynamic management
    polylinesLayerGroupRef.current = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = L.layerGroup().addTo(map);
    congestionLayerGroupRef.current = L.layerGroup().addTo(map);

    // Click map to reverse geocode and set location
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      // Temporary quick popup while fetching address
      const popup = L.popup()
        .setLatLng(e.latlng)
        .setContent(`
          <div style="font-size: 11px; padding: 6px; min-width: 170px;">
            <div style="color: #163B63; font-weight: 700;">📍 Resolving Location...</div>
            <div style="color: #64748B; font-size: 10px;">${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E</div>
          </div>
        `)
        .openOn(map);

      try {
        const res = await fetch('/api/map/reverse-geocode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat, lng })
        });
        const data = await res.json();
        const place = data.place || { name: `${lat.toFixed(3)}, ${lng.toFixed(3)}`, state: 'India', lat, lng };

        setClickedLocation({
          name: place.name,
          lat,
          lng,
          state: place.state
        });

        popup.setContent(`
          <div style="font-size: 11px; padding: 6px; min-width: 200px;">
            <div style="font-size: 10px; font-weight: 700; color: #5CB8A5; text-transform: uppercase;">Selected Point</div>
            <div style="color: #163B63; font-weight: 700; font-size: 12px; margin-bottom: 2px;">${place.name}</div>
            <div style="color: #64748B; font-size: 10px; margin-bottom: 8px;">${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E</div>
            <div style="display: flex; gap: 6px;">
              <button id="btn-set-origin" style="background-color: #5CB8A5; color: white; border: none; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 600; cursor: pointer; flex: 1;">
                Set Origin (A)
              </button>
              <button id="btn-set-dest" style="background-color: #163B63; color: white; border: none; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 600; cursor: pointer; flex: 1;">
                Set Dest (B)
              </button>
            </div>
          </div>
        `);

        // Attach event listeners to popup buttons
        setTimeout(() => {
          const btnOrigin = document.getElementById('btn-set-origin');
          const btnDest = document.getElementById('btn-set-dest');
          if (btnOrigin) {
            btnOrigin.onclick = () => {
              if (onSelectOrigin) onSelectOrigin({ name: place.name, lat, lng, state: place.state });
              map.closePopup();
            };
          }
          if (btnDest) {
            btnDest.onclick = () => {
              if (onSelectDestination) onSelectDestination({ name: place.name, lat, lng, state: place.state });
              map.closePopup();
            };
          }
        }, 100);

      } catch (err) {
        popup.setContent(`
          <div style="font-size: 11px; padding: 4px;">
            <strong style="color: #163B63;">Map Coordinates</strong><br/>
            ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E<br/>
            <span style="color: #64748B;">Pan-India Road Network</span>
          </div>
        `);
      }
    });

    mapInstanceRef.current = map;

    // Fix Leaflet container size invalidation
    const invalidate = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    const timer1 = setTimeout(invalidate, 100);
    const timer2 = setTimeout(invalidate, 300);
    const timer3 = setTimeout(invalidate, 700);

    // ResizeObserver ensures map adjusts to any container size change
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        invalidate();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    window.addEventListener('resize', invalidate);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('resize', invalidate);
      if (resizeObserver) resizeObserver.disconnect();
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Switch Provider Handler
  const handleSelectProvider = (providerId: string) => {
    setSelectedProviderId(providerId);
    setShowLayerMenu(false);
    if (mapInstanceRef.current) {
      applyTileLayer(providerId, mapInstanceRef.current);
    }
  };

  // Live Location Search Handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (!val || val.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/places/search?q=${encodeURIComponent(val.trim())}`);
        const data = await res.json();
        if (data.places) {
          setSearchResults(data.places);
          setShowSearchResults(true);
        }
      } catch (err) {
        console.warn('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);
  };

  // Fly to search place on map
  const handleSelectSearchResult = (place: any) => {
    setSearchQuery(place.name);
    setShowSearchResults(false);
    const map = mapInstanceRef.current;
    if (!map || !place.lat || !place.lng) return;

    map.flyTo([place.lat, place.lng], 13, { duration: 1.2 });

    const markersGroup = markersLayerGroupRef.current;
    if (markersGroup) {
      const searchMarker = L.marker([place.lat, place.lng], {
        icon: L.divIcon({
          className: 'search-marker-pin',
          html: `
            <div style="background-color: #163B63; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.3); border: 2.5px solid #5CB8A5;">
              📍
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })
      }).addTo(markersGroup);

      searchMarker.bindPopup(`
        <div style="font-size: 11px; padding: 6px; min-width: 180px;">
          <strong style="color: #163B63; font-size: 13px;">${place.name}</strong><br/>
          <span style="color: #64748B;">${place.state} • ${place.category || 'Location'}</span><br/>
          <div style="display: flex; gap: 6px; margin-top: 8px;">
            <button id="search-set-origin" style="background-color: #5CB8A5; color: white; border: none; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 600; cursor: pointer; flex: 1;">
              Set Origin (A)
            </button>
            <button id="search-set-dest" style="background-color: #163B63; color: white; border: none; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 600; cursor: pointer; flex: 1;">
              Set Dest (B)
            </button>
          </div>
        </div>
      `).openPopup();

      setTimeout(() => {
        const btnOrigin = document.getElementById('search-set-origin');
        const btnDest = document.getElementById('search-set-dest');
        if (btnOrigin && onSelectOrigin) {
          btnOrigin.onclick = () => {
            onSelectOrigin({ name: place.name, lat: place.lat, lng: place.lng, state: place.state });
            map.closePopup();
          };
        }
        if (btnDest && onSelectDestination) {
          btnDest.onclick = () => {
            onSelectDestination({ name: place.name, lat: place.lat, lng: place.lng, state: place.state });
            map.closePopup();
          };
        }
      }, 100);
    }
  };

  // Update polylines, congestion, and markers when routes change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !candidateRoutes || candidateRoutes.length === 0) return;

    const polylinesGroup = polylinesLayerGroupRef.current;
    const markersGroup = markersLayerGroupRef.current;
    const congestionGroup = congestionLayerGroupRef.current;

    if (polylinesGroup) polylinesGroup.clearLayers();
    if (markersGroup) markersGroup.clearLayers();
    if (congestionGroup) congestionGroup.clearLayers();
    if (animIntervalRef.current) clearInterval(animIntervalRef.current);

    const activeRoute = candidateRoutes.find(r => r.id === selectedRouteId) || candidateRoutes[0];
    setActiveRouteInfo(activeRoute);

    const allLatLngs: [number, number][] = [];

    // Custom Icon Creator
    const createMarkerIcon = (label: string, bgClass: string) => {
      return L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="background-color: ${bgClass}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.25); border: 2.5px solid white;">
            ${label}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
    };

    // 1. Draw alternative routes first (in background)
    candidateRoutes.forEach(route => {
      const isSelected = route.id === activeRoute.id;
      if (isSelected || !route.coordinates || route.coordinates.length === 0) return;

      const poly = L.polyline(route.coordinates as L.LatLngExpression[], {
        color: '#94A3B8',
        weight: 4,
        opacity: 0.65,
        dashArray: '6, 6'
      });

      poly.on('click', () => {
        onSelectRoute(route.id);
      });

      poly.bindTooltip(`
        <div style="font-size: 11px; padding: 2px;">
          <strong>${route.name}</strong><br/>
          ${route.durationMin} min (${route.distanceKm} km)
        </div>
      `, { sticky: true });

      if (polylinesGroup) poly.addTo(polylinesGroup);
    });

    // 2. Draw selected / recommended route on top
    if (activeRoute && activeRoute.coordinates && activeRoute.coordinates.length > 0) {
      const coords = activeRoute.coordinates as [number, number][];
      coords.forEach(pt => allLatLngs.push(pt));

      // Determine dynamic route color based on category
      let routeColor = '#163B63';
      let glowColor = '#5B9BD5';

      if (activeRoute.isRecommended) {
        routeColor = '#163B63'; // Q-Route Deep Navy
        glowColor = '#5CB8A5'; // Teal outer glow
      } else if (activeRoute.isFastest) {
        routeColor = '#D97706'; // Amber for Fastest
        glowColor = '#FDE68A';
      } else if (activeRoute.isEcoFriendly) {
        routeColor = '#059669'; // Emerald for Eco-Friendly
        glowColor = '#A7F3D0';
      } else if (activeRoute.isSafest) {
        routeColor = '#7C3AED'; // Royal Purple for Safest Road
        glowColor = '#DDD6FE';
      } else if (activeRoute.isLowestTraffic) {
        routeColor = '#0891B2'; // Cyan for Smooth Flow
        glowColor = '#A5F3FC';
      } else if (activeRoute.isShortest) {
        routeColor = '#475569'; // Slate for Shortest Distance
        glowColor = '#CBD5E1';
      }

      // Outer glow
      const outerGlow = L.polyline(coords as L.LatLngExpression[], {
        color: glowColor,
        weight: 9,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      });
      if (polylinesGroup) outerGlow.addTo(polylinesGroup);

      // Main route polyline
      const mainLine = L.polyline(coords as L.LatLngExpression[], {
        color: routeColor,
        weight: 5.5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      });

      mainLine.bindTooltip(`
        <div style="font-size: 12px; font-weight: 700; color: ${routeColor};">
          ${activeRoute.categoryBadge || (activeRoute.isRecommended ? '★ Q-ROUTE OPTIMAL' : activeRoute.name)}
        </div>
        <div style="font-size: 11px; font-weight: 600; color: #1E293B;">
          ${activeRoute.durationMin} min (${activeRoute.distanceKm} km)
        </div>
        ${activeRoute.advantageTag ? `<div style="font-size: 10px; color: #059669; font-weight: 600;">✨ ${activeRoute.advantageTag}</div>` : ''}
      `, { permanent: false, sticky: true });

      if (polylinesGroup) mainLine.addTo(polylinesGroup);

      // 3. Draw Congested Segments if enabled
      if (showTrafficCongestion && activeRoute.congestedSegments) {
        activeRoute.congestedSegments.forEach(seg => {
          if (!seg.start || !seg.end) return;
          const segCoords = [seg.start, seg.end] as L.LatLngExpression[];
          const color = seg.level === 'Heavy' ? '#EFA3A3' : '#F2B880';
          const congestPoly = L.polyline(segCoords, {
            color,
            weight: 7.5,
            opacity: 0.9,
            lineCap: 'round'
          });
          congestPoly.bindTooltip(`Traffic Bottleneck: +${seg.delayMin} min (${seg.level})`, { sticky: true });
          if (congestionGroup) congestPoly.addTo(congestionGroup);
        });
      }

      // 4. Origin & Destination Markers
      const startPt = coords[0];
      const endPt = coords[coords.length - 1];

      if (startPt && markersGroup) {
        const startMarker = L.marker(startPt, {
          icon: createMarkerIcon('A', '#5CB8A5')
        }).bindPopup(`
          <div style="font-size: 12px; line-height: 1.4;">
            <span style="font-size: 10px; font-weight: 700; color: #5CB8A5; text-transform: uppercase;">Origin Point (A)</span><br/>
            <strong style="color: #163B63;">${origin.name}</strong><br/>
            <span style="color: #64748B; font-size: 11px;">${startPt[0].toFixed(4)}° N, ${startPt[1].toFixed(4)}° E</span>
          </div>
        `);
        startMarker.addTo(markersGroup);
      }

      if (endPt && markersGroup) {
        const endMarker = L.marker(endPt, {
          icon: createMarkerIcon('B', '#163B63')
        }).bindPopup(`
          <div style="font-size: 12px; line-height: 1.4;">
            <span style="font-size: 10px; font-weight: 700; color: #163B63; text-transform: uppercase;">Destination Point (B)</span><br/>
            <strong style="color: #163B63;">${destination.name}</strong><br/>
            <span style="color: #64748B; font-size: 11px;">${endPt[0].toFixed(4)}° N, ${endPt[1].toFixed(4)}° E</span>
          </div>
        `);
        endMarker.addTo(markersGroup);
      }

      // 5. Intermediate Places & Corridor Waypoints along the active route
      if (showWaypoints && activeRoute.intermediatePlaces && activeRoute.intermediatePlaces.length > 0 && markersGroup) {
        activeRoute.intermediatePlaces.forEach(wp => {
          if (!wp.lat || !wp.lng) return;

          const wpColor = routeColor; // matches selected route's color theme
          const wpMarker = L.marker([wp.lat, wp.lng], {
            icon: L.divIcon({
              className: 'intermediate-waypoint-marker',
              html: `
                <div style="background-color: white; color: ${wpColor}; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 11px; box-shadow: 0 3px 10px rgba(0,0,0,0.22); border: 2.5px solid ${wpColor}; cursor: pointer; transition: transform 0.15s ease;" title="Stop ${wp.stepNumber}: ${wp.name}">
                  ${wp.stepNumber}
                </div>
              `,
              iconSize: [26, 26],
              iconAnchor: [13, 13]
            })
          });

          wpMarker.bindTooltip(`
            <div style="font-size: 11px; font-weight: 700; color: #163B63;">
              ${wp.stepNumber}. ${wp.name}
            </div>
            <div style="font-size: 10px; color: #64748B;">
              +${wp.kmFromOrigin} km • ETA: ~${wp.etaMinutes} min
            </div>
          `, { permanent: false, sticky: true });

          wpMarker.bindPopup(`
            <div style="font-size: 12px; line-height: 1.4; min-width: 220px; padding: 2px;">
              <div style="font-size: 9px; font-weight: 800; color: ${wpColor}; text-transform: uppercase; letter-spacing: 0.5px;">
                Intermediate Waypoint #${wp.stepNumber} • ${wp.highwayTag || 'Corridor Route'}
              </div>
              <strong style="color: #0F172A; font-size: 13px; display: block; margin-top: 2px;">${wp.name}</strong>
              <span style="color: #64748B; font-size: 11px;">${wp.type || 'Corridor Stop'}</span>
              
              <div style="margin-top: 8px; padding: 6px 10px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0; display: flex; justify-content: space-between; font-size: 11px;">
                <div>
                  <span style="color: #64748B; display: block; font-size: 9px;">FROM ORIGIN</span>
                  <strong>+${wp.kmFromOrigin} km</strong>
                </div>
                <div style="text-align: right;">
                  <span style="color: #64748B; display: block; font-size: 9px;">PASSAGE ETA</span>
                  <strong>~${wp.etaMinutes} min</strong>
                </div>
              </div>

              <div style="margin-top: 6px; display: flex; align-items: center; justify-content: space-between; font-size: 10px;">
                <span style="color: #64748B;">Traffic Flow:</span>
                <span style="font-weight: 700; color: ${wp.trafficStatus === 'Heavy' ? '#DC2626' : wp.trafficStatus === 'Moderate' ? '#D97706' : '#059669'};">
                  ● ${wp.trafficStatus || 'Clear'}
                </span>
              </div>
            </div>
          `);

          wpMarker.addTo(markersGroup);
        });
      }

      // 6. Animated Simulation Vehicle Marker along the active route
      if (coords.length > 1 && markersGroup) {
        const carIcon = L.divIcon({
          className: 'anim-vehicle-marker',
          html: `
            <div style="background-color: #163B63; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #5CB8A5; box-shadow: 0 0 14px rgba(92,184,165,0.9); display: flex; align-items: center; justify-content: center;">
              <div style="background-color: white; width: 4px; height: 4px; border-radius: 50%;"></div>
            </div>
          `,
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });

        let currentIdx = 0;
        const animMarker = L.marker(coords[0], { icon: carIcon }).addTo(markersGroup);
        animMarkerRef.current = animMarker;

        animIntervalRef.current = setInterval(() => {
          currentIdx = (currentIdx + 1) % coords.length;
          animMarker.setLatLng(coords[currentIdx]);
        }, 1200);
      }
    }

    // Auto-fit bounds
    if (allLatLngs.length > 0) {
      const bounds = L.latLngBounds(allLatLngs);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }

    map.invalidateSize();
  }, [candidateRoutes, selectedRouteId, showTrafficCongestion, showRiskLayer, showWaypoints, origin, destination]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current || !activeRouteInfo?.coordinates) return;
    const coords = activeRouteInfo.coordinates as [number, number][];
    if (coords.length > 0) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(coords), { padding: [50, 50] });
    }
  };

  const handleViewIndia = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([22.5, 78.9], 5);
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('qroute_google_api_key', googleApiKey.trim());
    setApiKeySavedNotice(true);
    setTimeout(() => setApiKeySavedNotice(false), 2500);
  };

  const activeProvider = TILE_PROVIDERS.find(p => p.id === selectedProviderId) || TILE_PROVIDERS[0];

  return (
    <div className="relative w-full h-[520px] lg:h-[600px] rounded-card overflow-hidden bg-slate-100 border border-slate-200/90 shadow-soft">
      {/* Leaflet Map DOM Node */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* FLOATING TOP BAR: Search & Geocoding API + Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-none">
        
        {/* Left Side: Live Place Search Bar */}
        <div className="relative pointer-events-auto w-full sm:w-80 max-w-sm">
          <div className="flex items-center bg-white/95 backdrop-blur-md rounded-xl px-3 py-2 shadow-soft border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => { if (searchResults.length > 0) setShowSearchResults(true); }}
              placeholder="Search place / landmark in India..."
              className="w-full text-xs text-text-main bg-transparent outline-none placeholder:text-slate-400"
            />
            {isSearching && (
              <span className="w-3.5 h-3.5 border-2 border-qnavy border-t-transparent rounded-full animate-spin shrink-0" />
            )}
            {searchQuery && !isSearching && (
              <button onClick={() => { setSearchQuery(''); setSearchResults([]); setShowSearchResults(false); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-lg border border-slate-200 max-h-56 overflow-y-auto z-50 py-1">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSearchResult(item)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-start space-x-2 border-b border-slate-100 last:border-none"
                >
                  <MapPin className="w-3.5 h-3.5 text-qnavy shrink-0 mt-0.5" />
                  <div className="truncate">
                    <div className="font-semibold text-text-main truncate">{item.name}</div>
                    <div className="text-[10px] text-text-muted truncate">{item.displayName || item.state}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Quick Status Indicators & Badges */}
        <div className="flex items-center space-x-2 pointer-events-auto self-end sm:self-auto">
          {/* Active Map API Badge */}
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-soft-sm border border-slate-200 flex items-center space-x-1.5 text-xs">
            <span>{activeProvider.icon}</span>
            <span className="font-semibold text-qnavy text-[11px] hidden sm:inline">
              {activeProvider.name.split('(')[0]}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Map API Active" />
          </div>

          {/* Telemetry / Demo Badge */}
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-soft-sm border border-slate-200 flex items-center space-x-1.5 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-qorange' : 'bg-emerald-500'}`} />
            <span className="font-semibold text-qnavy">
              {isDemoMode ? 'Demo Mode' : 'Live OSRM'}
            </span>
          </div>
        </div>
      </div>

      {/* FLOATING CONTROLS: Top Right */}
      <div className="absolute top-16 right-3 z-10 flex flex-col space-y-2 items-end">
        
        {/* Layer / Map API Switcher Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/95 backdrop-blur-md text-qnavy hover:bg-slate-50 border border-slate-200 shadow-soft flex items-center space-x-1.5 transition-smooth"
            title="Switch Map Tile Provider & APIs"
          >
            <Layers className="w-3.5 h-3.5 text-qnavy" />
            <span className="hidden sm:inline">Map APIs</span>
            <span className="text-base">{activeProvider.icon}</span>
          </button>

          {/* Provider Dropdown */}
          {showLayerMenu && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 text-[11px] font-bold text-qnavy uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                <span>Select Map API Provider</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">All Free</span>
              </div>
              <div className="space-y-1 mt-1">
                {TILE_PROVIDERS.map(p => {
                  const isSelected = p.id === selectedProviderId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectProvider(p.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-smooth ${
                        isSelected 
                          ? 'bg-qnavy text-white font-semibold' 
                          : 'text-text-main hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="text-base">{p.icon}</span>
                        <div className="truncate">
                          <div className="truncate">{p.name}</div>
                          <div className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                            {p.attribution.split(',')[0]}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-qteal" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Traffic Layer Toggle */}
        <button
          onClick={onToggleTrafficCongestion}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-soft transition-smooth ${
            showTrafficCongestion
              ? 'bg-qnavy text-white'
              : 'bg-white/95 backdrop-blur-md text-text-muted hover:text-text-main border border-slate-200'
          }`}
          title="Toggle Real-Time Traffic Congestion"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Traffic</span>
        </button>

        {/* Risk Layer Toggle */}
        <button
          onClick={onToggleRiskLayer}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-soft transition-smooth ${
            showRiskLayer
              ? 'bg-qorange-dark text-white'
              : 'bg-white/95 backdrop-blur-md text-text-muted hover:text-text-main border border-slate-200'
          }`}
          title="Toggle MoRTH Historical Road Risk"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Risk Layer</span>
        </button>

        {/* Waypoints / Intermediate Places Toggle */}
        <button
          onClick={() => setShowWaypoints(!showWaypoints)}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-soft transition-smooth ${
            showWaypoints
              ? 'bg-qteal text-white shadow-soft-sm'
              : 'bg-white/95 backdrop-blur-md text-text-muted hover:text-text-main border border-slate-200'
          }`}
          title="Toggle In-Between Places & Corridor Waypoints"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Waypoints</span>
          {activeRouteInfo?.intermediatePlaces && activeRouteInfo.intermediatePlaces.length > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              showWaypoints ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {activeRouteInfo.intermediatePlaces.length}
            </span>
          )}
        </button>

        {/* API Settings Modal Toggle */}
        <button
          onClick={() => setShowApiModal(true)}
          className="p-2.5 rounded-xl bg-white/95 backdrop-blur-md text-text-muted hover:text-qnavy border border-slate-200 shadow-soft transition-smooth"
          title="Configure Map APIs & Keys"
        >
          <Settings2 className="w-4 h-4" />
        </button>

        {/* Fit Bounds Button */}
        <button
          onClick={handleRecenter}
          className="p-2.5 rounded-xl bg-white/95 backdrop-blur-md text-text-muted hover:text-qnavy border border-slate-200 shadow-soft transition-smooth"
          title="Fit Active Route to Viewport"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Pan-India View Button */}
        <button
          onClick={handleViewIndia}
          className="p-2.5 rounded-xl bg-white/95 backdrop-blur-md text-text-muted hover:text-qnavy border border-slate-200 shadow-soft transition-smooth"
          title="Zoom to All-India View"
        >
          <Globe className="w-4 h-4" />
        </button>
      </div>

      {/* MAP LEGEND: Bottom Left */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-soft border border-slate-200/90 text-[11px] max-w-xs">
        <div className="font-bold text-qnavy mb-1.5 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Compass className="w-3.5 h-3.5 text-qteal" />
            <span>Interactive Mobility Map</span>
          </div>
          <span className="text-[10px] text-slate-400 font-normal">Click map to set A/B</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-text-muted text-[10px]">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 bg-qnavy rounded-full"></span>
            <span>Q-Route Recommended</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 bg-slate-400 rounded-full border border-dashed"></span>
            <span>Alternative Arterials</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Low Congestion</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
            <span>Traffic Choke-Point</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 text-white flex items-center justify-center text-[8px] font-bold">A</span>
            <span>Origin Point</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-qnavy text-white flex items-center justify-center text-[8px] font-bold">B</span>
            <span>Destination Point</span>
          </div>
          <div className="flex items-center space-x-1.5 col-span-2">
            <span className="w-3.5 h-3.5 rounded-full border border-qnavy bg-white text-qnavy text-[8px] font-bold flex items-center justify-center">1</span>
            <span>Intermediate Places / Waypoints</span>
          </div>
        </div>
      </div>

      {/* IN-BETWEEN PLACES CORRIDOR STRIP: Bottom Center/Right */}
      {showWaypoints && activeRouteInfo?.intermediatePlaces && activeRouteInfo.intermediatePlaces.length > 0 && (
        <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-soft border border-slate-200/90 max-w-lg hidden lg:block">
          <div className="flex items-center justify-between text-[10px] font-bold text-qnavy uppercase tracking-wider mb-1.5">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-qteal" />
              <span>In-Between Places ({activeRouteInfo.intermediatePlaces.length} Waypoints)</span>
            </div>
            <span className="text-slate-400 font-normal lowercase">click place to inspect</span>
          </div>
          <div className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg shrink-0 border border-emerald-200">
              A: {origin.name.split(',')[0]}
            </span>
            <ArrowRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
            {activeRouteInfo.intermediatePlaces.map((wp, i) => (
              <React.Fragment key={wp.id || i}>
                <button
                  onClick={() => {
                    if (mapInstanceRef.current && wp.lat && wp.lng) {
                      mapInstanceRef.current.flyTo([wp.lat, wp.lng], 12, { duration: 1 });
                    }
                  }}
                  className="text-[10px] font-medium bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-qnavy px-2 py-0.5 rounded-lg border border-slate-200/80 shrink-0 flex items-center space-x-1 transition-smooth cursor-pointer"
                  title={`Click to zoom: ${wp.name} (+${wp.kmFromOrigin} km, ~${wp.etaMinutes} min)`}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-qnavy text-white text-[8px] font-bold flex items-center justify-center shrink-0">
                    {wp.stepNumber}
                  </span>
                  <span className="truncate max-w-[100px]">{wp.name}</span>
                </button>
                {i < (activeRouteInfo.intermediatePlaces?.length || 0) - 1 && (
                  <ArrowRight className="w-2.5 h-2.5 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            ))}
            <ArrowRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
            <span className="text-[10px] font-bold text-qnavy bg-blue-50 px-2 py-0.5 rounded-lg shrink-0 border border-blue-200">
              B: {destination.name.split(',')[0]}
            </span>
          </div>
        </div>
      )}

      {/* API CONFIGURATION MODAL */}
      {showApiModal && (
        <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-qnavy flex items-center justify-center text-white">
                  <Settings2 className="w-4 h-4 text-qteal" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-qnavy">Map APIs & Key Settings</h3>
                  <p className="text-[11px] text-text-muted">Configure Live Google & OpenStreetMap APIs</p>
                </div>
              </div>
              <button onClick={() => setShowApiModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4">
              {/* API Status Matrix */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-2">
                <div className="font-semibold text-text-main flex items-center justify-between">
                  <span>Integrated Map Services</span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    Active & Ready
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center space-x-1 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>OpenStreetMap Tiles</span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Google Roadmap Tiles</span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>OSRM Routing Engine</span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Nominatim Geocoder</span>
                  </div>
                </div>
              </div>

              {/* Google Maps / Routes API Key Input */}
              <div>
                <label className="block text-xs font-semibold text-qnavy mb-1">
                  Google Maps / Routes API Key (Optional)
                </label>
                <p className="text-[10px] text-text-muted mb-2">
                  Add your Google Cloud Key for enterprise Google traffic data. Leave blank to run seamlessly on free OpenStreetMap & OSRM!
                </p>
                <input
                  type="password"
                  value={googleApiKey}
                  onChange={e => setGoogleApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-qnavy"
                />
              </div>

              {apiKeySavedNotice && (
                <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg font-medium flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>API Key saved successfully to local session!</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowApiModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-text-main border border-slate-200"
              >
                Close
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-qnavy text-white hover:bg-qnavy-light"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
