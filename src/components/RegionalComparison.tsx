import React from 'react';
import { TrendingUp, TrendingDown, Minus, Users, MapPin } from 'lucide-react';
import type { EmissionResults, LocationData } from '../lib/types';
import { getRegionalAverage } from '../lib/emissionFactors';
import { calculateEmissions } from '../lib/calculations';

interface RegionalComparisonProps {
  emissions: EmissionResults;
  location: LocationData;
}

export const RegionalComparison: React.FC<RegionalComparisonProps> = ({ emissions, location }) => {
  const calculateRegionalComparison = () => {
    const regionalElectricity = getRegionalAverage('electricity', location.state);
    const regionalNaturalGas = getRegionalAverage('naturalGas', location.state);
    const regionalWater = getRegionalAverage('water', location.state);

    const regionalUsage = {
      electricity: { usage: regionalElectricity, cost: 0, unit: 'kWh' as const },
      naturalGas: { usage: regionalNaturalGas, cost: 0, unit: 'therms' as const },
      water: { usage: regionalWater, cost: 0, unit: 'gallons' as const }
    };

    const regionalEmissions = calculateEmissions(regionalUsage, location);
    
    const comparison = {
      userEmissions: emissions.total,
      regionalAverage: regionalEmissions.total,
      difference: emissions.total - regionalEmissions.total,
      percentDifference: ((emissions.total - regionalEmissions.total) / regionalEmissions.total) * 100
    };

    return comparison;
  };

  const comparison = calculateRegionalComparison();

  const getComparisonText = () => {
    const absDiff = Math.abs(comparison.percentDifference);
    if (absDiff < 5) {
      return { text: 'about average', color: 'text-muted-foreground', bgColor: 'bg-muted/50', icon: Minus };
    } else if (comparison.difference > 0) {
      return { 
        text: `${absDiff.toFixed(0)}% above average`, 
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
        icon: TrendingUp 
      };
    } else {
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

  const getPercentile = () => {
    if (comparison.percentDifference < -20) return 10;
    if (comparison.percentDifference < -10) return 25;
    if (comparison.percentDifference < -5) return 40;
    if (comparison.percentDifference < 5) return 50;
    if (comparison.percentDifference < 10) return 60;
    if (comparison.percentDifference < 20) return 75;
    return 90;
  };

  const percentile = getPercentile();

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Regional Comparison</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{location.state} Average</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="text-center p-6 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-foreground mb-2">
            {emissions.total.toFixed(1)} lbs
          </div>
          <div className="text-sm text-muted-foreground">Your Emissions</div>
        </div>

        <div className="text-center p-6 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-foreground mb-2">
            {comparison.regionalAverage.toFixed(1)} lbs
          </div>
          <div className="text-sm text-muted-foreground">Regional Average</div>
        </div>
      </div>

      <div className="mt-6">
        <div className={`flex items-center justify-center gap-2 p-4 rounded-lg ${comparisonInfo.bgColor}`}>
          <Icon className={`w-5 h-5 ${comparisonInfo.color}`} />
          <span className={`font-medium ${comparisonInfo.color}`}>
            Your emissions are {comparisonInfo.text}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Your position vs. others</span>
          <span className="text-sm font-medium text-gray-900">{percentile}th percentile</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 relative">
          <div 
            className="bg-primary-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentile}%` }}
          />
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white border-2 border-primary-700 rounded-full"
            style={{ left: `${percentile}%`, transform: 'translateX(-50%) translateY(-50%)' }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Lower emissions</span>
          <span>Higher emissions</span>
        </div>
      </div>

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