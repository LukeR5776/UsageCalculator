import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { EmissionResults } from '../lib/types';

interface EmissionsScatterPlotProps {
  emissions: EmissionResults;
}

export const EmissionsScatterPlot: React.FC<EmissionsScatterPlotProps> = ({ emissions }) => {
  const data = [
    {
      name: 'Electricity',
      x: emissions.electricity,
      y: emissions.electricity * 0.8,
      fill: '#eab308',
    },
    {
      name: 'Natural Gas',
      x: emissions.naturalGas,
      y: emissions.naturalGas * 1.2,
      fill: '#f97316',
    },
    {
      name: 'Water',
      x: emissions.water,
      y: emissions.water * 1.5,
      fill: '#3b82f6',
    },
  ];

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Emissions Scatter Plot</h3>
        <p className="text-sm text-muted-foreground">Visual representation of emissions by source</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name="Usage Impact"
              unit=" lbs CO₂"
              domain={[0, 'dataMax + 10']}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Environmental Impact"
              unit=" lbs CO₂"
              domain={[0, 'dataMax + 10']}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value: number, name: string) => [`${value.toFixed(1)} lbs CO₂`, name]}
            />
            <Scatter dataKey="y" fill="#8884d8">
              {data.map((entry, index) => (
                <Scatter key={`scatter-${index}`} fill={entry.fill} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};