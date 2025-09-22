import React from 'react';
import type { UtilityUsage, EmissionResults, LocationData } from '../../types';
import { calculateEmissions, formatEmissions } from '../../utils/calculations';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Props for the EmissionsEngine component
 */
interface EmissionsEngineProps {
  usage: UtilityUsage;                                             // Current utility usage data to calculate emissions
  location: LocationData;                                          // Location data for region-specific emission factors
  previousMonthEmissions?: number;                                 // Previous month's emissions for trend calculation
  onEmissionsCalculated: (emissions: EmissionResults) => void;    // Callback when emissions are calculated
}

/**
 * EmissionsEngine component calculates CO2 emissions from utility usage
 * This is a headless component that processes data and calls back with results
 * Handles both current emissions calculation and trend analysis vs previous month
 *
 * @param usage - Current utility usage data for emissions calculation
 * @param location - Location data for accurate regional emission factors
 * @param previousMonthEmissions - Optional previous month data for trend calculation
 * @param onEmissionsCalculated - Callback function to deliver calculated emissions
 * @returns null (headless component)
 */
export const EmissionsEngine: React.FC<EmissionsEngineProps> = ({
  usage,
  location,
  previousMonthEmissions,
  onEmissionsCalculated
}) => {
  // Calculate emissions whenever usage, location, or previous data changes
  React.useEffect(() => {
    const emissions = calculateEmissions(usage, location);

    // Calculate trend comparison if previous month data is available
    if (previousMonthEmissions) {
      const percentChange = ((emissions.total - previousMonthEmissions) / previousMonthEmissions) * 100;
      emissions.previousMonth = previousMonthEmissions;
      emissions.percentChange = Math.round(percentChange * 100) / 100; // Round to 2 decimal places
    }

    onEmissionsCalculated(emissions);
  }, [usage, location, previousMonthEmissions, onEmissionsCalculated]);

  return null; // Headless component - no UI rendering
};

/**
 * EmissionsSummary component displays a comprehensive overview of calculated emissions
 * Shows total emissions, breakdown by source, and trend comparison if available
 * Uses color coding to indicate increases (red) or decreases (green) from previous month
 *
 * @param emissions - Calculated emission results to display
 * @returns JSX element containing the emissions summary dashboard
 */
export const EmissionsSummary: React.FC<{ emissions: EmissionResults }> = ({ emissions }) => {
  /**
   * Returns the appropriate trend icon based on percentage change
   * @returns JSX icon element indicating trend direction
   */
  const getTrendIcon = () => {
    if (!emissions.percentChange) return <Minus className="w-4 h-4" />;
    if (emissions.percentChange > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (emissions.percentChange < 0) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  /**
   * Returns the appropriate color class for trend text
   * @returns Tailwind CSS color class based on trend direction
   */
  const getTrendColor = () => {
    if (!emissions.percentChange) return 'text-gray-500';
    return emissions.percentChange > 0 ? 'text-red-500' : 'text-green-500';
  };

  return (
    <div className="card">
      {/* Main emissions display with trend indicator */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Carbon Footprint</h2>
        <div className="text-4xl font-bold text-primary-600 mb-2">
          {formatEmissions(emissions.total)}
        </div>
        {/* Show trend comparison if previous month data exists */}
        {emissions.percentChange !== undefined && (
          <div className={`flex items-center justify-center gap-1 text-sm ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>
              {Math.abs(emissions.percentChange)}% {emissions.percentChange > 0 ? 'increase' : 'decrease'} from last month
            </span>
          </div>
        )}
      </div>

      {/* Breakdown cards for each emission source */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Electricity emissions card */}
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm font-medium text-yellow-800">Electricity</span>
          </div>
          <div className="text-lg font-semibold text-yellow-900">
            {formatEmissions(emissions.electricity)}
          </div>
          <div className="text-xs text-yellow-700">
            {((emissions.electricity / emissions.total) * 100).toFixed(1)}% of total
          </div>
        </div>

        {/* Natural gas emissions card */}
        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm font-medium text-orange-800">Natural Gas</span>
          </div>
          <div className="text-lg font-semibold text-orange-900">
            {formatEmissions(emissions.naturalGas)}
          </div>
          <div className="text-xs text-orange-700">
            {((emissions.naturalGas / emissions.total) * 100).toFixed(1)}% of total
          </div>
        </div>

        {/* Water emissions card */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-800">Water</span>
          </div>
          <div className="text-lg font-semibold text-blue-900">
            {formatEmissions(emissions.water)}
          </div>
          <div className="text-xs text-blue-700">
            {((emissions.water / emissions.total) * 100).toFixed(1)}% of total
          </div>
        </div>
      </div>
    </div>
  );
};