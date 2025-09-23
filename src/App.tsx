import React, { useState, useCallback } from 'react';
import type { UtilityUsage, EmissionResults, Recommendation } from './types';
import { AppProvider, useApp } from './contexts/AppContext';
import { LocationInput } from './components/LocationInput';
import { UsageInputForm } from './modules/input/UsageInputForm';
import { EmissionsEngine, EmissionsSummary } from './modules/calculations/EmissionsEngine';
import { EmissionsPieChart, EmissionsBarChart, MonthlyTrendChart } from './modules/visualization/EmissionsChart';
import { RegionalComparison } from './modules/comparison/RegionalComparison';
import { RecommendationEngine, RecommendationsDisplay } from './modules/recommendations/RecommendationEngine';
import { getLocationData } from './services/locationService';
import { Leaf, RotateCcw, Plus } from 'lucide-react';

const AppStep = {
  LOCATION: 'location',
  USAGE: 'usage',
  RESULTS: 'results'
} as const;

type AppStep = typeof AppStep[keyof typeof AppStep];

const AppContent: React.FC = () => {
  const { state, actions } = useApp();
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.LOCATION);

  const handleLocationSubmit = useCallback(async (zipCode: string) => {
    actions.setLoading(true);
    actions.clearError();

    try {
      const locationData = await getLocationData(zipCode);
      actions.setLocation(locationData);
      setCurrentStep(AppStep.USAGE);
    } catch (error) {
      actions.setError(error instanceof Error ? error.message : 'Failed to get location data');
    } finally {
      actions.setLoading(false);
    }
  }, [actions]);

  const handleUsageSubmit = useCallback((usage: UtilityUsage) => {
    actions.setUsage(usage);
    actions.setLoading(true);
    setCurrentStep(AppStep.RESULTS);
  }, [actions]);

  const handleEmissionsCalculated = useCallback((emissions: EmissionResults) => {
    actions.setEmissions(emissions);
    actions.setLoading(false);

    if (state.currentUsage && state.location) {
      const monthData = {
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear(),
        usage: state.currentUsage,
        emissions: emissions
      };
      actions.addMonthlyData(monthData);
    }
  }, [actions, state.currentUsage, state.location]);

  const handleRecommendationsGenerated = useCallback((recommendations: Recommendation[]) => {
    actions.setRecommendations(recommendations);
  }, [actions]);

  const handleReset = () => {
    setCurrentStep(AppStep.LOCATION);
    window.location.reload();
    actions.setRecommendations([]);
    actions.clearError();
  };

  const handleAddNewMonth = () => {
    setCurrentStep(AppStep.USAGE);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">

      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-600 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CO₂ Emissions Calculator</h1>
                <p className="text-sm text-gray-600">Track your environmental impact</p>
              </div>
            </div>

            {currentStep === AppStep.RESULTS && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddNewMonth}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Month
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Start Over
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === AppStep.LOCATION && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Calculate Your Carbon Footprint
              </h2>
              <p className="text-lg text-gray-600">
                Get personalized insights on your CO₂ emissions from utilities and discover ways to reduce your environmental impact.
              </p>
            </div>
            <LocationInput
              onLocationSubmit={handleLocationSubmit}
              isLoading={state.isLoading}
              error={state.error || undefined}
            />
          </div>
        )}

        {currentStep === AppStep.USAGE && state.location && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Enter Usage Data</h2>
                  <p className="text-gray-600">Location: {state.location.zipCode}, {state.location.state}</p>
                </div>
                <button
                  onClick={() => setCurrentStep(AppStep.LOCATION)}
                  className="btn-secondary"
                >
                  Change Location
                </button>
              </div>
            </div>
            <UsageInputForm
              onSubmit={handleUsageSubmit}
              isLoading={state.isLoading}
              state={state.location.state}
            />
          </div>
        )}

        {currentStep === AppStep.RESULTS && state.currentUsage && state.location && (
          <>
            <EmissionsEngine
              usage={state.currentUsage}
              location={state.location}
              previousMonthEmissions={
                state.monthlyHistory.length > 1
                  ? state.monthlyHistory[state.monthlyHistory.length - 2].emissions.total
                  : undefined
              }
              onEmissionsCalculated={handleEmissionsCalculated}
            />

            {state.currentEmissions && (
              <RecommendationEngine
                usage={state.currentUsage}
                emissions={state.currentEmissions}
                onRecommendationsGenerated={handleRecommendationsGenerated}
              />
            )}


            <div className="space-y-8">
              {state.currentEmissions && (
                <EmissionsSummary emissions={state.currentEmissions} />
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {state.currentEmissions ? (
                  <>
                    <EmissionsPieChart emissions={state.currentEmissions} />
                    <EmissionsBarChart emissions={state.currentEmissions} />
                  </>
                ) : state.isLoading ? (
                  <div className="col-span-2 text-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Calculating your CO₂ emissions...</p>
                    <p className="text-sm text-gray-500 mt-2">Processing your usage data and regional factors</p>
                  </div>
                ) : (
                  <div className="col-span-2 text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-4xl mb-4">📈</div>
                    <p className="text-gray-600 font-medium">Charts will appear here once calculations complete</p>
                    <p className="text-sm text-gray-500 mt-2">Your emission breakdown and trends will be visualized</p>
                  </div>
                )}
              </div>

              {state.monthlyHistory.length > 0 && (
                <MonthlyTrendChart monthlyData={state.monthlyHistory} />
              )}

              {state.currentEmissions && state.location && (
                <RegionalComparison emissions={state.currentEmissions} location={state.location} />
              )}

              <RecommendationsDisplay recommendations={state.recommendations} />
            </div>
          </>
        )}

        {state.error && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800">{state.error}</div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
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

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
