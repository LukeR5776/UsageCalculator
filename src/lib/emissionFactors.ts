export const EMISSION_FACTORS = {
  electricity: {
    default: 0.92,
    byState: {
      'CA': 0.28,
      'NY': 0.29,
      'VT': 0.01,
      'WA': 0.31,
      'OR': 0.37,
      'TX': 1.08,
      'FL': 1.02,
      'WV': 1.74,
      'WY': 1.71,
      'KY': 1.73,
    }
  },
  naturalGas: {
    therms: 11.7,
    ccf: 117,
    mcf: 117000,
  },
  water: {
    gallons: 0.0044,
    cubic_feet: 0.033,
  }
} as const;

export const REGIONAL_AVERAGES = {
  electricity: {
    monthly: {
      'CA': 550,
      'NY': 602,
      'TX': 1174,
      'FL': 1129,
      default: 877,
    }
  },
  naturalGas: {
    monthly: {
      'CA': 40,
      'NY': 72,
      'TX': 35,
      'FL': 15,
      default: 48,
    }
  },
  water: {
    monthly: {
      'CA': 6800,
      'NY': 7200,
      'TX': 9500,
      'FL': 7800,
      default: 7400,
    }
  }
} as const;

export function getEmissionFactor(type: 'electricity', state?: string): number;
export function getEmissionFactor(type: 'naturalGas', unit: 'therms' | 'ccf' | 'mcf'): number;
export function getEmissionFactor(type: 'water', unit: 'gallons' | 'cubic_feet'): number;
export function getEmissionFactor(type: string, stateOrUnit?: string): number {
  switch (type) {
    case 'electricity':
      const state = stateOrUnit?.toUpperCase();
      return state && state in EMISSION_FACTORS.electricity.byState
        ? EMISSION_FACTORS.electricity.byState[state as keyof typeof EMISSION_FACTORS.electricity.byState]
        : EMISSION_FACTORS.electricity.default;
    
    case 'naturalGas':
      return EMISSION_FACTORS.naturalGas[stateOrUnit as keyof typeof EMISSION_FACTORS.naturalGas] || EMISSION_FACTORS.naturalGas.therms;
    
    case 'water':
      return EMISSION_FACTORS.water[stateOrUnit as keyof typeof EMISSION_FACTORS.water] || EMISSION_FACTORS.water.gallons;
    
    default:
      return 0;
  }
}

export function getRegionalAverage(type: keyof typeof REGIONAL_AVERAGES, state?: string): number {
  const stateKey = state?.toUpperCase();
  const averages = REGIONAL_AVERAGES[type].monthly;
  
  return stateKey && stateKey in averages
    ? averages[stateKey as keyof typeof averages]
    : averages.default;
}