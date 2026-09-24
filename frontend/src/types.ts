export type VehicleType = 'car_petrol' | 'car_diesel' | 'ev' | 'bike' | 'truck';

export type RoutingMode = 'balanced' | 'fastest' | 'fuel_efficient' | 'low_traffic';

export interface FuelEstimate {
  value: number;
  unit: 'L' | 'kWh';
  label: string;
  vehicleName: string;
  estimatedCo2Kg: number;
  trafficPenaltyLitresOrKwh: number;
  disclaimer: string;
}

export interface RiskDetails {
  score: number;
  level: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  color: string;
  source: string;
  isHistorical: boolean;
  label: string;
}

export interface CongestedSegment {
  start: [number, number];
  end: [number, number];
  level: 'Low' | 'Moderate' | 'Heavy';
  delayMin: number;
}

export interface IntermediatePlace {
  id: string;
  stepNumber: number;
  name: string;
  type?: string;
  kmFromOrigin: number;
  etaMinutes: number;
  lat: number;
  lng: number;
  trafficStatus?: 'Clear' | 'Moderate' | 'Heavy';
  highwayTag?: string;
  distanceFromPreviousKm?: number;
}

export interface CandidateRoute {
  id: string;
  name: string;
  badge: string;
  recommendationBadge?: string;
  distanceKm: number;
  durationMin: number;
  staticDurationMin: number;
  trafficDelayMin: number;
  trafficCondition: 'Low' | 'Moderate' | 'Heavy';
  coordinates?: [number, number][];
  congestedSegments?: CongestedSegment[];
  fuelEstimate: FuelEstimate;
  riskScore: number;
  riskDetails: RiskDetails;
  cost: number;
  qScore: number;
  isRecommended: boolean;
  whyThisRoute: string;
  breakdownPercent?: {
    travelTime: number;
    traffic: number;
    fuel: number;
    distance: number;
    risk: number;
  };
  trafficSpikeActive?: boolean;
  isFastest?: boolean;
  isEcoFriendly?: boolean;
  isSafest?: boolean;
  isLowestTraffic?: boolean;
  isShortest?: boolean;
  primaryCategory?: string;
  categoryBadge?: string;
  categoryIcon?: string;
  advantageTag?: string;
  intermediatePlaces?: IntermediatePlace[];
}

export interface RouteSuggestions {
  optimal: CandidateRoute;
  fastest: CandidateRoute;
  ecoFriendly: CandidateRoute;
  safest: CandidateRoute;
  lowTraffic: CandidateRoute;
  shortest: CandidateRoute;
}

export interface OptimizationResponse {
  success: boolean;
  searchId: number;
  origin: { name: string; lat?: number; lng?: number };
  destination: { name: string; lat?: number; lng?: number };
  dataSource: 'REAL_TIME_GOOGLE_ROUTES' | 'DEMO_SIMULATION';
  isDemoMode: boolean;
  city: string;
  dynamicTrafficSurgeActive: boolean;
  dynamicTrafficOffsetMin: number;
  lastTrafficUpdate: string;
  weightsUsed: {
    time: number;
    traffic: number;
    fuel: number;
    risk: number;
    distance: number;
  };
  recommendedRoute: CandidateRoute;
  candidateRoutes: CandidateRoute[];
  optimizationMeta: {
    algorithm: string;
    qubitCount: number;
    iterationsRun: number;
    convergenceLog: Array<{
      iteration: number;
      bestCost: number;
      selectedCandidate: string;
      averageEntropy: number;
    }>;
    disclaimer: string;
  };
}

export interface TrafficStatus {
  connected: boolean;
  condition: 'Low' | 'Moderate' | 'Heavy' | 'Low to Moderate';
  averageSpeed: string;
  congestedSegmentsCount: number;
  activeRoutesMonitored: number;
  trafficDelayAvgMin: number;
  dynamicSurgeActive: boolean;
  surgeDelayAddedMin: number;
  lastUpdated: string;
  incidentFeed: Array<{
    id: number;
    location: string;
    type: string;
    severity: string;
    delay: string;
    timestamp: string;
  }>;
}

export interface SystemHealth {
  status: string;
  timestamp: string;
  services: {
    backend: { status: string; latencyMs: number };
    trafficApi: { status: string; isLiveKeyConfigured: boolean };
    mapEngine: { status: string };
    optimizationEngine: { status: string };
    database: { status: string };
  };
}

export interface CorridorPreset {
  id: string;
  name: string;
  city?: string;
  description?: string;
  origin: { name: string; lat: number; lng: number };
  destination: { name: string; lat: number; lng: number };
  routeCount?: number;
  distanceKm?: number;
  state?: string;
}

export interface PlaceItem {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  category: string;
  displayName?: string;
  source?: string;
}

export interface IndianState {
  name: string;
  placeCount: number;
  isUT: boolean;
}

export interface MapTileProvider {
  id: string;
  name: string;
  type: string;
  attribution: string;
  url: string;
  subdomains?: string;
  maxZoom: number;
  isDefault?: boolean;
}

export interface MapConfig {
  hasGoogleKey: boolean;
  defaultCenter: { lat: number; lng: number; zoom: number };
  providers: MapTileProvider[];
}

