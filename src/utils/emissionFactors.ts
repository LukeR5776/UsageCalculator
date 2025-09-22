// Emission factors define how much CO2 is produced per unit of each utility
// These factors are based on EPA data and regional energy sources
export const EMISSION_FACTORS = {
  // Electricity emission factors (pounds of CO2 per kWh)
  // Varies significantly by state due to different energy sources (coal vs renewables vs nuclear)
  electricity: {
    default: 0.92,        // US national average (lbs CO2 per kWh)
    byState: {
      'CA': 0.28,         // California - low due to renewable energy mandates
      'NY': 0.29,         // New York - low due to hydro and nuclear power
      'VT': 0.01,         // Vermont - very low due to primarily renewable sources
      'WA': 0.31,         // Washington - low due to hydroelectric power
      'OR': 0.37,         // Oregon - low due to hydroelectric power
      'TX': 1.08,         // Texas - higher due to natural gas and some coal
      'FL': 1.02,         // Florida - higher due to natural gas dependency
      'WV': 1.74,         // West Virginia - high due to heavy coal use
      'WY': 1.71,         // Wyoming - high due to coal mining and usage
      'KY': 1.73,         // Kentucky - high due to coal dependency
    }
  },
  // Natural gas emission factors (pounds of CO2 per unit)
  // These are consistent nationwide as they depend on the fuel itself, not regional grids
  naturalGas: {
    therms: 11.7,         // Standard unit: 1 therm = 11.7 lbs CO2
    ccf: 117,             // 1 CCF (hundred cubic feet) = 117 lbs CO2
    mcf: 117000,          // 1 MCF (thousand cubic feet) = 117,000 lbs CO2
  },
  // Water emission factors (pounds of CO2 per unit)
  // Accounts for energy used in water treatment, pumping, and distribution
  water: {
    gallons: 0.0044,      // Energy to treat and deliver 1 gallon = 0.0044 lbs CO2
    cubic_feet: 0.033,    // Energy to treat and deliver 1 cubic foot = 0.033 lbs CO2
  }
} as const;

// Regional average usage patterns for comparison purposes
// These help users understand how their usage compares to others in their area
export const REGIONAL_AVERAGES = {
  // Average monthly electricity usage by state (kWh per month)
  electricity: {
    monthly: {
      'CA': 550,          // California - lower due to mild climate and efficiency programs
      'NY': 602,          // New York - moderate due to varied climate
      'TX': 1174,         // Texas - high due to hot climate and cooling needs
      'FL': 1129,         // Florida - high due to year-round cooling needs
      default: 877,       // US national average
    }
  },
  // Average monthly natural gas usage by state (therms per month)
  naturalGas: {
    monthly: {
      'CA': 40,           // California - moderate due to mild winters
      'NY': 72,           // New York - high due to cold winters requiring heating
      'TX': 35,           // Texas - lower due to mild winters
      'FL': 15,           // Florida - very low due to warm climate
      default: 48,        // US national average
    }
  },
  // Average monthly water usage by state (gallons per month)
  water: {
    monthly: {
      'CA': 6800,         // California - lower due to drought restrictions
      'NY': 7200,         // New York - moderate usage
      'TX': 9500,         // Texas - higher due to hot climate and larger properties
      'FL': 7800,         // Florida - moderate-high due to lawn watering
      default: 7400,      // US national average
    }
  }
} as const;

// TypeScript function overloads to ensure type safety when calling getEmissionFactor
// These signatures tell TypeScript what parameters are expected for each utility type
export function getEmissionFactor(type: 'electricity', state?: string): number;
export function getEmissionFactor(type: 'naturalGas', unit: 'therms' | 'ccf' | 'mcf'): number;
export function getEmissionFactor(type: 'water', unit: 'gallons' | 'cubic_feet'): number;

// Main function to get the appropriate emission factor based on utility type and location/unit
export function getEmissionFactor(type: string, stateOrUnit?: string): number {
  switch (type) {
    case 'electricity':
      // For electricity, look up the state-specific emission factor
      const state = stateOrUnit?.toUpperCase();
      return state && state in EMISSION_FACTORS.electricity.byState
        ? EMISSION_FACTORS.electricity.byState[state as keyof typeof EMISSION_FACTORS.electricity.byState]
        : EMISSION_FACTORS.electricity.default;  // Use national average if state not found

    case 'naturalGas':
      // For natural gas, look up the unit-specific emission factor
      return EMISSION_FACTORS.naturalGas[stateOrUnit as keyof typeof EMISSION_FACTORS.naturalGas] || EMISSION_FACTORS.naturalGas.therms;

    case 'water':
      // For water, look up the unit-specific emission factor
      return EMISSION_FACTORS.water[stateOrUnit as keyof typeof EMISSION_FACTORS.water] || EMISSION_FACTORS.water.gallons;

    default:
      // Unknown utility type - return 0 to avoid calculation errors
      return 0;
  }
}

// Function to get regional average usage for a specific utility type and state
// Used for comparison features to show users how their usage compares to local averages
export function getRegionalAverage(type: keyof typeof REGIONAL_AVERAGES, state?: string): number {
  // Convert state to uppercase for consistent lookup
  const stateKey = state?.toUpperCase();
  // Get the monthly averages object for this utility type
  const averages = REGIONAL_AVERAGES[type].monthly;

  // Return state-specific average if available, otherwise use national default
  return stateKey && stateKey in averages
    ? averages[stateKey as keyof typeof averages]
    : averages.default;
}