// TypeScript type definitions for the CO2 Emissions Calculator application
// These interfaces define the shape of data throughout the application

// Interface defining the structure of utility usage data entered by the user
export interface UtilityUsage {
  electricity: {
    usage: number;        // Amount of electricity used (always in kWh)
    cost: number;         // Dollar cost of electricity bill
    unit: 'kWh';         // Electricity is always measured in kilowatt-hours
  };
  naturalGas: {
    usage: number;        // Amount of natural gas used
    cost: number;         // Dollar cost of natural gas bill
    unit: 'therms' | 'ccf' | 'mcf';  // Natural gas can be measured in different units
  };
  water: {
    usage: number;        // Amount of water used
    cost: number;         // Dollar cost of water bill
    unit: 'gallons' | 'cubic_feet';  // Water can be measured in gallons or cubic feet
  };
}

// Interface defining location-specific data and emission factors
export interface LocationData {
  zipCode: string;                        // User's ZIP code (e.g., "90210")
  state: string;                          // State abbreviation (e.g., "CA")
  electricityEmissionFactor: number;      // Pounds of CO2 per kWh for this state's electricity grid
  naturalGasEmissionFactor: number;       // Pounds of CO2 per unit of natural gas
  waterEmissionFactor: number;            // Pounds of CO2 per unit of water (treatment/delivery)
}

// Interface defining the results of CO2 emission calculations
export interface EmissionResults {
  electricity: number;                    // CO2 emissions from electricity usage (lbs)
  naturalGas: number;                     // CO2 emissions from natural gas usage (lbs)
  water: number;                          // CO2 emissions from water usage (lbs)
  total: number;                          // Total CO2 emissions for the month (lbs)
  previousMonth?: number;                 // Previous month's total for comparison (optional)
  percentChange?: number;                 // Percentage change from previous month (optional)
}

// Interface defining how the user's emissions compare to regional averages
export interface RegionalComparison {
  userEmissions: number;                  // User's total monthly emissions (lbs CO2)
  regionalAverage: number;                // Average emissions for their region (lbs CO2)
  percentile: number;                     // Which percentile the user falls into (0-100)
  comparison: 'below' | 'average' | 'above';  // Simple categorization of their performance
}

// Interface defining personalized recommendations for reducing emissions
export interface Recommendation {
  id: string;                             // Unique identifier for this recommendation
  category: 'electricity' | 'gas' | 'water' | 'general';  // Which utility type this targets
  title: string;                          // Short title for the recommendation
  description: string;                    // Detailed explanation of the recommendation
  potentialSavings: {
    co2: number;                         // Potential CO2 reduction (lbs per month)
    cost: number;                        // Potential cost savings (dollars per month)
  };
  difficulty: 'easy' | 'medium' | 'hard'; // Implementation difficulty level
}

// Interface defining data stored for each month in the user's history
export interface MonthlyData {
  month: string;                          // Month name (e.g., "January")
  year: number;                           // Year (e.g., 2024)
  usage: UtilityUsage;                   // The usage data entered for this month
  emissions: EmissionResults;             // The calculated emissions for this month
}

// Interface defining the complete application state managed by React Context
export interface AppState {
  currentUsage: UtilityUsage | null;     // Currently entered usage data (null until user enters it)
  location: LocationData | null;          // User's location data (null until ZIP code is entered)
  monthlyHistory: MonthlyData[];          // Array of previous months' data for trend analysis
  currentEmissions: EmissionResults | null;  // Current month's calculated emissions
  regionalComparison: RegionalComparison | null;  // How user compares to regional averages
  recommendations: Recommendation[];      // Array of personalized recommendations
  isLoading: boolean;                    // Whether the app is currently loading/calculating
  error: string | null;                 // Current error message (null if no error)
}

// Type defining all possible actions that can be dispatched to update the application state
// This is used with React's useReducer hook for state management
export type AppAction =
  | { type: 'SET_USAGE'; payload: UtilityUsage }                    // Save user's utility usage input
  | { type: 'SET_LOCATION'; payload: LocationData }                 // Save user's location and emission factors
  | { type: 'SET_EMISSIONS'; payload: EmissionResults }             // Save calculated CO2 emissions
  | { type: 'SET_REGIONAL_COMPARISON'; payload: RegionalComparison } // Save regional comparison data
  | { type: 'SET_RECOMMENDATIONS'; payload: Recommendation[] }       // Save generated recommendations
  | { type: 'ADD_MONTHLY_DATA'; payload: MonthlyData }              // Add a month's data to history
  | { type: 'SET_LOADING'; payload: boolean }                       // Update loading state
  | { type: 'SET_ERROR'; payload: string | null }                   // Set an error message
  | { type: 'CLEAR_ERROR' };                                        // Clear any error messages