/**
 * Q-ROUTE: Quantum-Inspired Intelligent Traffic Route Optimization Engine
 * 
 * NOTE: This module implements Quantum-Inspired Evolutionary Optimization (QEA / Q-bits)
 * on a classical computer. It uses probabilistic quantum bit state vectors, quantum rotation
 * gates, and multi-objective Pareto-cost evaluation to explore combinatorial route options.
 * It does NOT claim to run on physical quantum hardware.
 */

export const WEIGHT_PRESETS = {
  balanced: {
    name: 'Balanced',
    time: 0.35,
    traffic: 0.25,
    fuel: 0.20,
    risk: 0.10,
    distance: 0.10
  },
  fastest: {
    name: 'Fastest Route',
    time: 0.55,
    traffic: 0.25,
    fuel: 0.10,
    risk: 0.05,
    distance: 0.05
  },
  fuel_efficient: {
    name: 'Fuel Efficient / Eco',
    time: 0.15,
    traffic: 0.20,
    fuel: 0.50,
    risk: 0.05,
    distance: 0.10
  },
  low_traffic: {
    name: 'Low Traffic & Smooth Flow',
    time: 0.25,
    traffic: 0.50,
    fuel: 0.15,
    risk: 0.05,
    distance: 0.05
  }
};

/**
 * Single Qubit representation [alpha, beta]
 * |psi> = alpha|0> + beta|1>, where |alpha|^2 + |beta|^2 = 1
 */
class Qubit {
  constructor(angle = Math.PI / 4) {
    this.angle = angle; // Initial state in equal superposition: alpha = beta = 1/sqrt(2)
    this.alpha = Math.cos(angle);
    this.beta = Math.sin(angle);
  }

  // Quantum rotation gate: R(dTheta)
  rotate(dTheta) {
    this.angle += dTheta;
    this.alpha = Math.cos(this.angle);
    this.beta = Math.sin(this.angle);
  }

  // Classical probabilistic measurement (collapse)
  measure() {
    // Probability of measuring |1> is |beta|^2
    const probOne = this.beta * this.beta;
    return Math.random() < probOne ? 1 : 0;
  }
}

/**
 * Calculates raw normalized cost for a route
 */
function evaluateCost(route, weights, maxBounds) {
  // Normalize each component [0, 1] relative to the candidate set
  const normTime = maxBounds.maxDuration > 0 ? route.durationMin / maxBounds.maxDuration : 0;
  const normTraffic = maxBounds.maxDelay > 0 ? (route.trafficDelayMin || 0) / maxBounds.maxDelay : 0;
  const normFuel = maxBounds.maxFuel > 0 ? route.fuelEstimate.value / maxBounds.maxFuel : 0;
  const normRisk = (route.riskScore || 20) / 100;
  const normDistance = maxBounds.maxDistance > 0 ? route.distanceKm / maxBounds.maxDistance : 0;

  const totalCost = (
    weights.time * normTime +
    weights.traffic * normTraffic +
    weights.fuel * normFuel +
    weights.risk * normRisk +
    weights.distance * normDistance
  );

  return {
    totalCost: parseFloat(totalCost.toFixed(4)),
    breakdown: {
      time: parseFloat((weights.time * normTime).toFixed(4)),
      traffic: parseFloat((weights.traffic * normTraffic).toFixed(4)),
      fuel: parseFloat((weights.fuel * normFuel).toFixed(4)),
      risk: parseFloat((weights.risk * normRisk).toFixed(4)),
      distance: parseFloat((weights.distance * normDistance).toFixed(4))
    }
  };
}

/**
 * Run Quantum-Inspired Optimization over candidate routes
 * @param {Array} candidateRoutes - List of generated routes
 * @param {string} mode - 'balanced' | 'fastest' | 'fuel_efficient' | 'low_traffic'
 * @param {Object} customWeights - Optional user override weights
 */
export function optimizeRoutes(candidateRoutes, mode = 'balanced', customWeights = null) {
  if (!candidateRoutes || candidateRoutes.length === 0) {
    throw new Error('No candidate routes provided for optimization');
  }

  const weights = customWeights || WEIGHT_PRESETS[mode] || WEIGHT_PRESETS.balanced;

  // Compute maximum metrics across candidates for normalization
  const maxBounds = {
    maxDuration: Math.max(...candidateRoutes.map(r => r.durationMin || 1)),
    maxDelay: Math.max(1, ...candidateRoutes.map(r => r.trafficDelayMin || 0)),
    maxFuel: Math.max(0.1, ...candidateRoutes.map(r => r.fuelEstimate?.value || 1)),
    maxDistance: Math.max(1, ...candidateRoutes.map(r => r.distanceKm || 1))
  };

  const evaluatedCandidates = candidateRoutes.map((route, idx) => {
    const { totalCost, breakdown } = evaluateCost(route, weights, maxBounds);
    return {
      ...route,
      originalIndex: idx,
      cost: totalCost,
      costBreakdown: breakdown
    };
  });

  // Quantum-Inspired Exploration:
  // We represent the candidate selection space as an N-qubit register.
  // Each Q-bit represents the probability amplitude of preferring candidate i.
  const N = evaluatedCandidates.length;
  const qRegister = Array.from({ length: N }, () => new Qubit(Math.PI / 4)); // equal superposition

  const iterations = 35;
  const convergenceLog = [];
  let bestCandidate = evaluatedCandidates[0];
  let minCost = evaluatedCandidates[0].cost;

  // Quantum-inspired evolutionary cycle
  for (let it = 0; it < iterations; it++) {
    // 1. Quantum measurement: collapse qubits into classical binary state
    const measuredStates = qRegister.map(q => q.measure());
    
    // 2. Select sampled candidate with probability proportional to measurement
    let sampledIdx = measuredStates.findIndex(bit => bit === 1);
    if (sampledIdx === -1) {
      sampledIdx = Math.floor(Math.random() * N);
    }
    const current = evaluatedCandidates[sampledIdx];

    // 3. Compare with current best
    if (current.cost < minCost) {
      minCost = current.cost;
      bestCandidate = current;
    }

    // 4. Update Q-register using Quantum Rotation Gate:
    // Rotate qubits towards the best candidate's binary projection
    for (let i = 0; i < N; i++) {
      const targetBit = i === bestCandidate.originalIndex ? 1 : 0;
      const currentBit = measuredStates[i];
      // Adaptive rotation angle (decreases as iterations progress - simulated cooling)
      const dTheta = 0.05 * Math.sin((Math.PI / 2) * (1 - it / iterations));
      
      if (currentBit === 0 && targetBit === 1) {
        qRegister[i].rotate(dTheta);
      } else if (currentBit === 1 && targetBit === 0) {
        qRegister[i].rotate(-dTheta);
      }
    }

    if (it % 7 === 0 || it === iterations - 1) {
      convergenceLog.push({
        iteration: it + 1,
        bestCost: parseFloat(minCost.toFixed(4)),
        selectedCandidate: bestCandidate.name,
        averageEntropy: parseFloat(
          (qRegister.reduce((acc, q) => acc + 2 * q.alpha * q.beta, 0) / N).toFixed(3)
        )
      });
    }
  }

  // Calculate final Q-Route scores (0 to 100)
  // Higher is better. Lowest cost route gets highest score.
  const allCosts = evaluatedCandidates.map(c => c.cost);
  const minObservedCost = Math.min(...allCosts);
  const maxObservedCost = Math.max(...allCosts);
  const costSpread = Math.max(0.001, maxObservedCost - minObservedCost);

  // Identify specific category winners across all candidate trajectories
  const fastestCandidate = evaluatedCandidates.reduce((prev, curr) => curr.durationMin < prev.durationMin ? curr : prev, evaluatedCandidates[0]);
  const ecoCandidate = evaluatedCandidates.reduce((prev, curr) => (curr.fuelEstimate?.value || 999) < (prev.fuelEstimate?.value || 999) ? curr : prev, evaluatedCandidates[0]);
  const safestCandidate = evaluatedCandidates.reduce((prev, curr) => (curr.riskScore || 999) < (prev.riskScore || 999) ? curr : prev, evaluatedCandidates[0]);
  const lowTrafficCandidate = evaluatedCandidates.reduce((prev, curr) => (curr.trafficDelayMin || 0) < (prev.trafficDelayMin || 0) ? curr : prev, evaluatedCandidates[0]);
  const shortestCandidate = evaluatedCandidates.reduce((prev, curr) => curr.distanceKm < prev.distanceKm ? curr : prev, evaluatedCandidates[0]);

  const rankedRoutes = evaluatedCandidates
    .map(candidate => {
      // Score from 70 to 98 based on relative optimality
      const relativePerf = (maxObservedCost - candidate.cost) / costSpread;
      const qScore = Math.round(75 + relativePerf * 23);

      const isRecommended = candidate.id === bestCandidate.id;
      const isFastest = candidate.id === fastestCandidate.id;
      const isEcoFriendly = candidate.id === ecoCandidate.id;
      const isSafest = candidate.id === safestCandidate.id;
      const isLowestTraffic = candidate.id === lowTrafficCandidate.id;
      const isShortest = candidate.id === shortestCandidate.id;

      // Assign primary category tag and badge
      let primaryCategory = 'alternative';
      let categoryBadge = candidate.badge || 'Alternative';
      let categoryIcon = 'Compass';
      let advantageTag = 'Alternative candidate corridor';

      if (isRecommended) {
        primaryCategory = 'optimal';
        categoryBadge = '⚛️ Q-Route Optimal';
        categoryIcon = 'Sparkles';
        advantageTag = 'Best overall balance of time, fuel & safety';
      } else if (isFastest) {
        primaryCategory = 'fastest';
        categoryBadge = '⚡ Fastest Route';
        categoryIcon = 'Zap';
        advantageTag = `Saves time (${candidate.durationMin} min ETA)`;
      } else if (isEcoFriendly) {
        primaryCategory = 'eco_friendly';
        categoryBadge = '🌿 Eco-Friendly';
        categoryIcon = 'Fuel';
        advantageTag = `Lowest consumption (${candidate.fuelEstimate?.value} ${candidate.fuelEstimate?.unit})`;
      } else if (isSafest) {
        primaryCategory = 'safest';
        categoryBadge = '🛡️ Safest Road';
        categoryIcon = 'ShieldCheck';
        advantageTag = `Lowest incident risk (Score: ${candidate.riskScore}/100)`;
      } else if (isLowestTraffic) {
        primaryCategory = 'low_traffic';
        categoryBadge = '🚗 Smooth Flow';
        categoryIcon = 'Navigation';
        advantageTag = `Minimal bottleneck delay (+${candidate.trafficDelayMin}m)`;
      } else if (isShortest) {
        primaryCategory = 'shortest';
        categoryBadge = '📏 Shortest Route';
        categoryIcon = 'Compass';
        advantageTag = `Shortest physical distance (${candidate.distanceKm} km)`;
      }

      // Produce structured breakdown percentages for the UI progress bars
      const sumBreakdown = Object.values(candidate.costBreakdown).reduce((a, b) => a + b, 0) || 1;
      const breakdownPercent = {
        travelTime: Math.round((candidate.costBreakdown.time / sumBreakdown) * 100),
        traffic: Math.round((candidate.costBreakdown.traffic / sumBreakdown) * 100),
        fuel: Math.round((candidate.costBreakdown.fuel / sumBreakdown) * 100),
        distance: Math.round((candidate.costBreakdown.distance / sumBreakdown) * 100),
        risk: Math.round((candidate.costBreakdown.risk / sumBreakdown) * 100)
      };

      return {
        ...candidate,
        qScore,
        isRecommended,
        isFastest,
        isEcoFriendly,
        isSafest,
        isLowestTraffic,
        isShortest,
        primaryCategory,
        categoryBadge,
        categoryIcon,
        advantageTag: candidate.advantageTag || advantageTag,
        recommendationBadge: isRecommended ? 'Q-ROUTE RECOMMENDED' : categoryBadge,
        breakdownPercent,
        whyThisRoute: generateWhyThisRouteExplanation(candidate, isRecommended, mode)
      };
    })
    .sort((a, b) => b.qScore - a.qScore);

  const suggestions = {
    optimal: rankedRoutes[0],
    fastest: rankedRoutes.find(r => r.isFastest) || rankedRoutes[0],
    ecoFriendly: rankedRoutes.find(r => r.isEcoFriendly) || rankedRoutes[0],
    safest: rankedRoutes.find(r => r.isSafest) || rankedRoutes[0],
    lowTraffic: rankedRoutes.find(r => r.isLowestTraffic) || rankedRoutes[0],
    shortest: rankedRoutes.find(r => r.isShortest) || rankedRoutes[0]
  };

  return {
    recommendedRoute: rankedRoutes[0],
    rankedRoutes,
    suggestions,
    activeMode: mode,
    weightsUsed: weights,
    optimizationMeta: {
      algorithm: 'Quantum-Inspired Evolutionary Multi-Objective Search (Classical QEA)',
      qubitCount: N,
      iterationsRun: iterations,
      convergenceLog,
      disclaimer: 'Quantum-inspired optimization concepts are implemented on a classical computer to explore multiple routing solutions.'
    }
  };
}

function generateWhyThisRouteExplanation(route, isRecommended, mode) {
  if (!isRecommended) {
    if (route.trafficDelayMin > 8) {
      return `Experienced high bottleneck delay (+${route.trafficDelayMin} min) despite shorter theoretical length.`;
    }
    return `Higher overall multi-criteria cost than Q-Route optimal trajectory under ${mode} preferences.`;
  }

  const parts = [];
  if (route.trafficDelayMin <= 3) {
    parts.push(`Avoids ${route.trafficDelayMin === 0 ? 'all major congestion corridors' : 'severe peak bottlenecks'}`);
  } else {
    parts.push(`Saves traffic delay penalty compared to primary arterial choke-points`);
  }

  if (route.fuelEstimate) {
    parts.push(`consumes approx. ${route.fuelEstimate.value} ${route.fuelEstimate.unit}`);
  }

  if (route.riskScore && route.riskScore < 25) {
    parts.push(`utilizes lower historical incident corridors`);
  }

  return `Selected by Q-Route optimization: ${parts.join(', ')} while balancing total travel duration.`;
}
