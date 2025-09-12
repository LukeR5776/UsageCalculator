import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import type { EmissionResults, MonthlyData } from '../../types';

const COLORS = {
  electricity: '#eab308',
  naturalGas: '#f97316', 
  water: '#3b82f6'
};

interface EmissionsPieChartProps {
  emissions: EmissionResults;
}

export const EmissionsPieChart: React.FC<EmissionsPieChartProps> = ({ emissions }) => {
  const data = [
    { name: 'Electricity', value: emissions.electricity, color: COLORS.electricity },
    { name: 'Natural Gas', value: emissions.naturalGas, color: COLORS.naturalGas },
    { name: 'Water', value: emissions.water, color: COLORS.water },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value.toFixed(1)} lbs CO₂ ({((data.value / emissions.total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Emissions Breakdown</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(1)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface EmissionsBarChartProps {
  emissions: EmissionResults;
}

export const EmissionsBarChart: React.FC<EmissionsBarChartProps> = ({ emissions }) => {
  const data = [
    { category: 'Electricity', emissions: emissions.electricity, color: COLORS.electricity },
    { category: 'Natural Gas', emissions: emissions.naturalGas, color: COLORS.naturalGas },
    { category: 'Water', emissions: emissions.water, color: COLORS.water },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Emissions by Source</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis label={{ value: 'lbs CO₂', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number) => [`${value.toFixed(1)} lbs CO₂`, 'Emissions']} />
            <Bar dataKey="emissions">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface MonthlyTrendChartProps {
  monthlyData: MonthlyData[];
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ monthlyData }) => {
  const data = monthlyData.map(entry => ({
    month: `${entry.month.substring(0, 3)} ${entry.year}`,
    total: entry.emissions.total,
    electricity: entry.emissions.electricity,
    naturalGas: entry.emissions.naturalGas,
    water: entry.emissions.water,
  }));

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
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis label={{ value: 'lbs CO₂', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number) => [`${value.toFixed(1)} lbs CO₂`, '']} />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#16a34a" strokeWidth={3} name="Total" />
            <Line type="monotone" dataKey="electricity" stroke={COLORS.electricity} strokeWidth={2} name="Electricity" />
            <Line type="monotone" dataKey="naturalGas" stroke={COLORS.naturalGas} strokeWidth={2} name="Natural Gas" />
            <Line type="monotone" dataKey="water" stroke={COLORS.water} strokeWidth={2} name="Water" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};