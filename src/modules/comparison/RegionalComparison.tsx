import React from 'react';
import { TrendingUp, TrendingDown, Minus, Users, MapPin } from 'lucide-react';
import type { EmissionResults, LocationData } from '../../types';
import { getRegionalAverage } from '../../utils/emissionFactors';
import { calculateEmissions } from '../../utils/calculations';

/**
 * Props for the RegionalComparison component
 */
interface RegionalComparisonProps {
  emissions: EmissionResults; // User's current emission results
  location: LocationData;     // User's location for regional averages
}

/**
 * RegionalComparison component compares user's emissions to regional averages
 * Calculates how user performs vs typical household in their state
 * Provides context and insights about emission performance
 *
 * @param emissions - User's calculated emission results
 * @param location - User's location data for regional comparison
 * @returns JSX element containing regional comparison dashboard
 */
export const RegionalComparison: React.FC<RegionalComparisonProps> = ({ emissions, location }) => {
  /**
   * Calculates comparison metrics between user and regional averages
   * Gets regional usage averages and calculates emissions for comparison
   * @returns Comparison object with user vs regional metrics
   */
  const calculateRegionalComparison = () => {
    // Get regional average usage for each utility type
    const regionalElectricity = getRegionalAverage('electricity', location.state);
    const regionalNaturalGas = getRegionalAverage('naturalGas', location.state);
    const regionalWater = getRegionalAverage('water', location.state);

    // Build usage object for regional averages (costs set to 0 as we only need emissions)
    const regionalUsage = {
      electricity: { usage: regionalElectricity, cost: 0, unit: 'kWh' as const },
      naturalGas: { usage: regionalNaturalGas, cost: 0, unit: 'therms' as const },
      water: { usage: regionalWater, cost: 0, unit: 'gallons' as const }
    };

    // Calculate emissions for regional averages using same location factors
    const regionalEmissions = calculateEmissions(regionalUsage, location);

    // Calculate comparison metrics
    const comparison = {
      userEmissions: emissions.total,
      regionalAverage: regionalEmissions.total,
      difference: emissions.total - regionalEmissions.total,
      percentDifference: ((emissions.total - regionalEmissions.total) / regionalEmissions.total) * 100
    };

    return comparison;
  };

  const comparison = calculateRegionalComparison();

  /**
   * Determines appropriate text, colors, and icon for comparison display
   * Categorizes performance as average, above average, or below average
   * @returns Object with display properties for comparison result
   */
  const getComparisonText = () => {
    const absDiff = Math.abs(comparison.percentDifference);
    if (absDiff < 5) {
      // Within 5% is considered average
      return { text: 'about average', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: Minus };
    } else if (comparison.difference > 0) {
      // Above regional average (worse performance)
      return {
        text: `${absDiff.toFixed(0)}% above average`,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: TrendingUp
      };
    } else {
      // Below regional average (better performance)
      return {
        text: `${absDiff.toFixed(0)}% below average`,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: TrendingDown
      };
    }
  };

  const comparisonInfo = getComparisonText();
  const Icon = comparisonInfo.icon;

  /**
   * Estimates user's percentile ranking based on their emissions difference
   * Maps percentage difference to approximate percentile position
   * @returns Estimated percentile (10-90) based on performance
   */
  const getPercentile = () => {
    if (comparison.percentDifference < -20) return 10;  // Much lower than average
    if (comparison.percentDifference < -10) return 25;  // Moderately lower
    if (comparison.percentDifference < -5) return 40;   // Slightly lower
    if (comparison.percentDifference < 5) return 50;    // About average
    if (comparison.percentDifference < 10) return 60;   // Slightly higher
    if (comparison.percentDifference < 20) return 75;   // Moderately higher
    return 90;                                          // Much higher than average
  };

  const percentile = getPercentile();

  return (
    <div className="card">
      {/* Component header with location indicator */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Users className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Regional Comparison</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{location.state} Average</span>
          </div>
        </div>
      </div>

      {/* Side-by-side comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User's emissions card */}
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {emissions.total.toFixed(1)} lbs
          </div>
          <div className="text-sm text-gray-600">Your Emissions</div>
        </div>

        {/* Regional average emissions card */}
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {comparison.regionalAverage.toFixed(1)} lbs
          </div>
          <div className="text-sm text-gray-600">Regional Average</div>
        </div>
      </div>

      {/* Comparison result banner */}
      <div className="mt-6">
        <div className={`flex items-center justify-center gap-2 p-4 rounded-lg ${comparisonInfo.bgColor}`}>
          <Icon className={`w-5 h-5 ${comparisonInfo.color}`} />
          <span className={`font-medium ${comparisonInfo.color}`}>
            Your emissions are {comparisonInfo.text}
          </span>
        </div>
      </div>

      {/* Percentile ranking visualization */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Your position vs. others</span>
          <span className="text-sm font-medium text-gray-900">{percentile}th percentile</span>
        </div>
        {/* Progress bar showing percentile position */}
        <div className="w-full bg-gray-200 rounded-full h-3 relative">
          <div
            className="bg-primary-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentile}%` }}
          />
          {/* Position marker on the progress bar */}
          <div
            className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white border-2 border-primary-700 rounded-full"
            style={{ left: `${percentile}%`, transform: 'translateX(-50%) translateY(-50%)' }}
          />
        </div>
        {/* Scale labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Lower emissions</span>
          <span>Higher emissions</span>
        </div>
      </div>

      {/* Contextual explanation of comparison results */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">What this means:</h4>
        <p className="text-sm text-blue-800">
          {comparison.difference > 0
            ? `You're using ${Math.abs(comparison.difference).toFixed(1)} lbs more CO₂ per month than the average household in ${location.state}. Small changes in your usage habits could make a significant impact.`
            : comparison.difference < 0
            ? `Great job! You're using ${Math.abs(comparison.difference).toFixed(1)} lbs less CO₂ per month than the average household in ${location.state}. Keep up the good work!`
            : `Your emissions are right in line with the average household in ${location.state}.`
          }
        </p>
      </div>
    </div>
  );
};