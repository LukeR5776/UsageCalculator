// Import React library and its hooks for managing component state and side effects
import React, { useState, useCallback } from 'react';

// Import types for proper TypeScript support
import type { UtilityUsage, EmissionResults, Recommendation } from './types';

// Import our custom context provider and hook for managing global application state
import { AppProvider, useApp } from './contexts/AppContext';

// Import individual components that make up different parts of the application
import { LocationInput } from './components/LocationInput';
import { UsageInputForm } from './modules/input/UsageInputForm';
import { EmissionsEngine, EmissionsSummary } from './modules/calculations/EmissionsEngine';
import { EmissionsPieChart, EmissionsBarChart, MonthlyTrendChart } from './modules/visualization/EmissionsChart';
import { RegionalComparison } from './modules/comparison/RegionalComparison';
import { RecommendationEngine, RecommendationsDisplay } from './modules/recommendations/RecommendationEngine';

// Import service function for getting location-specific data (like electricity grid info)
import { getLocationData } from './services/locationService';

// Import icon components from the Lucide React icon library
import { Leaf, RotateCcw, Plus } from 'lucide-react';

// Define the different steps/screens the user can be on in the application
// This creates a constant object that cannot be modified (immutable)
const AppStep = {
  LOCATION: 'location',  // Step 1: User enters their ZIP code to get location data
  USAGE: 'usage',        // Step 2: User enters their utility usage (electricity, gas, etc.)
  RESULTS: 'results'     // Step 3: User sees their calculated emissions and recommendations
} as const;

// Create a TypeScript type based on the values in our AppStep object
// This ensures we can only use valid step values throughout the application
type AppStep = typeof AppStep[keyof typeof AppStep];

// Main component that contains all the application logic and user interface
// React.FC means this is a "Functional Component" (as opposed to a class component)
const AppContent: React.FC = () => {
  // Get the global application state and functions to modify it from our context
  // 'state' contains data like location, usage, emissions, etc.
  // 'actions' contains functions to update that data
  const { state, actions } = useApp();

  // Track which step of the process the user is currently on
  // useState is a React hook that manages component-specific state
  // It starts with LOCATION step when the app first loads
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.LOCATION);

  // Function that runs when user submits their ZIP code on the location step
  // useCallback is a React hook that prevents unnecessary re-renders by memoizing the function
  // async/await allows us to handle asynchronous operations (like API calls) cleanly
  const handleLocationSubmit = useCallback(async (zipCode: string) => {
    // Show loading spinner while we fetch location data
    actions.setLoading(true);
    // Clear any previous error messages
    actions.clearError();

    try {
      // Call our location service to get data about this ZIP code
      // This might include state, utility grid information, emission factors, etc.
      const locationData = await getLocationData(zipCode);

      // Save the location data to our global state
      actions.setLocation(locationData);

      // Move to the next step where user enters their utility usage
      setCurrentStep(AppStep.USAGE);
    } catch (error) {
      // If something goes wrong (invalid ZIP, network error, etc.), show an error message
      // We check if it's an Error object to get the specific message, otherwise use a generic message
      actions.setError(error instanceof Error ? error.message : 'Failed to get location data');
    } finally {
      // Always hide the loading spinner, whether the request succeeded or failed
      actions.setLoading(false);
    }
  }, [actions]); // The dependency array tells React when to recreate this function

  // Function that runs when user submits their utility usage data (electricity, gas, etc.)
  const handleUsageSubmit = useCallback((usage: UtilityUsage) => {
    console.log('📝 Usage data submitted:', usage);
    // Save the usage data to our global state
    actions.setUsage(usage);
    // Set loading state for calculations
    actions.setLoading(true);
    console.log('🚀 Moving to RESULTS step');
    // Move to the results step where calculations and visualizations are shown
    setCurrentStep(AppStep.RESULTS);
  }, [actions]);

  // Function that runs when the emissions calculations are completed
  // This happens automatically when we have both usage data and location data
  const handleEmissionsCalculated = useCallback((emissions: EmissionResults) => {
    console.log('🔥 Emissions calculated:', emissions);
    // Save the calculated emissions to our global state
    actions.setEmissions(emissions);
    // Clear loading state now that calculations are complete
    actions.setLoading(false);

    // If we have all the necessary data, add this month's data to our historical tracking
    if (state.currentUsage && state.location) {
      // Create a data object for this month that includes usage and emissions
      const monthData = {
        // Get the current month name (e.g., "January", "February")
        month: new Date().toLocaleString('default', { month: 'long' }),
        // Get the current year (e.g., 2024)
        year: new Date().getFullYear(),
        // Store the usage data the user entered
        usage: state.currentUsage,
        // Store the calculated emissions
        emissions: emissions
      };
      // Add this month's data to our historical tracking for trend analysis
      actions.addMonthlyData(monthData);
    }
  }, [actions, state.currentUsage, state.location]);

  // Function that runs when personalized recommendations are generated
  // Recommendations suggest ways to reduce CO2 emissions based on usage patterns
  const handleRecommendationsGenerated = useCallback((recommendations: Recommendation[]) => {
    console.log('💡 Recommendations generated:', recommendations);
    // Save the recommendations to our global state so they can be displayed
    actions.setRecommendations(recommendations);
  }, [actions]);

  // Function that runs when user clicks "Start Over" button
  // This resets the entire application back to the beginning
  const handleReset = () => {
    // Go back to the first step (location entry)
    setCurrentStep(AppStep.LOCATION);
    // Reload the entire page to reset all state back to initial values
    // This is a simple way to ensure everything is completely fresh
    window.location.reload();
    // Clear any existing recommendations
    actions.setRecommendations([]);
    // Clear any error messages
    actions.clearError();
  };

  // Function that runs when user clicks "Add Month" button
  // This allows them to enter data for a new month while keeping their location
  const handleAddNewMonth = () => {
    // Go back to the usage step, but keep the location data they already entered
    setCurrentStep(AppStep.USAGE);
  };

  // This return statement defines what gets displayed on the screen (the user interface)
  // JSX allows us to write HTML-like syntax within JavaScript
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">

      {/* Header section at the top of the page */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        {/* Container that centers content and adds padding on different screen sizes */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Flex container that spaces items between left and right sides */}
          <div className="flex items-center justify-between h-16">

            {/* Left side of header: Logo and title */}
            <div className="flex items-center gap-3">
              {/* Icon container with green background and rounded corners */}
              <div className="p-2 bg-primary-600 rounded-lg">
                {/* Leaf icon representing environmental/eco theme */}
                <Leaf className="w-6 h-6 text-white" />
              </div>
              {/* Title and subtitle text */}
              <div>
                <h1 className="text-xl font-bold text-gray-900">CO₂ Emissions Calculator</h1>
                <p className="text-sm text-gray-600">Track your environmental impact</p>
              </div>
            </div>

            {/* Right side of header: Action buttons (only shown on results step) */}
            {/* This uses conditional rendering - only show these buttons when user is viewing results */}
            {currentStep === AppStep.RESULTS && (
              <div className="flex items-center gap-3">
                {/* Button to add data for a new month */}
                <button
                  onClick={handleAddNewMonth}
                  className="btn-secondary flex items-center gap-2"
                >
                  {/* Plus icon indicating "add" action */}
                  <Plus className="w-4 h-4" />
                  Add Month
                </button>
                {/* Button to restart the entire process */}
                <button
                  onClick={handleReset}
                  className="btn-secondary flex items-center gap-2"
                >
                  {/* Rotate/refresh icon indicating "start over" action */}
                  <RotateCcw className="w-4 h-4" />
                  Start Over
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content area of the application */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* STEP 1: Location Input Screen */}
        {/* Only show this section when user is on the LOCATION step */}
        {currentStep === AppStep.LOCATION && (
          <div className="max-w-2xl mx-auto">
            {/* Welcome message and instructions */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Calculate Your Carbon Footprint
              </h2>
              <p className="text-lg text-gray-600">
                Get personalized insights on your CO₂ emissions from utilities and discover ways to reduce your environmental impact.
              </p>
            </div>
            {/* Component that handles ZIP code input and location lookup */}
            <LocationInput
              onLocationSubmit={handleLocationSubmit}  // Function to call when form is submitted
              isLoading={state.isLoading}              // Show loading spinner if true
              error={state.error || undefined}         // Show error message if there is one
            />
          </div>
        )}

        {/* STEP 2: Usage Input Screen */}
        {/* Only show this section when user is on USAGE step AND we have location data */}
        {currentStep === AppStep.USAGE && state.location && (
          <div className="max-w-4xl mx-auto">
            {/* Header section showing current location and option to change it */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Enter Usage Data</h2>
                  {/* Display the location that was entered in step 1 */}
                  <p className="text-gray-600">Location: {state.location.zipCode}, {state.location.state}</p>
                </div>
                {/* Button to go back and change the location if needed */}
                <button
                  onClick={() => setCurrentStep(AppStep.LOCATION)}
                  className="btn-secondary"
                >
                  Change Location
                </button>
              </div>
            </div>
            {/* Component that handles utility usage input (electricity, gas, water, etc.) */}
            <UsageInputForm
              onSubmit={handleUsageSubmit}    // Function to call when form is submitted
              isLoading={state.isLoading}     // Show loading state if calculations are running
              state={state.location.state}   // Pass the state for location-specific calculations
            />
          </div>
        )}

        {/* STEP 3: Results Screen */}
        {/* Only show when on RESULTS step AND we have both usage data and location data */}
        {(() => {
          console.log('🔍 Results step check:', {
            currentStep: currentStep,
            isResultsStep: currentStep === AppStep.RESULTS,
            hasUsage: !!state.currentUsage,
            hasLocation: !!state.location,
            shouldShowResults: currentStep === AppStep.RESULTS && state.currentUsage && state.location
          });
          return currentStep === AppStep.RESULTS && state.currentUsage && state.location;
        })() && (
          <>
            {/* Component that calculates CO2 emissions based on usage and location */}
            <EmissionsEngine
              usage={state.currentUsage}              // The utility usage data the user entered
              location={state.location}               // Location data (for regional emission factors)
              previousMonthEmissions={                 // Previous month's data for comparison
                // If we have more than one month of data, use the second-to-last month for comparison
                state.monthlyHistory.length > 1
                  ? state.monthlyHistory[state.monthlyHistory.length - 2].emissions.total
                  : undefined  // If no previous data, don't show comparison
              }
              onEmissionsCalculated={handleEmissionsCalculated}  // Function to call when calculations complete
            />

            {/* Component that generates personalized recommendations to reduce emissions */}
            {/* Only show this after emissions have been calculated */}
            {state.currentEmissions && (
              <RecommendationEngine
                usage={state.currentUsage}               // Usage data to base recommendations on
                emissions={state.currentEmissions}       // Calculated emissions to analyze
                onRecommendationsGenerated={handleRecommendationsGenerated}  // Function to call when recommendations are ready
              />
            )}

            {/* Debug information - remove this in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-100 p-4 rounded text-xs text-gray-600 font-mono">
                <strong>Debug Info:</strong>
                <br />Usage: {state.currentUsage ? '✓' : '❌'}
                <br />Location: {state.location ? '✓' : '❌'}
                <br />Emissions: {state.currentEmissions ? `✓ (${state.currentEmissions.total.toFixed(1)} lbs)` : '❌'}
                <br />Loading: {state.isLoading ? '✓' : '❌'}
              </div>
            )}

            {/* Container for all the results visualizations and information */}
            <div className="space-y-8">

              {/* Summary card showing total emissions and key metrics */}
              {state.currentEmissions && (
                <EmissionsSummary emissions={state.currentEmissions} />
              )}

              {/* Grid layout for charts - side by side on large screens, stacked on mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {(() => {
                  console.log('📈 Chart rendering condition - currentEmissions:', state.currentEmissions);

                  if (state.currentEmissions) {
                    // We have emission data - render the charts
                    return (
                      <>
                        {/* Pie chart showing breakdown of emissions by utility type */}
                        <EmissionsPieChart emissions={state.currentEmissions} />
                        {/* Bar chart showing emissions in a different visual format */}
                        <EmissionsBarChart emissions={state.currentEmissions} />
                      </>
                    );
                  } else if (state.isLoading) {
                    // Still calculating emissions
                    return (
                      <div className="col-span-2 text-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Calculating your CO₂ emissions...</p>
                        <p className="text-sm text-gray-500 mt-2">Processing your usage data and regional factors</p>
                      </div>
                    );
                  } else {
                    // No emissions data yet, but not loading - waiting for calculation to start
                    return (
                      <div className="col-span-2 text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <div className="text-4xl mb-4">📈</div>
                        <p className="text-gray-600 font-medium">Charts will appear here once calculations complete</p>
                        <p className="text-sm text-gray-500 mt-2">Your emission breakdown and trends will be visualized</p>
                      </div>
                    );
                  }
                })()}
              </div>

              {/* Monthly trend chart - only show if user has multiple months of data */}
              {state.monthlyHistory.length > 0 && (
                <MonthlyTrendChart monthlyData={state.monthlyHistory} />
              )}

              {/* Comparison with regional averages and benchmarks */}
              {state.currentEmissions && state.location && (
                <RegionalComparison emissions={state.currentEmissions} location={state.location} />
              )}

              {/* Display personalized recommendations to reduce emissions */}
              <RecommendationsDisplay recommendations={state.recommendations} />
            </div>
          </>
        )}

        {/* Error Message Display */}
        {/* Show this section if there's an error message to display */}
        {state.error && (
          <div className="max-w-2xl mx-auto mt-8">
            {/* Red background error box to make the error stand out */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800">{state.error}</div>
            </div>
          </div>
        )}
      </main>

      {/* Footer section at bottom of page */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            {/* Footer title and disclaimer about emission calculations */}
            <p className="mb-2">CO₂ Emissions Calculator - Track your environmental impact</p>
            <p className="text-sm">
              Emission factors are estimates based on regional averages.
              Actual values may vary based on your utility provider's energy mix.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main App component that wraps everything in the context provider
// This ensures all child components have access to the global state
function App() {
  return (
    // AppProvider makes the global state available to all components in the app
    <AppProvider>
      {/* AppContent contains all the actual user interface */}
      <AppContent />
    </AppProvider>
  );
}

// Export the App component as the default export so it can be imported and used by main.tsx
export default App;
