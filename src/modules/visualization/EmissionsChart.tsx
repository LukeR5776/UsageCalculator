import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import type { EmissionResults, MonthlyData } from '../../types';

/**
 * Error boundary component for chart rendering
 */
class ChartErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚫 Chart rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Color constants for different emission sources in visualizations
 * These colors maintain consistency across all chart components
 */
const COLORS = {
  electricity: '#eab308', // Yellow for electricity
  naturalGas: '#f97316',  // Orange for natural gas
  water: '#3b82f6'        // Blue for water
};

/**
 * Props for the EmissionsPieChart component
 */
interface EmissionsPieChartProps {
  emissions: EmissionResults; // Emission data breakdown by source
}

/**
 * EmissionsPieChart component renders a pie chart showing the breakdown of CO2 emissions by source
 * Displays percentages and absolute values for electricity, natural gas, and water usage
 *
 * @param emissions - The emission results containing breakdown by source
 * @returns JSX element containing the pie chart visualization
 */
export const EmissionsPieChart: React.FC<EmissionsPieChartProps> = ({ emissions }) => {
  // Convert emissions from pounds to tons for better chart scaling
  // Recharts works better with smaller, more reasonable numbers
  const electricityTons = emissions.electricity / 1000;
  const naturalGasTons = emissions.naturalGas / 1000;
  const waterTons = emissions.water / 1000;
  const totalTons = emissions.total / 1000;

  // Transform emission data into format suitable for pie chart rendering (in tons)
  // Only include sources with non-zero emissions for pie chart
  const allData = [
    { name: 'Electricity', value: electricityTons, color: COLORS.electricity },
    { name: 'Natural Gas', value: naturalGasTons, color: COLORS.naturalGas },
    { name: 'Water', value: waterTons, color: COLORS.water },
  ];

  const data = allData.filter(item => item.value > 0);




  /**
   * Custom tooltip component for the pie chart
   * Shows detailed emission information when hovering over chart segments
   *
   * @param active - Whether the tooltip is currently active
   * @param payload - Data payload from the chart segment
   * @returns Formatted tooltip with emission values and percentages
   */
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value.toFixed(2)} tons CO₂ ({((data.value / totalTons) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Fallback component if chart fails to render
  const ChartFallback = () => (
    <div className="p-6 text-center border-2 border-dashed border-gray-300 rounded-lg">
      <div className="text-4xl mb-4">⚠️</div>
      <p className="text-gray-600 font-medium mb-2">Chart unavailable</p>
      <p className="text-sm text-gray-500 mb-4">Displaying data in table format:</p>
      <div className="text-left max-w-xs mx-auto">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between py-1 border-b border-gray-200 last:border-b-0">
            <span className="text-sm font-medium">{item.name}:</span>
            <span className="text-sm">{item.value.toFixed(2)} tons CO₂ ({((item.value / totalTons) * 100).toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );

  // If no valid data, show fallback
  if (data.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emissions Breakdown</h3>
        <ChartFallback />
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Emissions Breakdown</h3>
      <div style={{ height: '256px', width: '100%' }}>
        <ChartErrorBoundary fallback={<ChartFallback />}>
          {/* Fixed dimensions instead of ResponsiveContainer to avoid height detection issues */}
          <PieChart width={600} height={250}>
            <Pie
              data={data}
              cx="50%" // Center horizontally
              cy="50%" // Center vertically
              outerRadius={80}
              dataKey="value" // Use 'value' property for segment sizes
              label
            >
              {/* Render each pie segment with its corresponding color */}
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {/* Custom tooltip shows detailed information on hover */}
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ChartErrorBoundary>
      </div>
    </div>
  );
};

/**
 * Props for the EmissionsBarChart component
 */
interface EmissionsBarChartProps {
  emissions: EmissionResults; // Emission data breakdown by source
}

/**
 * EmissionsBarChart component renders a bar chart showing CO2 emissions by source
 * Provides an alternative visualization to the pie chart for comparing emission sources
 *
 * @param emissions - The emission results containing breakdown by source
 * @returns JSX element containing the bar chart visualization
 */
export const EmissionsBarChart: React.FC<EmissionsBarChartProps> = ({ emissions }) => {
  // Convert emissions from pounds to tons for better chart scaling
  const electricityTons = emissions.electricity / 1000;
  const naturalGasTons = emissions.naturalGas / 1000;
  const waterTons = emissions.water / 1000;

  // Transform emission data into format suitable for bar chart rendering (in tons)
  const data = [
    { category: 'Electricity', emissions: electricityTons, color: COLORS.electricity },
    { category: 'Natural Gas', emissions: naturalGasTons, color: COLORS.naturalGas },
    { category: 'Water', emissions: waterTons, color: COLORS.water },
  ];



  // Fallback component if chart fails to render
  const ChartFallback = () => (
    <div className="p-6 text-center border-2 border-dashed border-gray-300 rounded-lg">
      <div className="text-4xl mb-4">⚠️</div>
      <p className="text-gray-600 font-medium mb-2">Chart unavailable</p>
      <p className="text-sm text-gray-500 mb-4">Displaying data in table format:</p>
      <div className="text-left max-w-xs mx-auto">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between py-1 border-b border-gray-200 last:border-b-0">
            <span className="text-sm font-medium">{item.category}:</span>
            <span className="text-sm">{item.emissions.toFixed(2)} tons CO₂</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Emissions by Source</h3>
      <div style={{ height: '256px', width: '100%' }}>
        <ChartErrorBoundary fallback={<ChartFallback />}>
          {/* Fixed dimensions instead of ResponsiveContainer to avoid height detection issues */}
          <BarChart width={600} height={250} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            {/* Grid lines for easier reading of values */}
            <CartesianGrid strokeDasharray="3 3" />
            {/* X-axis shows emission source categories */}
            <XAxis dataKey="category" />
            {/* Y-axis shows CO2 emission values with rotated label */}
            <YAxis label={{ value: 'tons CO₂', angle: -90, position: 'insideLeft' }} />
            {/* Tooltip shows formatted emission values on hover */}
            <Tooltip formatter={(value: number) => [`${value.toFixed(2)} tons CO₂`, 'Emissions']} />
            <Bar dataKey="emissions">
              {/* Each bar colored according to emission source */}
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartErrorBoundary>
      </div>
    </div>
  );
};

/**
 * Props for the MonthlyTrendChart component
 */
interface MonthlyTrendChartProps {
  monthlyData: MonthlyData[]; // Array of monthly emission data for trend analysis
}

/**
 * MonthlyTrendChart component renders a line chart showing emission trends over time
 * Displays total emissions and breakdown by source across multiple months
 *
 * @param monthlyData - Array of monthly emission data to visualize trends
 * @returns JSX element containing the line chart or empty state message
 */
export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ monthlyData }) => {
  // Transform monthly data into format suitable for line chart rendering
  // Format month names as abbreviated month + year (e.g., "Jan 2024")
  const data = monthlyData.map(entry => ({
    month: `${entry.month.substring(0, 3)} ${entry.year}`,
    total: entry.emissions.total,
    electricity: entry.emissions.electricity,
    naturalGas: entry.emissions.naturalGas,
    water: entry.emissions.water,
  }));

  // Show empty state when no monthly data is available
  if (data.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Add more monthly data to see trends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
      <div style={{ height: '256px', width: '100%' }}>
        {/* Fixed dimensions instead of ResponsiveContainer to avoid height detection issues */}
        <LineChart width={800} height={250} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {/* Grid lines for easier reading of trend values */}
          <CartesianGrid strokeDasharray="3 3" />
          {/* X-axis shows month labels */}
          <XAxis dataKey="month" />
          {/* Y-axis shows CO2 emission values with rotated label */}
          <YAxis label={{ value: 'lbs CO₂', angle: -90, position: 'insideLeft' }} />
          {/* Tooltip shows formatted emission values on hover */}
          <Tooltip formatter={(value: number) => [`${value.toFixed(1)} lbs CO₂`, '']} />
          {/* Legend shows line colors and labels */}
          <Legend />
          {/* Total emissions line - thicker and green to emphasize overall trend */}
          <Line type="monotone" dataKey="total" stroke="#16a34a" strokeWidth={3} name="Total" />
          {/* Individual source lines with consistent colors */}
          <Line type="monotone" dataKey="electricity" stroke={COLORS.electricity} strokeWidth={2} name="Electricity" />
          <Line type="monotone" dataKey="naturalGas" stroke={COLORS.naturalGas} strokeWidth={2} name="Natural Gas" />
          <Line type="monotone" dataKey="water" stroke={COLORS.water} strokeWidth={2} name="Water" />
        </LineChart>
      </div>
    </div>
  );
};