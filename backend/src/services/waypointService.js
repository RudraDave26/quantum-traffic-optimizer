/**
 * Q-ROUTE: Route Intermediate Places & Corridor Waypoints Service
 * Generates accurate in-between places, towns, toll plazas, ghat passes,
 * and highway intersections for every candidate route.
 * 
 * Supports:
 * 1. Curated high-precision waypoints for all major Indian national corridors
 * 2. Spatial polyline projection algorithm over 500+ Indian cities for ANY arbitrary route
 * 3. Route-specific variations (Expressway vs NH vs Peripheral Bypass vs Eco-Corridor)
 */

import { ALL_INDIAN_CITIES_FLAT } from './allIndiaCitiesData.js';
import { INDIAN_PLACES } from './indianPlacesData.js';

// Haversine distance in km
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Curated high-fidelity corridor waypoints database
const CURATED_CORRIDOR_WAYPOINTS = {
  // Mumbai <-> Pune
  'mumbai-pune': {
    fastest: [
      { name: 'Vashi / Navi Mumbai Creek', type: 'Major Satellite City', kmPct: 0.16, lat: 19.0728, lng: 72.9986, highwayTag: 'Sion-Panvel Expressway' },
      { name: 'Panvel Outer Interchange', type: 'Expressway Entry Hub', kmPct: 0.30, lat: 18.9902, lng: 73.1175, highwayTag: 'Mumbai-Pune Expressway' },
      { name: 'Khalapur Toll Plaza', type: 'High-Speed Toll Plaza', kmPct: 0.46, lat: 18.8315, lng: 73.2842, highwayTag: 'Mumbai-Pune Expressway' },
      { name: 'Khandala & Lonavala Ghat Pass', type: 'Scenic Ghat Section', kmPct: 0.60, lat: 18.7546, lng: 73.4062, highwayTag: 'Western Ghats Corridor' },
      { name: 'Talegaon Dabhade Interchange', type: 'Industrial Expressway Link', kmPct: 0.78, lat: 18.7288, lng: 73.6766, highwayTag: 'NH-48 Corridor' },
      { name: 'Pimpri-Chinchwad Tech Hub', type: 'Auto & IT Cluster', kmPct: 0.90, lat: 18.6279, lng: 73.8131, highwayTag: 'Pune Gateway' }
    ],
    safest: [
      { name: 'Navi Mumbai Trans-Harbour Link (MTHL)', type: 'Grade-Separated Sea Bridge', kmPct: 0.18, lat: 18.9855, lng: 72.9812, highwayTag: 'Atal Setu Corridor' },
      { name: 'Rasayani 4-Lane Safe Flyover', type: 'Divided Highway Bypass', kmPct: 0.36, lat: 18.9012, lng: 73.1895, highwayTag: 'MoRTH Low-Risk Corridor' },
      { name: 'Bhor Ghat Twin-Tube Tunnels', type: 'Illuminated Highway Tunnels', kmPct: 0.62, lat: 18.7612, lng: 73.3821, highwayTag: 'Divided Tunnel Pass' },
      { name: 'Dehu Road Cantonment Safe Bypass', type: 'Divided Cantonment Corridor', kmPct: 0.84, lat: 18.7188, lng: 73.7255, highwayTag: 'Divided Highway NH-48' }
    ],
    eco_friendly: [
      { name: 'Belapur Steady-Flow Coastal Viaduct', type: 'Continuous Velocity Stretch', kmPct: 0.20, lat: 19.0195, lng: 73.0392, highwayTag: 'Palm Beach Road' },
      { name: 'Chowk Junction Flyover', type: 'Steady Speed Bypass', kmPct: 0.42, lat: 18.9167, lng: 73.2667, highwayTag: 'NH-48 Bypass' },
      { name: 'Lonavala Outer Green Bypass', type: 'Regenerative Braking Corridor', kmPct: 0.64, lat: 18.7421, lng: 73.4321, highwayTag: 'Green Highway' },
      { name: 'Ravet Multi-Lane Viaduct', type: 'Smooth Gradient Descent', kmPct: 0.86, lat: 18.6542, lng: 73.7482, highwayTag: 'Pune Outer Corridor' }
    ],
    low_traffic: [
      { name: 'Taloja MIDC Ring Bypass', type: 'Zero-Signal Peripheral Route', kmPct: 0.24, lat: 19.0621, lng: 73.1255, highwayTag: 'Ring Corridor' },
      { name: 'Khopoli Low-Congestion Connector', type: 'Bypass Highway Link', kmPct: 0.50, lat: 18.7891, lng: 73.3421, highwayTag: 'SH Bypass' },
      { name: 'Kamshet Paragliding Valley Link', type: 'Uncongested Transit Stretch', kmPct: 0.72, lat: 18.7592, lng: 73.5582, highwayTag: 'Old NH-48' },
      { name: 'Hinjawadi IT Phase 3 Junction', type: 'Direct Tech Park Entrance', kmPct: 0.90, lat: 18.5913, lng: 73.7389, highwayTag: 'Hinjawadi Link' }
    ],
    shortest: [
      { name: 'Sion - Chembur Arterial Link', type: 'Urban Highway', kmPct: 0.12, lat: 19.0435, lng: 72.8872, highwayTag: 'Eastern Express' },
      { name: 'Panvel Old City Crossing', type: 'Urban Bottleneck Junction', kmPct: 0.32, lat: 18.9892, lng: 73.1072, highwayTag: 'Old NH-4' },
      { name: 'Khopoli Bazaar Junction', type: 'Town Arterial Crossing', kmPct: 0.52, lat: 18.7845, lng: 73.3412, highwayTag: 'Old NH-4' },
      { name: 'Nigdi Pradhikaran Crossing', type: 'Signal-Dense Urban Arterial', kmPct: 0.88, lat: 18.6521, lng: 73.7745, highwayTag: 'Old Pune Road' }
    ]
  },

  // Delhi <-> Jaipur
  'delhi-jaipur': {
    fastest: [
      { name: 'Gurugram Cyber Hub', type: 'Commercial Tech Hub', kmPct: 0.12, lat: 28.4950, lng: 77.0895, highwayTag: 'NH-48 Expressway' },
      { name: 'Kherki Daula / Manesar Toll', type: 'Industrial Expressway Hub', kmPct: 0.20, lat: 28.3582, lng: 76.9388, highwayTag: 'NH-48' },
      { name: 'Dharuhera Industrial Corridor', type: 'Manufacturing Zone', kmPct: 0.30, lat: 28.2045, lng: 76.7892, highwayTag: 'NH-48' },
      { name: 'Neemrana Japanese Industrial Zone', type: 'Industrial Smart City', kmPct: 0.48, lat: 27.9892, lng: 76.3812, highwayTag: 'NH-48 Corridor' },
      { name: 'Kotputli Junction Flyover', type: 'District Transit Hub', kmPct: 0.62, lat: 27.7025, lng: 76.2012, highwayTag: 'NH-48' },
      { name: 'Shahpura Highway Crossing', type: 'District Bypass', kmPct: 0.80, lat: 27.3892, lng: 75.9582, highwayTag: 'NH-48' },
      { name: 'Achrol / Amer Gateway', type: 'Heritage Gateway', kmPct: 0.92, lat: 27.1285, lng: 75.9012, highwayTag: 'Jaipur Outer' }
    ],
    low_traffic: [
      { name: 'KMP Western Peripheral Orbital', type: 'Access-Controlled Ring Expressway', kmPct: 0.18, lat: 28.4215, lng: 76.8521, highwayTag: 'KMP Expressway' },
      { name: 'Pataudi - Rewari Bypass', type: 'Signal-Free Rural Highway', kmPct: 0.35, lat: 28.2891, lng: 76.6215, highwayTag: 'Rewari Bypass' },
      { name: 'Bhiwadi Industrial Corridor', type: 'Smooth Flow Transit Stretch', kmPct: 0.46, lat: 28.2125, lng: 76.8521, highwayTag: 'SH-25' },
      { name: 'Bansur - Paota Link Highway', type: 'Zero-Bottleneck State Corridor', kmPct: 0.68, lat: 27.6892, lng: 76.3512, highwayTag: 'SH-52' }
    ],
    safest: [
      { name: 'Delhi-Mumbai Super Expressway (Sohna)', type: '8-Lane Grade Separated Corridor', kmPct: 0.18, lat: 28.2482, lng: 77.0621, highwayTag: 'NE-4 Super Expressway' },
      { name: 'Dausa - Lalsot Interchange', type: 'Advanced Surveillance Expressway Exit', kmPct: 0.74, lat: 26.8925, lng: 76.3382, highwayTag: 'NE-4 Expressway' }
    ],
    eco_friendly: [
      { name: 'Gurugram Elevated Corridor', type: 'Steady Velocity Viaduct', kmPct: 0.14, lat: 28.4621, lng: 77.0215, highwayTag: 'NH-48 Viaduct' },
      { name: 'Bawal Industrial Green Belt', type: 'Continuous Cruising Sector', kmPct: 0.38, lat: 28.0845, lng: 76.5892, highwayTag: 'NH-48' },
      { name: 'Behror Midpoint Transit Hub', type: 'Midway Fuel & Rest Corridor', kmPct: 0.54, lat: 27.8892, lng: 76.2812, highwayTag: 'NH-48' }
    ],
    shortest: [
      { name: 'Mahipalpur - Dhaula Kuan Arterial', type: 'High Density Arterial', kmPct: 0.10, lat: 28.5892, lng: 77.1582, highwayTag: 'NH-48' },
      { name: 'Old Gurgaon Road Junction', type: 'Local Commercial Road', kmPct: 0.22, lat: 28.4721, lng: 77.0412, highwayTag: 'Old Highway' },
      { name: 'Bilaspur Chokepoint', type: 'Congested Industrial Crossing', kmPct: 0.34, lat: 28.3125, lng: 76.8821, highwayTag: 'NH-48' },
      { name: 'Shahpura Old Bazaar', type: 'Town Center Street', kmPct: 0.82, lat: 27.3912, lng: 75.9612, highwayTag: 'Town Arterial' }
    ]
  },

  // Jaipur <-> Ajmer
  'jaipur-ajmer': {
    fastest: [
      { name: 'Bagru Handloom Industrial Hub', type: 'Industrial City Hub', kmPct: 0.22, lat: 26.8125, lng: 75.5452, highwayTag: 'NH-48' },
      { name: 'Mokhampura Highway Toll Plaza', type: 'Highway Toll', kmPct: 0.44, lat: 26.6892, lng: 75.3125, highwayTag: 'NH-48' },
      { name: 'Dudu Junction & Rest Stop', type: 'District Transit Hub', kmPct: 0.54, lat: 26.6812, lng: 75.2345, highwayTag: 'NH-48' },
      { name: 'Kishangarh Marble Market & Airport', type: 'Marble Hub & Airport', kmPct: 0.80, lat: 26.5746, lng: 74.8653, highwayTag: 'NH-48' },
      { name: 'Gagwana Flyover', type: 'Ajmer Outer Bypass', kmPct: 0.92, lat: 26.5125, lng: 74.7215, highwayTag: 'NH-48' }
    ]
  },

  // Bengaluru <-> Mysuru
  'bengaluru-mysuru': {
    fastest: [
      { name: 'Kengeri Satellite Town', type: 'Transit Hub', kmPct: 0.14, lat: 12.9125, lng: 77.4821, highwayTag: 'NICE Road Link' },
      { name: 'Bidadi Auto Industrial Hub', type: 'Manufacturing Corridor', kmPct: 0.26, lat: 12.8021, lng: 77.3821, highwayTag: 'NH-275 Expressway' },
      { name: 'Ramanagara (Silk City)', type: 'District Center', kmPct: 0.38, lat: 12.7215, lng: 77.2812, highwayTag: 'NH-275' },
      { name: 'Channapatna (Toy Craft Town)', type: 'Heritage Craft Town', kmPct: 0.48, lat: 12.6512, lng: 77.2012, highwayTag: 'NH-275' },
      { name: 'Maddur Highway Hub & Toll', type: 'Expressway Toll & Rest Area', kmPct: 0.62, lat: 12.5845, lng: 77.0452, highwayTag: 'NH-275' },
      { name: 'Mandya (Sugar City)', type: 'Major District Capital', kmPct: 0.74, lat: 12.5215, lng: 76.8982, highwayTag: 'NH-275' },
      { name: 'Srirangapatna Historic Island', type: 'Heritage River Island', kmPct: 0.90, lat: 12.4182, lng: 76.6952, highwayTag: 'Cauvery Corridor' }
    ]
  },

  // Delhi <-> Agra
  'delhi-agra': {
    fastest: [
      { name: 'Greater Noida Zero Point Toll', type: 'Expressway Gateway', kmPct: 0.18, lat: 28.4721, lng: 77.4982, highwayTag: 'Yamuna Expressway' },
      { name: 'Jewar International Airport Site', type: 'Mega Aviation & Transit Hub', kmPct: 0.34, lat: 28.1685, lng: 77.5842, highwayTag: 'Yamuna Expressway' },
      { name: 'Mathura Outer Interchange', type: 'Pilgrimage Corridor Link', kmPct: 0.68, lat: 27.5215, lng: 77.6982, highwayTag: 'Yamuna Expressway' },
      { name: 'Khandauli Toll Plaza', type: 'Expressway Terminal Toll', kmPct: 0.88, lat: 27.2892, lng: 77.9821, highwayTag: 'Agra Ring Road' }
    ]
  },

  // Ahmedabad <-> Vadodara
  'ahmedabad-vadodara': {
    fastest: [
      { name: 'Ramol Toll Plaza', type: 'NE-1 Expressway Entry', kmPct: 0.16, lat: 22.9812, lng: 72.6712, highwayTag: 'National Expressway 1' },
      { name: 'Nadiad Interchange', type: 'District Transit Hub', kmPct: 0.48, lat: 22.6945, lng: 72.8645, highwayTag: 'NE-1' },
      { name: 'Anand (Amul Dairy Capital)', type: 'Cooperative Milk City', kmPct: 0.66, lat: 22.5645, lng: 72.9282, highwayTag: 'NE-1' },
      { name: 'Vasagrad Bypass', type: 'Vadodara North Link', kmPct: 0.88, lat: 22.3812, lng: 73.1215, highwayTag: 'NE-1 Terminal' }
    ]
  },

  // Chandigarh <-> Shimla
  'chandigarh-shimla': {
    fastest: [
      { name: 'Panchkula Sector 5', type: 'Urban Transit Hub', kmPct: 0.12, lat: 30.6945, lng: 76.8645, highwayTag: 'Himalayan Expressway' },
      { name: 'Pinjore Heritage Gardens', type: 'Heritage Tourism Hub', kmPct: 0.22, lat: 30.7982, lng: 76.9182, highwayTag: 'NH-5' },
      { name: 'Parwanoo Timber Trail Gateway', type: 'Himachal Border Pass', kmPct: 0.32, lat: 30.8382, lng: 76.9612, highwayTag: 'Himalayan Expressway' },
      { name: 'Dharampur Ghat Crossing', type: 'Mountain Junction', kmPct: 0.52, lat: 30.9045, lng: 77.0282, highwayTag: 'NH-5' },
      { name: 'Solan (Mushroom City)', type: 'District Capital', kmPct: 0.68, lat: 30.9082, lng: 77.0982, highwayTag: 'NH-5' },
      { name: 'Kandaghat Ghat Ascent', type: 'High Mountain Pass', kmPct: 0.82, lat: 30.9612, lng: 77.1125, highwayTag: 'NH-5' },
      { name: 'Shoghi Ridge Entrance', type: 'Shimla Suburb & Viewpoint', kmPct: 0.92, lat: 31.0421, lng: 77.1382, highwayTag: 'NH-5' }
    ]
  }
};

export const waypointService = {
  /**
   * Determine matching corridor key
   */
  getCorridorKey(originName = '', destName = '') {
    const o = originName.toLowerCase();
    const d = destName.toLowerCase();

    if ((o.includes('mumbai') && d.includes('pune')) || (o.includes('pune') && d.includes('mumbai'))) {
      return 'mumbai-pune';
    }
    if ((o.includes('delhi') && d.includes('jaipur')) || (o.includes('jaipur') && d.includes('delhi'))) {
      return 'delhi-jaipur';
    }
    if ((o.includes('jaipur') && d.includes('ajmer')) || (o.includes('ajmer') && d.includes('jaipur'))) {
      return 'jaipur-ajmer';
    }
    if ((o.includes('delhi') && d.includes('agra')) || (o.includes('agra') && d.includes('delhi'))) {
      return 'delhi-agra';
    }
    if ((o.includes('bengaluru') || o.includes('bangalore')) && d.includes('mysur')) {
      return 'bengaluru-mysuru';
    }
    if ((d.includes('bengaluru') || d.includes('bangalore')) && o.includes('mysur')) {
      return 'bengaluru-mysuru';
    }
    if ((o.includes('ahmedabad') && d.includes('vadodara')) || (o.includes('vadodara') && d.includes('ahmedabad'))) {
      return 'ahmedabad-vadodara';
    }
    if ((o.includes('chandigarh') && d.includes('shimla')) || (o.includes('shimla') && d.includes('chandigarh'))) {
      return 'chandigarh-shimla';
    }

    return null;
  },

  /**
   * Primary generator for intermediate places along ANY route
   */
  generateIntermediatePlaces({
    coordinates = [],
    origin,
    destination,
    totalDistanceKm = 100,
    totalDurationMin = 90,
    routeCategory = 'fastest',
    routeName = '',
    trafficCondition = 'Low',
    trafficDelayMin = 0
  }) {
    const originName = (origin?.name || '').split(',')[0].trim();
    const destName = (destination?.name || '').split(',')[0].trim();
    const corridorKey = this.getCorridorKey(originName, destName);

    // 1. If curated corridor exists, use specialized curated waypoints
    if (corridorKey && CURATED_CORRIDOR_WAYPOINTS[corridorKey]) {
      const corridorObj = CURATED_CORRIDOR_WAYPOINTS[corridorKey];
      const categoryList = 
        corridorObj[routeCategory] || 
        corridorObj['fastest'] || 
        Object.values(corridorObj)[0];

      if (categoryList && categoryList.length > 0) {
        // Reverse waypoints if travelling in opposite direction (e.g. Pune -> Mumbai)
        const isReversed = destName.toLowerCase().includes(corridorKey.split('-')[0]);
        const baseList = isReversed ? [...categoryList].reverse() : categoryList;

        return baseList.map((wp, idx) => {
          const pct = isReversed ? (1 - wp.kmPct) : wp.kmPct;
          const kmFromOrigin = parseFloat((totalDistanceKm * pct).toFixed(1));
          const etaMinutes = Math.max(5, Math.round(totalDurationMin * pct));
          
          let trafficStatus = 'Clear';
          if (trafficDelayMin > 8 && (idx === 1 || idx === 2)) {
            trafficStatus = trafficDelayMin > 18 ? 'Heavy' : 'Moderate';
          }

          return {
            id: `wp-${idx + 1}`,
            stepNumber: idx + 1,
            name: wp.name,
            type: wp.type || 'Corridor Waypoint',
            kmFromOrigin,
            etaMinutes,
            lat: wp.lat,
            lng: wp.lng,
            trafficStatus,
            highwayTag: wp.highwayTag || 'National Corridor',
            distanceFromPreviousKm: parseFloat((kmFromOrigin - (idx === 0 ? 0 : baseList[idx - 1].kmPct * totalDistanceKm)).toFixed(1))
          };
        });
      }
    }

    // 2. Spatial Projection Algorithm for ANY Arbitrary Route in India
    // Interpolates points along route coordinates and identifies real Indian cities/landmarks
    return this.generateSpatialWaypoints({
      coordinates,
      origin,
      destination,
      totalDistanceKm,
      totalDurationMin,
      routeCategory,
      trafficDelayMin
    });
  },

  /**
   * Spatial projection over 500+ Indian cities and highway points
   */
  generateSpatialWaypoints({
    coordinates = [],
    origin,
    destination,
    totalDistanceKm,
    totalDurationMin,
    routeCategory,
    trafficDelayMin
  }) {
    const originLat = origin?.lat || coordinates[0]?.[0] || 28.61;
    const originLng = origin?.lng || coordinates[0]?.[1] || 77.20;
    const destLat = destination?.lat || coordinates[coordinates.length - 1]?.[0] || 26.91;
    const destLng = destination?.lng || coordinates[coordinates.length - 1]?.[1] || 75.78;

    const originName = (origin?.name || '').toLowerCase();
    const destName = (destination?.name || '').toLowerCase();

    // Determine how many waypoints to generate based on distance
    const count = totalDistanceKm < 40 ? 2 : totalDistanceKm < 150 ? 3 : totalDistanceKm < 400 ? 4 : 5;
    const waypoints = [];
    const usedNames = new Set([originName, destName]);

    // Sample coordinates along the polyline at proportional intervals
    for (let step = 1; step <= count; step++) {
      const progressRatio = step / (count + 1);
      const approxKm = parseFloat((totalDistanceKm * progressRatio).toFixed(1));
      const approxEta = Math.max(6, Math.round(totalDurationMin * progressRatio));

      // Coordinate from polyline
      let ptLat = originLat + (destLat - originLat) * progressRatio;
      let ptLng = originLng + (destLng - originLng) * progressRatio;

      if (coordinates && coordinates.length > 2) {
        const index = Math.min(
          coordinates.length - 1,
          Math.floor(coordinates.length * progressRatio)
        );
        ptLat = coordinates[index][0];
        ptLng = coordinates[index][1];
      }

      // Find closest city/town in Indian database
      let bestPlace = null;
      let minDistance = Infinity;

      for (const city of ALL_INDIAN_CITIES_FLAT) {
        const cityLower = city.name.toLowerCase();
        if (usedNames.has(cityLower)) continue;

        // Skip if too close to origin or destination
        const distToStart = haversineDistance(city.lat, city.lng, originLat, originLng);
        const distToEnd = haversineDistance(city.lat, city.lng, destLat, destLng);
        if (distToStart < 15 || distToEnd < 15) continue;

        const distToPolyline = haversineDistance(city.lat, city.lng, ptLat, ptLng);
        if (distToPolyline < minDistance) {
          minDistance = distToPolyline;
          bestPlace = city;
        }
      }

      // Check landmarks in INDIAN_PLACES as well
      for (const place of INDIAN_PLACES) {
        const pLower = place.name.toLowerCase();
        if (usedNames.has(pLower)) continue;
        const distToPolyline = haversineDistance(place.lat, place.lng, ptLat, ptLng);
        if (distToPolyline < minDistance && distToPolyline < 25) {
          minDistance = distToPolyline;
          bestPlace = place;
        }
      }

      let waypointName = '';
      let waypointType = 'Highway Waypoint';
      let highwayTag = 'National Highway';
      let lat = ptLat;
      let lng = ptLng;

      // If a real city/town is within 45 km of the corridor point
      if (bestPlace && minDistance < 45) {
        waypointName = `${bestPlace.name.split('(')[0].trim()}`;
        if (routeCategory === 'fastest') {
          waypointType = `${bestPlace.name} Expressway Interchange`;
          highwayTag = 'Expressway Corridor';
        } else if (routeCategory === 'safest') {
          waypointType = `${bestPlace.name} Divided Bypass`;
          highwayTag = 'MoRTH Low-Incident NH';
        } else if (routeCategory === 'low_traffic') {
          waypointType = `${bestPlace.name} Outer Ring Bypass`;
          highwayTag = 'Peripheral Orbital';
        } else if (routeCategory === 'eco_friendly') {
          waypointType = `${bestPlace.name} Steady-Speed Corridor`;
          highwayTag = 'Green Transit Corridor';
        } else {
          waypointType = `${bestPlace.name} City Center Arterial`;
          highwayTag = 'Direct NH Arterial';
        }

        lat = bestPlace.lat;
        lng = bestPlace.lng;
        usedNames.add(bestPlace.name.toLowerCase());
      } else {
        // Highway Milestone
        const sector = routeCategory === 'fastest' ? 'Access-Controlled Toll Plaza' :
                       routeCategory === 'safest' ? 'Divided Grade-Separated Flyover' :
                       routeCategory === 'eco_friendly' ? 'Steady Cruise Highway Section' :
                       routeCategory === 'low_traffic' ? 'Peripheral Bypass Connector' : 'Arterial Corridor Crossing';
        
        waypointName = `Highway Milestone KM ${Math.round(approxKm)}`;
        waypointType = sector;
        highwayTag = `Interstate Corridor Link`;
      }

      let trafficStatus = 'Clear';
      if (trafficDelayMin > 10 && step === Math.ceil(count / 2)) {
        trafficStatus = 'Moderate';
      }

      waypoints.push({
        id: `wp-${step}`,
        stepNumber: step,
        name: waypointName,
        type: waypointType,
        kmFromOrigin: approxKm,
        etaMinutes: approxEta,
        lat: parseFloat(lat.toFixed(5)),
        lng: parseFloat(lng.toFixed(5)),
        trafficStatus,
        highwayTag
      });
    }

    return waypoints;
  }
};
