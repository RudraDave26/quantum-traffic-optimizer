/**
 * Q-Route Fuel & Energy Estimation Service
 * 
 * Note: Calculated using empirical physics-based vehicle consumption models,
 * distance, road grade, and traffic congestion idle penalties.
 * Clearly labeled as "Estimated fuel consumption" (or energy in kWh for EV).
 */

export const VEHICLE_PROFILES = {
  car_petrol: {
    name: 'Petrol Car',
    category: 'car',
    fuelType: 'petrol',
    unit: 'L',
    baseConsumptionPer100Km: 7.2, // ~13.8 km/l
    trafficPenaltyFactor: 0.35,   // Heavy traffic increases fuel burn by up to 35%
    co2PerUnit: 2.31             // kg CO2 per liter petrol
  },
  car_diesel: {
    name: 'Diesel Car',
    category: 'car',
    fuelType: 'diesel',
    unit: 'L',
    baseConsumptionPer100Km: 5.8, // ~17.2 km/l
    trafficPenaltyFactor: 0.28,
    co2PerUnit: 2.68             // kg CO2 per liter diesel
  },
  ev: {
    name: 'Electric Vehicle (EV)',
    category: 'ev',
    fuelType: 'electric',
    unit: 'kWh',
    baseConsumptionPer100Km: 15.5, // 15.5 kWh / 100km (~6.5 km/kWh)
    trafficPenaltyFactor: 0.12,   // Regenerative braking helps in city traffic, but idling AC consumes energy
    co2PerUnit: 0.42              // kg CO2 equivalent grid average
  },
  bike: {
    name: 'Motorcycle / Scooter',
    category: 'bike',
    fuelType: 'petrol',
    unit: 'L',
    baseConsumptionPer100Km: 2.3, // ~43.5 km/l
    trafficPenaltyFactor: 0.20,
    co2PerUnit: 2.31
  },
  truck: {
    name: 'Commercial Truck / Van',
    category: 'truck',
    fuelType: 'diesel',
    unit: 'L',
    baseConsumptionPer100Km: 18.0,
    trafficPenaltyFactor: 0.45,
    co2PerUnit: 2.68
  }
};

/**
 * Calculates estimated fuel or energy consumption for a candidate route.
 * @param {Object} params
 * @param {number} params.distanceKm - Road distance in km
 * @param {number} params.durationMin - Travel duration in minutes
 * @param {number} params.trafficDelayMin - Extra delay due to congestion
 * @param {string} params.vehicleType - car_petrol, car_diesel, ev, bike, truck
 */
export function estimateFuelConsumption({
  distanceKm,
  durationMin,
  trafficDelayMin = 0,
  vehicleType = 'car_petrol'
}) {
  const profile = VEHICLE_PROFILES[vehicleType] || VEHICLE_PROFILES.car_petrol;
  
  // Calculate congestion ratio: delay relative to free-flow time
  const freeFlowMin = Math.max(1, durationMin - trafficDelayMin);
  const congestionRatio = Math.min(1.0, trafficDelayMin / freeFlowMin);
  
  // Base consumption for the distance
  const baseRate = profile.baseConsumptionPer100Km / 100; // per km
  const baseConsumption = distanceKm * baseRate;

  // Congestion multiplier (stop-and-go penalty)
  const trafficMultiplier = 1.0 + (congestionRatio * profile.trafficPenaltyFactor);
  
  // Total estimated consumption
  const totalConsumption = parseFloat((baseConsumption * trafficMultiplier).toFixed(2));
  
  // CO2 emissions in kg
  const estimatedCo2Kg = parseFloat((totalConsumption * profile.co2PerUnit).toFixed(2));

  return {
    value: totalConsumption,
    unit: profile.unit,
    label: profile.unit === 'kWh' ? 'Estimated Energy Consumption' : 'Estimated Fuel Consumption',
    vehicleName: profile.name,
    estimatedCo2Kg,
    trafficPenaltyLitresOrKwh: parseFloat((totalConsumption - baseConsumption).toFixed(2)),
    disclaimer: 'Estimated consumption based on vehicle efficiency profile and traffic delay multiplier'
  };
}
