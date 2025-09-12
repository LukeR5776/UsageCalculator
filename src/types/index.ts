export interface UtilityUsage {
  electricity: {
    usage: number;
    cost: number;
    unit: 'kWh';
  };
  naturalGas: {
    usage: number;
    cost: number;
    unit: 'therms' | 'ccf' | 'mcf';
  };
  water: {
    usage: number;
    cost: number;
    unit: 'gallons' | 'cubic_feet';
  };
}

export interface LocationData {
  zipCode: string;
  state: string;
  electricityEmissionFactor: number;
  naturalGasEmissionFactor: number;
  waterEmissionFactor: number;
}

export interface EmissionResults {
  electricity: number;
  naturalGas: number;
  water: number;
  total: number;
  previousMonth?: number;
  percentChange?: number;
}

export interface RegionalComparison {
  userEmissions: number;
  regionalAverage: number;
  percentile: number;
  comparison: 'below' | 'average' | 'above';
}

export interface Recommendation {
  id: string;
  category: 'electricity' | 'gas' | 'water' | 'general';
  title: string;
  description: string;
  potentialSavings: {
    co2: number;
    cost: number;
  };
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface MonthlyData {
  month: string;
  year: number;
  usage: UtilityUsage;
  emissions: EmissionResults;
}

export interface AppState {
  currentUsage: UtilityUsage | null;
  location: LocationData | null;
  monthlyHistory: MonthlyData[];
  currentEmissions: EmissionResults | null;
  regionalComparison: RegionalComparison | null;
  recommendations: Recommendation[];
  isLoading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: 'SET_USAGE'; payload: UtilityUsage }
  | { type: 'SET_LOCATION'; payload: LocationData }
  | { type: 'SET_EMISSIONS'; payload: EmissionResults }
  | { type: 'SET_REGIONAL_COMPARISON'; payload: RegionalComparison }
  | { type: 'SET_RECOMMENDATIONS'; payload: Recommendation[] }
  | { type: 'ADD_MONTHLY_DATA'; payload: MonthlyData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };