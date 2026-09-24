/**
 * Q-ROUTE Places & Cities Service
 * Connects the comprehensive All-India Cities database (all 28 states & 8 UTs)
 * with live OpenStreetMap Nominatim Geocoding.
 */

import { ALL_INDIAN_STATES, CITIES_BY_STATE, ALL_INDIAN_CITIES_FLAT } from './allIndiaCitiesData.js';
import { POPULAR_INDIAN_CORRIDORS } from './indianPlacesData.js';

export const placesService = {
  /**
   * Get all Indian States and Union Territories with place/city counts
   */
  getStates() {
    return ALL_INDIAN_STATES.map(state => {
      const cities = CITIES_BY_STATE[state] || [];
      return {
        name: state,
        cityCount: cities.length,
        isUT: [
          'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
          'Delhi-NCR', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
        ].includes(state)
      };
    });
  },

  /**
   * Get all cities belonging to a specific state
   */
  getCitiesByState(stateName = '') {
    if (!stateName) return [];
    // Case-insensitive lookup
    const foundState = Object.keys(CITIES_BY_STATE).find(
      s => s.toLowerCase() === stateName.trim().toLowerCase()
    );
    if (!foundState) return [];

    return (CITIES_BY_STATE[foundState] || []).map(c => ({
      name: c.name,
      state: foundState,
      lat: c.lat,
      lng: c.lng,
      isCapital: Boolean(c.isCapital),
      category: c.isCapital ? 'Capital City' : 'District Hub',
      displayName: `${c.name}, ${foundState}`
    }));
  },

  /**
   * Get all cities grouped by state
   */
  getAllCitiesGrouped() {
    return CITIES_BY_STATE;
  },

  /**
   * Get popular interstate demonstration corridors
   */
  getPopularCorridors() {
    return POPULAR_INDIAN_CORRIDORS;
  },

  /**
   * Search places in India (Local 500+ Cities Registry + Live OSM Nominatim Geocoding)
   * @param {string} query - user search text
   * @param {string} stateFilter - optional state filter
   */
  async searchPlaces(query = '', stateFilter = '') {
    const q = (query || '').trim().toLowerCase();

    // 1. If state filter is set but query is empty, return all cities of that state!
    if (!q && stateFilter) {
      return this.getCitiesByState(stateFilter);
    }

    // 2. Filter local Indian cities database
    let matches = ALL_INDIAN_CITIES_FLAT.filter(city => {
      const matchState = !stateFilter || city.state.toLowerCase() === stateFilter.toLowerCase();
      if (!matchState) return false;
      if (!q) return true;

      return (
        city.name.toLowerCase().includes(q) ||
        city.state.toLowerCase().includes(q) ||
        city.category.toLowerCase().includes(q)
      );
    });

    // If query has exact/prefix matches in our verified city registry, prioritize them
    if (matches.length > 0 || q.length < 3) {
      return matches.slice(0, 15).map(p => ({
        ...p,
        source: 'INDIAN_CORE_REGISTRY',
        displayName: `${p.name}, ${p.state}`
      }));
    }

    // 3. Fallback to live OpenStreetMap Nominatim for local addresses/towns/landmarks in India
    try {
      const encodedQ = encodeURIComponent(query + (stateFilter ? `, ${stateFilter}, India` : ', India'));
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodedQ}&countrycodes=in&format=json&addressdetails=1&limit=8`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const resp = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'Q-Route-SmartMobility-SIH/1.0 (contact: qroute.hackathon@gmail.com)'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const osmResults = await resp.json();
        const mappedOsm = osmResults.map((item, idx) => ({
          id: `osm-${item.place_id || idx}`,
          name: item.name || item.display_name.split(',')[0],
          state: item.address?.state || stateFilter || 'India',
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          category: item.type || 'Location',
          source: 'OPENSTREETMAP_NOMINATIM',
          displayName: item.display_name
        }));

        const combined = [...matches, ...mappedOsm];
        return combined.slice(0, 15);
      }
    } catch (e) {
      console.warn('[Q-Route Places] Nominatim fallback:', e.message);
    }

    return matches.slice(0, 15);
  },

  /**
   * Resolve an origin or destination into coordinates
   */
  async resolveCoordinates(locationInput) {
    if (!locationInput) return null;

    if (typeof locationInput === 'object' && locationInput.lat && locationInput.lng) {
      return {
        name: locationInput.name || 'Selected Point',
        lat: Number(locationInput.lat),
        lng: Number(locationInput.lng),
        state: locationInput.state || 'India'
      };
    }

    const text = String(locationInput).trim();
    // Check in verified Indian flat database
    const exact = ALL_INDIAN_CITIES_FLAT.find(
      c => c.name.toLowerCase() === text.toLowerCase() ||
           c.displayName.toLowerCase() === text.toLowerCase() ||
           text.toLowerCase().startsWith(c.name.toLowerCase())
    );
    if (exact) {
      return { name: exact.name, lat: exact.lat, lng: exact.lng, state: exact.state };
    }

    // Search via searchPlaces
    const results = await this.searchPlaces(text);
    if (results.length > 0) {
      return { name: results[0].name, lat: results[0].lat, lng: results[0].lng, state: results[0].state };
    }

    // Default fallback
    return { name: text, lat: 26.9124, lng: 75.7873, state: 'Rajasthan' };
  },

  /**
   * Reverse geocode coordinates [lat, lng] into place/city name
   */
  async reverseGeocode(lat, lng) {
    const latitude = Number(lat);
    const longitude = Number(lng);
    if (isNaN(latitude) || isNaN(longitude)) {
      return { name: 'Unknown Location', lat: 26.9124, lng: 75.7873, state: 'India' };
    }

    // 1. Check closest city in our verified Indian cities database
    let closestCity = null;
    let minDistanceKm = Infinity;

    for (const city of ALL_INDIAN_CITIES_FLAT) {
      const dLat = (city.lat - latitude) * Math.PI / 180;
      const dLng = (city.lng - longitude) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(latitude * Math.PI / 180) * Math.cos(city.lat * Math.PI / 180) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distKm = 6371 * c;

      if (distKm < minDistanceKm) {
        minDistanceKm = distKm;
        closestCity = city;
      }
    }

    // 2. Try Nominatim reverse geocode for precise street/town
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
      
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'Q-Route-SmartMobility-SIH/1.0' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const data = await resp.json();
        const address = data.address || {};
        const localName = address.suburb || address.neighbourhood || address.road || address.town || address.village || address.city || data.name;
        const stateName = address.state || closestCity?.state || 'India';
        
        return {
          name: localName ? `${localName} (${stateName})` : (closestCity ? closestCity.name : `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`),
          displayName: data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          lat: latitude,
          lng: longitude,
          state: stateName,
          source: 'OPENSTREETMAP_NOMINATIM'
        };
      }
    } catch (err) {
      // Fallback to nearest city
    }

    if (closestCity && minDistanceKm < 50) {
      return {
        name: `${closestCity.name} Vicinity`,
        displayName: `${closestCity.name}, ${closestCity.state}`,
        lat: latitude,
        lng: longitude,
        state: closestCity.state,
        source: 'INDIAN_CORE_REGISTRY'
      };
    }

    return {
      name: `Point (${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E)`,
      displayName: `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      lat: latitude,
      lng: longitude,
      state: 'India',
      source: 'COORDINATES'
    };
  }
};
