// Import React utilities for creating and managing global application state
import React, { createContext, useContext, useReducer } from 'react';
// Import type definition for React children components
import type { ReactNode } from 'react';
// Import all the TypeScript type definitions for our application data
import type { AppState, AppAction, UtilityUsage, LocationData, EmissionResults, RegionalComparison, Recommendation, MonthlyData } from '../types';

// Define the initial state when the application first loads
// This represents the "empty" state before any user data is entered
const initialState: AppState = {
  currentUsage: null,           // No utility usage data entered yet
  location: null,               // No location (ZIP code) entered yet
  monthlyHistory: [],           // No previous months of data stored yet
  currentEmissions: null,       // No emissions calculated yet
  regionalComparison: null,     // No regional comparison data yet
  recommendations: [],          // No personalized recommendations generated yet
  isLoading: false,            // Not loading anything initially
  error: null,                 // No error messages initially
};

// Reducer function that manages how the application state changes
// A reducer takes the current state and an action, then returns the new state
// This is the React pattern for managing complex state in a predictable way
function appReducer(state: AppState, action: AppAction): AppState {
  // Use a switch statement to handle different types of actions
  switch (action.type) {
    case 'SET_USAGE':
      // When user enters their utility usage, save it and clear any errors
      return { ...state, currentUsage: action.payload, error: null };

    case 'SET_LOCATION':
      // When user enters their location (ZIP code), save it and clear any errors
      return { ...state, location: action.payload, error: null };

    case 'SET_EMISSIONS':
      // When emissions are calculated, save the results and clear any errors
      return { ...state, currentEmissions: action.payload, error: null };

    case 'SET_REGIONAL_COMPARISON':
      // When regional comparison data is generated, save it
      return { ...state, regionalComparison: action.payload };

    case 'SET_RECOMMENDATIONS':
      // When personalized recommendations are generated, save them
      return { ...state, recommendations: action.payload };

    case 'ADD_MONTHLY_DATA':
      // When adding a new month of data, insert it into the history and sort by date
      const newHistory = [...state.monthlyHistory, action.payload]
        .sort((a, b) => {
          // Convert month names and years to Date objects for proper sorting
          const dateA = new Date(a.year, getMonthNumber(a.month));
          const dateB = new Date(b.year, getMonthNumber(b.month));
          // Sort chronologically (earliest to latest)
          return dateA.getTime() - dateB.getTime();
        });
      return { ...state, monthlyHistory: newHistory };

    case 'SET_LOADING':
      // Show or hide loading spinners throughout the app
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      // When an error occurs, show the error message and stop any loading
      return { ...state, error: action.payload, isLoading: false };

    case 'CLEAR_ERROR':
      // Remove any error messages
      return { ...state, error: null };

    default:
      // If an unknown action is dispatched, return the state unchanged
      return state;
  }
}

// Helper function to convert month names to numbers for date sorting
// JavaScript months are 0-indexed (January = 0, December = 11)
function getMonthNumber(monthName: string): number {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  // Find the index of the month name in the array (returns -1 if not found)
  return months.indexOf(monthName);
}

// Create a React Context that will hold our global application state
// Context allows us to share data between components without "prop drilling"
// (passing props down through many component levels)
const AppContext = createContext<{
  state: AppState;                                              // The current state of the application
  dispatch: React.Dispatch<AppAction>;                         // Function to send actions to update state
  actions: {                                                    // Convenient wrapper functions for common actions
    setUsage: (usage: UtilityUsage) => void;                  // Save user's utility usage data
    setLocation: (location: LocationData) => void;             // Save user's location data
    setEmissions: (emissions: EmissionResults) => void;        // Save calculated emissions
    setRegionalComparison: (comparison: RegionalComparison) => void;  // Save regional comparison data
    setRecommendations: (recommendations: Recommendation[]) => void;   // Save generated recommendations
    addMonthlyData: (data: MonthlyData) => void;              // Add a month's data to the history
    setLoading: (loading: boolean) => void;                    // Show/hide loading spinners
    setError: (error: string | null) => void;                 // Display error messages
    clearError: () => void;                                    // Clear error messages
  };
} | null>(null);  // Initialize with null - will be set by AppProvider

// TypeScript interface defining what props the AppProvider component expects
interface AppProviderProps {
  children: ReactNode;  // Any React components that will be wrapped by this provider
}

// AppProvider component that wraps the entire application to provide global state
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Set up the reducer to manage our application state
  // useReducer returns the current state and a dispatch function to update it
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Create convenient action functions that components can call
  // These wrap the dispatch calls to make the code more readable and easier to use
  const actions = {
    // Save the user's utility usage data (electricity, gas, water, etc.)
    setUsage: (usage: UtilityUsage) => dispatch({ type: 'SET_USAGE', payload: usage }),
    // Save the user's location data (ZIP code, state, emission factors, etc.)
    setLocation: (location: LocationData) => dispatch({ type: 'SET_LOCATION', payload: location }),
    // Save the calculated CO2 emissions results
    setEmissions: (emissions: EmissionResults) => dispatch({ type: 'SET_EMISSIONS', payload: emissions }),
    // Save regional comparison data (how user compares to regional averages)
    setRegionalComparison: (comparison: RegionalComparison) => dispatch({ type: 'SET_REGIONAL_COMPARISON', payload: comparison }),
    // Save personalized recommendations for reducing emissions
    setRecommendations: (recommendations: Recommendation[]) => dispatch({ type: 'SET_RECOMMENDATIONS', payload: recommendations }),
    // Add a new month's data to the historical tracking
    addMonthlyData: (data: MonthlyData) => dispatch({ type: 'ADD_MONTHLY_DATA', payload: data }),
    // Show or hide loading spinners throughout the application
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    // Display an error message to the user
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    // Clear any displayed error messages
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
  };

  // Provide the state and actions to all child components
  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook that allows components to access the global application state
// This is a convenient way for any component to get and modify the global state
export const useApp = () => {
  // Get the context value (state, dispatch, and actions)
  const context = useContext(AppContext);

  // Safety check: make sure this hook is being used within an AppProvider
  // If not, the context will be null and we should throw an error
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }

  // Return the context so components can access state and actions
  return context;
};