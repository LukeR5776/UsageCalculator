import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { AppState, AppAction, UtilityUsage, LocationData, EmissionResults, RegionalComparison, Recommendation, MonthlyData } from '../lib/types';

const initialState: AppState = {
  currentUsage: null,
  location: null,
  monthlyHistory: [],
  currentEmissions: null,
  regionalComparison: null,
  recommendations: [],
  isLoading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USAGE':
      return { ...state, currentUsage: action.payload, error: null };
    
    case 'SET_LOCATION':
      return { ...state, location: action.payload, error: null };
    
    case 'SET_EMISSIONS':
      return { ...state, currentEmissions: action.payload, error: null };
    
    case 'SET_REGIONAL_COMPARISON':
      return { ...state, regionalComparison: action.payload };
    
    case 'SET_RECOMMENDATIONS':
      return { ...state, recommendations: action.payload };
    
    case 'ADD_MONTHLY_DATA':
      const newHistory = [...state.monthlyHistory, action.payload]
        .sort((a, b) => {
          const dateA = new Date(a.year, getMonthNumber(a.month));
          const dateB = new Date(b.year, getMonthNumber(b.month));
          return dateA.getTime() - dateB.getTime();
        });
      return { ...state, monthlyHistory: newHistory };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
}

function getMonthNumber(monthName: string): number {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months.indexOf(monthName);
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    setUsage: (usage: UtilityUsage) => void;
    setLocation: (location: LocationData) => void;
    setEmissions: (emissions: EmissionResults) => void;
    setRegionalComparison: (comparison: RegionalComparison) => void;
    setRecommendations: (recommendations: Recommendation[]) => void;
    addMonthlyData: (data: MonthlyData) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
  };
} | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    setUsage: (usage: UtilityUsage) => dispatch({ type: 'SET_USAGE', payload: usage }),
    setLocation: (location: LocationData) => dispatch({ type: 'SET_LOCATION', payload: location }),
    setEmissions: (emissions: EmissionResults) => dispatch({ type: 'SET_EMISSIONS', payload: emissions }),
    setRegionalComparison: (comparison: RegionalComparison) => dispatch({ type: 'SET_REGIONAL_COMPARISON', payload: comparison }),
    setRecommendations: (recommendations: Recommendation[]) => dispatch({ type: 'SET_RECOMMENDATIONS', payload: recommendations }),
    addMonthlyData: (data: MonthlyData) => dispatch({ type: 'ADD_MONTHLY_DATA', payload: data }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};