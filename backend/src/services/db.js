import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = process.env.VERCEL ? '/tmp/qroute_data' : path.resolve(__dirname, '../../data');
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  // Silent fallback for read-only serverless filesystems
}

const DB_FILE = path.join(DATA_DIR, 'qroute_store.json');

// Initialize database file structure
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('[Q-Route DB] Notice: Using in-memory store:', e.message);
  }
  return {
    searches: [],
    feedback: [],
    settings: { initializedAt: new Date().toISOString() }
  };
}

let store = loadDb();

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (e) {
    // In-memory persistence fallback on serverless
  }
}

// Seed with some initial hackathon demo searches if empty
if (store.searches.length === 0) {
  store.searches = [
    {
      id: 1,
      origin: 'Jaipur (MI Road)',
      destination: 'Ajmer (Dargah / Station)',
      vehicleType: 'car_petrol',
      routingMode: 'balanced',
      selectedRoute: 'Q-Route Corridor: Bypass via Bagru - Naraina',
      durationMin: 133,
      distanceKm: 138.1,
      trafficDelayMin: 3,
      fuelConsumed: 10.2,
      fuelUnit: 'L',
      qScore: 94,
      totalCost: 0.38,
      isDemoMode: 1,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 2,
      origin: 'Connaught Place, New Delhi',
      destination: 'DLF Cyber City, Gurugram',
      vehicleType: 'ev',
      routingMode: 'low_traffic',
      selectedRoute: 'Q-Route Corridor: MG Road via Vasant Kunj',
      durationMin: 43,
      distanceKm: 31.2,
      trafficDelayMin: 5,
      fuelConsumed: 5.1,
      fuelUnit: 'kWh',
      qScore: 92,
      totalCost: 0.41,
      isDemoMode: 1,
      created_at: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ];
  saveDb();
}

export const dbService = {
  isHealthy() {
    return true;
  },

  saveRouteSearch(data) {
    const record = {
      id: store.searches.length > 0 ? Math.max(...store.searches.map(s => s.id || 0)) + 1 : 1,
      origin: data.origin,
      destination: data.destination,
      vehicleType: data.vehicleType || 'car_petrol',
      routingMode: data.routingMode || 'balanced',
      selectedRoute: data.selectedRoute || 'Q-Route Recommended',
      durationMin: data.durationMin || 0,
      distanceKm: data.distanceKm || 0,
      trafficDelayMin: data.trafficDelayMin || 0,
      fuelConsumed: data.fuelConsumed || 0,
      fuelUnit: data.fuelUnit || 'L',
      qScore: data.qScore || 0,
      totalCost: data.totalCost || 0,
      isDemoMode: data.isDemoMode ? 1 : 0,
      candidateRoutes: data.candidateRoutes || [],
      created_at: new Date().toISOString()
    };
    store.searches.unshift(record);
    // Keep last 100 searches
    if (store.searches.length > 100) store.searches.pop();
    saveDb();
    return record;
  },

  getRecentSearches(limit = 10) {
    return store.searches.slice(0, limit);
  },

  saveFeedback(feedback) {
    const rec = {
      id: store.feedback.length + 1,
      routeSearchId: feedback.routeSearchId || null,
      rating: feedback.rating,
      comment: feedback.comment || '',
      created_at: new Date().toISOString()
    };
    store.feedback.unshift(rec);
    saveDb();
    return rec;
  },

  getAnalytics() {
    const totalSearches = store.searches.length;
    const avgScore = totalSearches > 0 
      ? Math.round(store.searches.reduce((acc, s) => acc + (s.qScore || 85), 0) / totalSearches)
      : 92;
    const avgDelay = totalSearches > 0
      ? Math.round((store.searches.reduce((acc, s) => acc + (s.trafficDelayMin || 5), 0) / totalSearches) * 10) / 10
      : 4.5;

    // Aggregations
    const modeCounts = {};
    const vehicleCounts = {};
    store.searches.forEach(s => {
      modeCounts[s.routingMode] = (modeCounts[s.routingMode] || 0) + 1;
      vehicleCounts[s.vehicleType] = (vehicleCounts[s.vehicleType] || 0) + 1;
    });

    return {
      totalSearches,
      avgQScore: avgScore,
      avgTrafficDelayMin: avgDelay,
      estimatedTimeSavedMin: totalSearches * 8,
      estimatedFuelSavedLOrKwh: parseFloat((totalSearches * 1.6).toFixed(1)),
      estimatedCO2SavedKg: parseFloat((totalSearches * 2.8).toFixed(1)),
      distributionByMode: Object.entries(modeCounts).map(([mode, count]) => ({ mode, count })),
      distributionByVehicle: Object.entries(vehicleCounts).map(([vehicle, count]) => ({ vehicle, count }))
    };
  }
};
