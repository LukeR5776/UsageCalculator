import type { UtilityUsage, EmissionResults, LocationData } from './types';
import { getEmissionFactor } from './emissionFactors';

export function calculateEmissions(usage: UtilityUsage, location: LocationData): EmissionResults {
  const electricityEmissions = usage.electricity.usage * getEmissionFactor('electricity', location.state);
  
  const gasEmissions = usage.naturalGas.usage * getEmissionFactor('naturalGas', usage.naturalGas.unit);
  
  const waterEmissions = usage.water.usage * getEmissionFactor('water', usage.water.unit);
  
  const total = electricityEmissions + gasEmissions + waterEmissions;
  
  return {
    electricity: Math.round(electricityEmissions * 100) / 100,
    naturalGas: Math.round(gasEmissions * 100) / 100,
    water: Math.round(waterEmissions * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

export function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function convertUsageUnits(value: number, fromUnit: string, toUnit: string): number {
  const conversions: Record<string, Record<string, number>> = {
    therms: { ccf: 0.96, mcf: 0.00096 },
    ccf: { therms: 1.04, mcf: 0.001 },
    mcf: { therms: 1041.67, ccf: 1000 },
    gallons: { cubic_feet: 0.1337 },
    cubic_feet: { gallons: 7.48 },
  };
  
  if (fromUnit === toUnit) return value;
  if (!conversions[fromUnit]?.[toUnit]) return value;
  
  return value * conversions[fromUnit][toUnit];
}

export function estimateUsageFromCost(cost: number, utilityType: 'electricity' | 'naturalGas' | 'water', state?: string): number {
  const averageRates = {
    electricity: {
      'CA': 0.25,
      'NY': 0.20,
      'TX': 0.12,
      'FL': 0.13,
      default: 0.15,
    },
    naturalGas: {
      'CA': 1.35,
      'NY': 1.20,
      'TX': 0.85,
      'FL': 1.10,
      default: 1.05,
    },
    water: {
      'CA': 0.008,
      'NY': 0.007,
      'TX': 0.005,
      'FL': 0.006,
      default: 0.007,
    }
  };
  
  const stateKey = state?.toUpperCase();
  const rates = averageRates[utilityType];
  const rate = stateKey && stateKey in rates 
    ? rates[stateKey as keyof typeof rates] 
    : rates.default;
  
  return Math.round((cost / rate) * 100) / 100;
}

export function formatEmissions(emissions: number): string {
  if (emissions < 1000) {
    return `${emissions.toFixed(1)} lbs CO₂`;
  } else if (emissions < 1000000) {
    return `${(emissions / 1000).toFixed(2)} tons CO₂`;
  } else {
    return `${(emissions / 1000000).toFixed(3)} kilotons CO₂`;
  }
}

export function calculateCostSavings(currentEmissions: number, potentialReduction: number, carbonPrice: number = 50): number {
  const reductionAmount = currentEmissions * (potentialReduction / 100);
  return Math.round((reductionAmount * carbonPrice / 1000) * 100) / 100;
}