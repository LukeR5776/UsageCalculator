import React from 'react';
import type { EmissionResults, MonthlyData } from '../lib/types';

// Chart colors using CSS variables for theming
const CHART_COLORS = {
  electricity: 'hsl(var(--chart-2))', // Yellow-green
  naturalGas: 'hsl(var(--chart-5))',  // Orange-red
  water: 'hsl(var(--chart-3))',       // Blue
};

interface EmissionsPieChartProps {
  emissions: EmissionResults;
}

export const EmissionsPieChart: React.FC<EmissionsPieChartProps> = ({ emissions }) => {
  const total = emissions.total;
  const electricityPercent = (emissions.electricity / total) * 100;
  const gasPercent = (emissions.naturalGas / total) * 100;
  const waterPercent = (emissions.water / total) * 100;

  const chartData = [
    { category: 'electricity', value: emissions.electricity, percent: electricityPercent, fill: CHART_COLORS.electricity },
    { category: 'naturalGas', value: emissions.naturalGas, percent: gasPercent, fill: CHART_COLORS.naturalGas },
    { category: 'water', value: emissions.water, percent: waterPercent, fill: CHART_COLORS.water },
  ];

  const legendData = [
    { label: 'Electricity', value: emissions.electricity, percent: electricityPercent, color: CHART_COLORS.electricity, icon: '⚡' },
    { label: 'Natural Gas', value: emissions.naturalGas, percent: gasPercent, color: CHART_COLORS.naturalGas, icon: '🔥' },
    { label: 'Water', value: emissions.water, percent: waterPercent, color: CHART_COLORS.water, icon: '💧' },
  ];

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            CO₂ Emissions Breakdown
          </h3>
          <p className="text-xs text-muted-foreground">
            Distribution by utility source
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold leading-none text-foreground">{total.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground">lbs CO₂</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pie Chart */}
        <div className="flex items-center justify-center p-8">
          <div className="relative">
            {/* Outer ring with segments */}
            <svg className="h-40 w-40" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="4"
              />

              {/* Data segments */}
              {(() => {
                let cumulativePercent = 0;
                return chartData.map((item, index) => {
                  const startAngle = (cumulativePercent * 360) - 90;
                  const endAngle = ((cumulativePercent + item.percent / 100) * 360) - 90;
                  const largeArcFlag = item.percent > 50 ? 1 : 0;

                  const x1 = 50 + 42 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 50 + 42 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 = 50 + 42 * Math.cos((endAngle * Math.PI) / 180);
                  const y2 = 50 + 42 * Math.sin((endAngle * Math.PI) / 180);

                  const pathData = `M 50 50 L ${x1} ${y1} A 42 42 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                  cumulativePercent += item.percent / 100;

                  return (
                    <path
                      key={index}
                      d={pathData}
                      fill={item.fill}
                      stroke="hsl(var(--background))"
                      strokeWidth="2"
                      className="transition-all hover:opacity-80"
                    />
                  );
                });
              })()}

              {/* Center circle */}
              <circle
                cx="50"
                cy="50"
                r="25"
                fill="hsl(var(--card))"
                stroke="hsl(var(--border))"
                strokeWidth="2"
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{total.toFixed(0)}</div>
                <div className="text-xs text-muted-foreground">lbs CO₂</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {legendData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{item.icon}</span>
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium leading-none">{item.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.value.toFixed(1)} lbs
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-primary">
                  {item.percent.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface EmissionsBarChartProps {
  emissions: EmissionResults;
}

export const EmissionsBarChart: React.FC<EmissionsBarChartProps> = ({ emissions }) => {
  const data = [
    { category: 'Electricity', value: emissions.electricity, color: CHART_COLORS.electricity, icon: '⚡' },
    { category: 'Natural Gas', value: emissions.naturalGas, color: CHART_COLORS.naturalGas, icon: '🔥' },
    { category: 'Water', value: emissions.water, color: CHART_COLORS.water, icon: '💧' },
  ];

  const maxValue = Math.max(emissions.electricity, emissions.naturalGas, emissions.water);
  const chartHeight = 200;

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-base font-medium leading-none">
            Emissions by Source
          </h3>
          <p className="text-xs text-muted-foreground">
            Compare across utility types
          </p>
        </div>
      </div>

      <div className="relative" style={{ height: chartHeight + 80 }}>
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pt-4 pb-16">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-border/30"></div>
          ))}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 h-full flex flex-col justify-between pt-4 pb-16 -ml-12">
          {[...Array(5)].map((_, i) => {
            const value = (maxValue * (4 - i)) / 4;
            return (
              <div key={i} className="text-xs text-muted-foreground -translate-y-1/2">
                {value.toFixed(0)}
              </div>
            );
          })}
        </div>

        {/* Bars container */}
        <div className="h-full flex items-end justify-center gap-8 px-4 pb-16 pt-4">
          {data.map((item, index) => {
            const height = Math.max((item.value / maxValue) * chartHeight, 8);
            return (
              <div key={index} className="flex flex-col items-center group relative">
                {/* Hover tooltip */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <div className="bg-popover text-popover-foreground px-3 py-1 rounded-md border text-xs font-medium whitespace-nowrap">
                    {item.value.toFixed(1)} lbs CO₂
                  </div>
                </div>

                {/* Bar */}
                <div
                  className="w-16 rounded-t-lg transition-all duration-500 ease-out group-hover:brightness-110 relative overflow-hidden"
                  style={{
                    height: `${height}px`,
                    backgroundColor: item.color,
                  }}
                >
                  {/* Inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20"></div>
                </div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="text-sm">{item.icon}</span>
                    <div className="text-xs font-medium text-foreground">{item.category}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{item.value.toFixed(1)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Y-axis label */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground -ml-8">
          CO₂ Emissions (lbs)
        </div>
      </div>
    </div>
  );
};

interface MonthlyTrendChartProps {
  monthlyData: MonthlyData[];
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ monthlyData }) => {
  if (monthlyData.length === 0) {
    return (
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-medium leading-none">
              Monthly Trends
            </h3>
            <p className="text-xs text-muted-foreground">
              Track emissions over time
            </p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground p-8">
          <div className="text-center">
            <div className="text-4xl mb-3">📈</div>
            <p className="text-muted-foreground">Add monthly data to see trends</p>
            <p className="text-xs text-muted-foreground mt-1">Historical emissions will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  const data = monthlyData.map(entry => ({
    month: `${entry.month.substring(0, 3)} ${entry.year}`,
    total: entry.emissions.total,
    electricity: entry.emissions.electricity,
    naturalGas: entry.emissions.naturalGas,
    water: entry.emissions.water,
  }));

  const maxValue = Math.max(...data.map(d => d.total));
  const minValue = Math.min(...data.map(d => d.total));
  const range = maxValue - minValue;

  const chartWidth = 400;
  const chartHeight = 160;
  const padding = 30;

  const points = data.map((item, index) => ({
    x: padding + (index * (chartWidth - 2 * padding)) / Math.max(data.length - 1, 1),
    y: range > 0
      ? chartHeight - padding - ((item.total - minValue) / range) * (chartHeight - 2 * padding)
      : chartHeight / 2
  }));

  const createPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    return points.reduce((acc, point, i) => {
      return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
    }, '');
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-base font-medium leading-none">
            Monthly Trends
          </h3>
          <p className="text-xs text-muted-foreground">
            {data.length} month{data.length > 1 ? 's' : ''} • Range: {minValue.toFixed(0)}-{maxValue.toFixed(0)} lbs
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground p-4">
        <div className="relative">
          <svg
            width="100%"
            height={chartHeight}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="overflow-visible"
          >
            {/* Grid lines */}
            {[...Array(4)].map((_, i) => {
              const y = padding + (i * (chartHeight - 2 * padding)) / 3;
              return (
                <line
                  key={`grid-${i}`}
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="hsl(var(--border))"
                  strokeDasharray="2,2"
                  opacity="0.5"
                />
              );
            })}

            {/* Area gradient */}
            <defs>
              <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Area fill */}
            <path
              d={`${createPath(points)} L ${points[points.length - 1]?.x || 0} ${chartHeight - padding} L ${points[0]?.x || 0} ${chartHeight - padding} Z`}
              fill="url(#trendGradient)"
            />

            {/* Line */}
            <path
              d={createPath(points)}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--background))"
                  strokeWidth="2"
                  className="hover:r-6 transition-all duration-200"
                />
              </g>
            ))}
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between mt-3 px-7">
            {data.map((item, index) => (
              <div key={index} className="text-xs text-muted-foreground">
                {item.month}
              </div>
            ))}
          </div>
        </div>

        {/* Trend indicator */}
        {data.length > 1 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="font-medium">Total Emissions</span>
              </div>
              <div className="text-muted-foreground">
                Latest: {data[data.length - 1].total.toFixed(1)} lbs CO₂
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};