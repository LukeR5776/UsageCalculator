import React from 'react';
import { Lightbulb, Flame, Droplets, DollarSign, Leaf, ChevronRight } from 'lucide-react';
import type { UtilityUsage, EmissionResults, Recommendation } from '../../types';
import { calculateCostSavings } from '../../utils/calculations';

/**
 * Props for the RecommendationEngine component
 */
interface RecommendationEngineProps {
  usage: UtilityUsage;                                                       // Current utility usage data
  emissions: EmissionResults;                                                // Current emission calculations
  onRecommendationsGenerated: (recommendations: Recommendation[]) => void;  // Callback when recommendations are ready
}

/**
 * RecommendationEngine component generates personalized recommendations based on utility usage
 * This is a headless component that processes data and calls back with recommendations
 * Does not render any UI - used purely for recommendation logic
 *
 * @param usage - Current utility usage data for analysis
 * @param emissions - Current emission results for calculating potential savings
 * @param onRecommendationsGenerated - Callback function to deliver generated recommendations
 * @returns null (headless component)
 */
export const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  usage,
  emissions,
  onRecommendationsGenerated
}) => {
  // Generate recommendations whenever usage or emissions change
  React.useEffect(() => {
    const recommendations = generateRecommendations(usage, emissions);
    onRecommendationsGenerated(recommendations);
  }, [usage, emissions, onRecommendationsGenerated]);

  return null; // Headless component - no UI rendering
};

/**
 * Generates personalized recommendations based on usage patterns and thresholds
 * Uses rule-based logic to suggest improvements when usage exceeds typical levels
 * Calculates potential CO2 and cost savings for each recommendation
 *
 * @param usage - Current utility usage data to analyze
 * @param emissions - Current emission results for calculating savings
 * @returns Array of personalized recommendations sorted by potential CO2 impact
 */
function generateRecommendations(usage: UtilityUsage, emissions: EmissionResults): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Recommend LED lights for high electricity usage (>800 kWh)
  if (usage.electricity.usage > 800) {
    recommendations.push({
      id: 'led-lights',
      category: 'electricity',
      title: 'Switch to LED Light Bulbs',
      description: 'Replace incandescent bulbs with LED bulbs to reduce electricity consumption by up to 75%.',
      potentialSavings: {
        co2: emissions.electricity * 0.15,   // 15% reduction in electricity emissions
        cost: calculateCostSavings(emissions.electricity, 15)
      },
      difficulty: 'easy'
    });
  }

  // Recommend smart thermostat for very high electricity usage (>1000 kWh)
  if (usage.electricity.usage > 1000) {
    recommendations.push({
      id: 'smart-thermostat',
      category: 'electricity',
      title: 'Install a Smart Thermostat',
      description: 'Smart thermostats can reduce heating and cooling costs by 10-23% through optimized scheduling.',
      potentialSavings: {
        co2: emissions.electricity * 0.2,    // 20% reduction in electricity emissions
        cost: calculateCostSavings(emissions.electricity, 20)
      },
      difficulty: 'medium'
    });
  }

  // Recommend unplugging devices for moderate electricity usage (>600 kWh)
  if (usage.electricity.usage > 600) {
    recommendations.push({
      id: 'unplug-devices',
      category: 'electricity',
      title: 'Unplug Unused Electronics',
      description: 'Phantom loads from electronics in standby mode can account for 5-10% of your electricity usage.',
      potentialSavings: {
        co2: emissions.electricity * 0.08,   // 8% reduction in electricity emissions
        cost: calculateCostSavings(emissions.electricity, 8)
      },
      difficulty: 'easy'
    });
  }

  // Recommend thermostat adjustment for moderate gas usage (>50 therms)
  if (usage.naturalGas.usage > 50) {
    recommendations.push({
      id: 'lower-thermostat',
      category: 'gas',
      title: 'Lower Your Thermostat',
      description: 'Reducing your thermostat by 2°F can save up to 10% on heating costs.',
      potentialSavings: {
        co2: emissions.naturalGas * 0.1,     // 10% reduction in gas emissions
        cost: calculateCostSavings(emissions.naturalGas, 10)
      },
      difficulty: 'easy'
    });
  }

  // Recommend air sealing for high gas usage (>70 therms)
  if (usage.naturalGas.usage > 70) {
    recommendations.push({
      id: 'seal-air-leaks',
      category: 'gas',
      title: 'Seal Air Leaks',
      description: 'Caulk and weatherstrip around windows and doors to prevent heated air from escaping.',
      potentialSavings: {
        co2: emissions.naturalGas * 0.15,    // 15% reduction in gas emissions
        cost: calculateCostSavings(emissions.naturalGas, 15)
      },
      difficulty: 'medium'
    });
  }

  // Recommend low-flow fixtures for high water usage (>8000 gallons)
  if (usage.water.usage > 8000) {
    recommendations.push({
      id: 'low-flow-fixtures',
      category: 'water',
      title: 'Install Low-Flow Fixtures',
      description: 'Low-flow showerheads and faucet aerators can reduce water usage by 30-50%.',
      potentialSavings: {
        co2: emissions.water * 0.4,          // 40% reduction in water emissions
        cost: calculateCostSavings(emissions.water, 40)
      },
      difficulty: 'medium'
    });
  }

  // Recommend shorter showers for moderate water usage (>6000 gallons)
  if (usage.water.usage > 6000) {
    recommendations.push({
      id: 'shorter-showers',
      category: 'water',
      title: 'Take Shorter Showers',
      description: 'Reducing shower time by 2 minutes can save over 1,500 gallons of water per person per year.',
      potentialSavings: {
        co2: emissions.water * 0.2,          // 20% reduction in water emissions
        cost: calculateCostSavings(emissions.water, 20)
      },
      difficulty: 'easy'
    });
  }

  // Always recommend energy audit as a comprehensive solution
  recommendations.push({
    id: 'energy-audit',
    category: 'general',
    title: 'Schedule a Home Energy Audit',
    description: 'Professional energy audits can identify specific areas for improvement in your home.',
    potentialSavings: {
      co2: emissions.total * 0.25,         // 25% reduction in total emissions
      cost: calculateCostSavings(emissions.total, 25)
    },
    difficulty: 'medium'
  });

  // Sort by CO2 impact (highest first) and limit to top 6 recommendations
  return recommendations
    .sort((a, b) => b.potentialSavings.co2 - a.potentialSavings.co2)
    .slice(0, 6);
}

/**
 * Props for the RecommendationsDisplay component
 */
interface RecommendationsDisplayProps {
  recommendations: Recommendation[]; // Array of recommendations to display
}

/**
 * RecommendationsDisplay component renders a list of personalized recommendations
 * Shows recommendation details, potential savings, and difficulty levels
 * Includes summary of total potential impact
 *
 * @param recommendations - Array of recommendations to display
 * @returns JSX element containing the recommendations list or empty state
 */
export const RecommendationsDisplay: React.FC<RecommendationsDisplayProps> = ({ recommendations }) => {
  /**
   * Returns the appropriate icon for each recommendation category
   * @param category - The recommendation category (electricity, gas, water, general)
   * @returns JSX icon element
   */
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electricity': return <Lightbulb className="w-5 h-5" />;
      case 'gas': return <Flame className="w-5 h-5" />;
      case 'water': return <Droplets className="w-5 h-5" />;
      default: return <Leaf className="w-5 h-5" />;
    }
  };

  /**
   * Returns the appropriate color scheme for each recommendation category
   * @param category - The recommendation category
   * @returns Tailwind CSS classes for text and background colors
   */
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'electricity': return 'text-yellow-600 bg-yellow-100';
      case 'gas': return 'text-orange-600 bg-orange-100';
      case 'water': return 'text-blue-600 bg-blue-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  /**
   * Returns the appropriate color scheme for difficulty levels
   * @param difficulty - The difficulty level (easy, medium, hard)
   * @returns Tailwind CSS classes for text and background colors
   */
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-700 bg-green-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'hard': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  // Show empty state when no recommendations are available
  if (recommendations.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalized Recommendations</h3>
        <div className="text-center py-8 text-gray-500">
          <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>Add your usage data to get personalized recommendations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Component header with icon and description */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Lightbulb className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Personalized Recommendations</h3>
          <p className="text-sm text-gray-600">Ways to reduce your carbon footprint and save money</p>
        </div>
      </div>

      {/* List of recommendation cards */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              {/* Category icon with color coding */}
              <div className={`p-2 rounded-lg ${getCategoryColor(rec.category)}`}>
                {getCategoryIcon(rec.category)}
              </div>

              <div className="flex-1">
                {/* Recommendation title and difficulty badge */}
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{rec.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(rec.difficulty)}`}>
                    {rec.difficulty}
                  </span>
                </div>

                {/* Recommendation description */}
                <p className="text-sm text-gray-600 mb-3">{rec.description}</p>

                {/* Potential savings display and chevron */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    {/* CO2 savings */}
                    <div className="flex items-center gap-1 text-green-600">
                      <Leaf className="w-4 h-4" />
                      <span>{rec.potentialSavings.co2.toFixed(1)} lbs CO₂/month</span>
                    </div>
                    {/* Cost savings */}
                    <div className="flex items-center gap-1 text-green-600">
                      <DollarSign className="w-4 h-4" />
                      <span>${rec.potentialSavings.cost.toFixed(0)}/year</span>
                    </div>
                  </div>

                  {/* Chevron indicating expandable content */}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary of total potential impact from all recommendations */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-900">Total Potential Impact</span>
        </div>
        <div className="text-sm text-green-800">
          Following these recommendations could reduce your emissions by{' '}
          <span className="font-semibold">
            {/* Calculate total CO2 savings across all recommendations */}
            {recommendations.reduce((sum, rec) => sum + rec.potentialSavings.co2, 0).toFixed(1)} lbs CO₂
          </span>{' '}
          per month and save you{' '}
          <span className="font-semibold">
            {/* Calculate total cost savings across all recommendations */}
            ${recommendations.reduce((sum, rec) => sum + rec.potentialSavings.cost, 0).toFixed(0)}
          </span>{' '}
          per year.
        </div>
      </div>
    </div>
  );
};