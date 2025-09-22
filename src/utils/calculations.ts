// Import TypeScript type definitions for utility usage data and calculation results
import type { UtilityUsage, EmissionResults, LocationData } from '../types';
// Import function to get emission factors for different utility types and locations
import { getEmissionFactor } from './emissionFactors';

// Main function to calculate CO2 emissions from utility usage
// Takes the user's utility usage data and their location, returns calculated emissions in pounds of CO2
export function calculateEmissions(usage: UtilityUsage, location: LocationData): EmissionResults {
  // Calculate electricity emissions: usage (kWh) × emission factor (lbs CO2 per kWh for this state)
  const electricityEmissions = usage.electricity.usage * getEmissionFactor('electricity', location.state);

  // Calculate natural gas emissions: usage × emission factor (varies by unit: therms, ccf, mcf)
  const gasEmissions = usage.naturalGas.usage * getEmissionFactor('naturalGas', usage.naturalGas.unit);

  // Calculate water emissions: usage × emission factor (accounts for water processing/delivery)
  const waterEmissions = usage.water.usage * getEmissionFactor('water', usage.water.unit);

  // Sum up all emission sources to get total monthly CO2 emissions
  const total = electricityEmissions + gasEmissions + waterEmissions;

  // Return results rounded to 2 decimal places for better readability
  return {
    electricity: Math.round(electricityEmissions * 100) / 100,
    naturalGas: Math.round(gasEmissions * 100) / 100,
    water: Math.round(waterEmissions * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

// Function to calculate the percentage change between two values
// Used for comparing current month's emissions to previous month
export function calculatePercentChange(current: number, previous: number): number {
  // Handle edge case: if previous value is 0, we can't calculate percentage change
  if (previous === 0) return 0;

  // Calculate percentage change: ((new - old) / old) × 100
  // Round to nearest whole percentage for display
  return Math.round(((current - previous) / previous) * 100);
}

// Function to convert between different units of measurement for utilities
// Helps standardize units before calculations (e.g., converting CCF to therms for natural gas)
export function convertUsageUnits(value: number, fromUnit: string, toUnit: string): number {
  // Conversion factors between different units
  const conversions: Record<string, Record<string, number>> = {
    // Natural gas unit conversions
    therms: { ccf: 0.96, mcf: 0.00096 },           // 1 therm = 0.96 CCF = 0.00096 MCF
    ccf: { therms: 1.04, mcf: 0.001 },             // 1 CCF = 1.04 therms = 0.001 MCF
    mcf: { therms: 1041.67, ccf: 1000 },           // 1 MCF = 1041.67 therms = 1000 CCF

    // Water unit conversions
    gallons: { cubic_feet: 0.1337 },               // 1 gallon = 0.1337 cubic feet
    cubic_feet: { gallons: 7.48 },                 // 1 cubic foot = 7.48 gallons
  };

  // If converting to the same unit, no conversion needed
  if (fromUnit === toUnit) return value;

  // If conversion factor doesn't exist, return original value
  if (!conversions[fromUnit]?.[toUnit]) return value;

  // Apply the conversion factor
  return value * conversions[fromUnit][toUnit];
}

// Function to estimate usage amount from cost and average rates
// Useful when users only know their bill amount but not their usage
export function estimateUsageFromCost(cost: number, utilityType: 'electricity' | 'naturalGas' | 'water', state?: string): number {
  // Average utility rates by state (dollars per unit)
  const averageRates = {
    // Electricity rates (dollars per kWh)
    electricity: {
      'CA': 0.25,        // California has high electricity rates
      'NY': 0.20,        // New York has moderate-high rates
      'TX': 0.12,        // Texas has lower rates due to deregulation
      'FL': 0.13,        // Florida has moderate rates
      default: 0.15,     // National average
    },
    // Natural gas rates (dollars per therm)
    naturalGas: {
      'CA': 1.35,        // California has high gas rates
      'NY': 1.20,        // New York has moderate-high rates
      'TX': 0.85,        // Texas has lower gas rates
      'FL': 1.10,        // Florida has moderate rates
      default: 1.05,     // National average
    },
    // Water rates (dollars per gallon)
    water: {
      'CA': 0.008,       // California has high water rates due to scarcity
      'NY': 0.007,       // New York has moderate rates
      'TX': 0.005,       // Texas has lower water rates
      'FL': 0.006,       // Florida has moderate rates
      default: 0.007,    // National average
    }
  };

  // Convert state to uppercase for lookup
  const stateKey = state?.toUpperCase();
  // Get the rates object for this utility type
  const rates = averageRates[utilityType];
  // Find the rate for this state, or use default if state not found
  const rate = stateKey && stateKey in rates
    ? rates[stateKey as keyof typeof rates]
    : rates.default;

  // Calculate estimated usage: cost ÷ rate = usage
  // Round to 2 decimal places
  return Math.round((cost / rate) * 100) / 100;
}

// Function to format emission numbers in human-readable units
// Automatically scales from pounds to tons to kilotons based on magnitude
export function formatEmissions(emissions: number): string {
  if (emissions < 1000) {
    // For small amounts, show in pounds with 1 decimal place
    return `${emissions.toFixed(1)} lbs CO₂`;
  } else if (emissions < 1000000) {
    // For medium amounts, convert to tons (1000 lbs = 1 ton) with 2 decimal places
    return `${(emissions / 1000).toFixed(2)} tons CO₂`;
  } else {
    // For very large amounts, convert to kilotons (1,000,000 lbs = 1 kiloton) with 3 decimal places
    return `${(emissions / 1000000).toFixed(3)} kilotons CO₂`;
  }
}

// Function to calculate potential cost savings from emission reductions
// Uses carbon pricing to estimate monetary value of CO2 reduction
export function calculateCostSavings(currentEmissions: number, potentialReduction: number, carbonPrice: number = 50): number {
  // Calculate the amount of CO2 that would be reduced (in lbs)
  const reductionAmount = currentEmissions * (potentialReduction / 100);

  // Convert to tons (divide by 1000) and multiply by carbon price (dollars per ton)
  // Round to 2 decimal places for currency display
  return Math.round((reductionAmount * carbonPrice / 1000) * 100) / 100;
}