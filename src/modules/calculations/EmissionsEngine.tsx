import React from 'react';
import type { UtilityUsage, EmissionResults, LocationData } from '../../types';
import { calculateEmissions, formatEmissions } from '../../utils/calculations';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface EmissionsEngineProps {
  usage: UtilityUsage;
  location: LocationData;
  previousMonthEmissions?: number;
  onEmissionsCalculated: (emissions: EmissionResults) => void;
}

export const EmissionsEngine: React.FC<EmissionsEngineProps> = ({
  usage,
  location,
  previousMonthEmissions,
  onEmissionsCalculated
}) => {
  React.useEffect(() => {
    const emissions = calculateEmissions(usage, location);
    
    if (previousMonthEmissions) {
      const percentChange = ((emissions.total - previousMonthEmissions) / previousMonthEmissions) * 100;
      emissions.previousMonth = previousMonthEmissions;
      emissions.percentChange = Math.round(percentChange * 100) / 100;
    }
    
    onEmissionsCalculated(emissions);
  }, [usage, location, previousMonthEmissions, onEmissionsCalculated]);

  return null;
};

export const EmissionsSummary: React.FC<{ emissions: EmissionResults }> = ({ emissions }) => {
  const getTrendIcon = () => {
    if (!emissions.percentChange) return <Minus className="w-4 h-4" />;
    if (emissions.percentChange > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (emissions.percentChange < 0) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = () => {
    if (!emissions.percentChange) return 'text-gray-500';
    return emissions.percentChange > 0 ? 'text-red-500' : 'text-green-500';
  };

  return (
    <div className="card">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Carbon Footprint</h2>
        <div className="text-4xl font-bold text-primary-600 mb-2">
          {formatEmissions(emissions.total)}
        </div>
        {emissions.percentChange !== undefined && (
          <div className={`flex items-center justify-center gap-1 text-sm ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>
              {Math.abs(emissions.percentChange)}% {emissions.percentChange > 0 ? 'increase' : 'decrease'} from last month
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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