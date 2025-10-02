import React, { useState, useMemo } from 'react';
import { Zap, Flame, Droplets, DollarSign, Calculator } from 'lucide-react';
import type { UtilityUsage } from '../lib/types';
import { estimateUsageFromCost } from '../lib/calculations';

interface UsageInputFormProps {
  onSubmit: (usage: UtilityUsage) => void;
  isLoading?: boolean;
  state?: string;
}

interface FormData {
  electricity: {
    usage: string;
    cost: string;
    useEstimate: boolean;
  };
  naturalGas: {
    usage: string;
    cost: string;
    unit: 'therms' | 'ccf' | 'mcf';
    useEstimate: boolean;
  };
  water: {
    usage: string;
    cost: string;
    unit: 'gallons' | 'cubic_feet';
    useEstimate: boolean;
  };
}

export const UsageInputForm: React.FC<UsageInputFormProps> = ({
  onSubmit,
  isLoading = false,
  state
}) => {
  const [formData, setFormData] = useState<FormData>({
    electricity: { usage: '10', cost: '100', useEstimate: true },
    naturalGas: { usage: '10', cost: '100', unit: 'therms', useEstimate: true },
    water: { usage: '10', cost: '100', unit: 'gallons', useEstimate: true }
  });

  // Use useMemo to prevent unnecessary re-renders and focus loss
  const estimatedUsage = useMemo(() => {
    const newEstimatedUsage: Partial<Record<keyof FormData, number>> = {};

    if (formData.electricity.useEstimate && formData.electricity.cost) {
      const cost = parseFloat(formData.electricity.cost);
      if (!isNaN(cost)) {
        newEstimatedUsage.electricity = estimateUsageFromCost(cost, 'electricity', state);
      }
    }

    if (formData.naturalGas.useEstimate && formData.naturalGas.cost) {
      const cost = parseFloat(formData.naturalGas.cost);
      if (!isNaN(cost)) {
        newEstimatedUsage.naturalGas = estimateUsageFromCost(cost, 'naturalGas', state);
      }
    }

    if (formData.water.useEstimate && formData.water.cost) {
      const cost = parseFloat(formData.water.cost);
      if (!isNaN(cost)) {
        newEstimatedUsage.water = estimateUsageFromCost(cost, 'water', state);
      }
    }

    return newEstimatedUsage;
  }, [formData.electricity.useEstimate, formData.electricity.cost,
      formData.naturalGas.useEstimate, formData.naturalGas.cost,
      formData.water.useEstimate, formData.water.cost, state]);

  const updateFormData = (utility: keyof FormData, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [utility]: {
        ...prev[utility],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const usage: UtilityUsage = {
      electricity: {
        usage: formData.electricity.useEstimate 
          ? estimatedUsage.electricity || 0
          : parseFloat(formData.electricity.usage) || 0,
        cost: parseFloat(formData.electricity.cost) || 0,
        unit: 'kWh'
      },
      naturalGas: {
        usage: formData.naturalGas.useEstimate
          ? estimatedUsage.naturalGas || 0
          : parseFloat(formData.naturalGas.usage) || 0,
        cost: parseFloat(formData.naturalGas.cost) || 0,
        unit: formData.naturalGas.unit
      },
      water: {
        usage: formData.water.useEstimate
          ? estimatedUsage.water || 0
          : parseFloat(formData.water.usage) || 0,
        cost: parseFloat(formData.water.cost) || 0,
        unit: formData.water.unit
      }
    };

    onSubmit(usage);
  };

  const isFormValid = () => {
    return (
      (formData.electricity.usage || (formData.electricity.useEstimate && formData.electricity.cost)) &&
      (formData.naturalGas.usage || (formData.naturalGas.useEstimate && formData.naturalGas.cost)) &&
      (formData.water.usage || (formData.water.useEstimate && formData.water.cost))
    );
  };

  const UtilitySection = React.memo(({
    title,
    icon: Icon,
    color,
    utility,
    usageLabel,
    usageUnit,
    unitOptions
  }: {
    title: string;
    icon: React.ElementType;
    color: string;
    utility: keyof FormData;
    usageLabel: string;
    usageUnit?: string;
    unitOptions?: Array<{ value: string; label: string }>;
  }) => (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Monthly Bill Amount
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData[utility].cost}
            onChange={(e) => updateFormData(utility, 'cost', e.target.value)}
            className="input-field"
          />
        </div>

        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border">
          <input
            type="checkbox"
            id={`estimate-${utility}`}
            checked={formData[utility].useEstimate}
            onChange={(e) => updateFormData(utility, 'useEstimate', e.target.checked)}
            className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary"
          />
          <label htmlFor={`estimate-${utility}`} className="text-sm text-foreground flex items-center gap-1">
            <Calculator className="w-4 h-4" />
            Estimate usage from bill amount
          </label>
        </div>

        {formData[utility].useEstimate ? (
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-primary">
              Estimated usage: <span className="font-semibold">
                {estimatedUsage[utility]?.toLocaleString() || 0} {usageUnit || (formData[utility] as any).unit || ''}
              </span>
            </p>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {usageLabel}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0"
                value={formData[utility].usage}
                onChange={(e) => updateFormData(utility, 'usage', e.target.value)}
                className="input-field flex-1"
              />
              {unitOptions && (
                <select
                  value={(formData[utility] as any).unit || ''}
                  onChange={(e) => updateFormData(utility, 'unit', e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-input text-foreground"
                >
                  {unitOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              {!unitOptions && usageUnit && (
                <span className="px-3 py-2 bg-muted border border-border rounded-lg text-muted-foreground">
                  {usageUnit}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  ));

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Enter Your Usage Data</h2>
        <p className="text-muted-foreground">Provide your monthly utility usage or let us estimate from your bills</p>
      </div>

      <UtilitySection
        title="Electricity"
        icon={Zap}
        color="bg-yellow-500"
        utility="electricity"
        usageLabel="Usage (kWh)"
        usageUnit="kWh"
      />

      <UtilitySection
        title="Natural Gas"
        icon={Flame}
        color="bg-orange-500"
        utility="naturalGas"
        usageLabel="Usage"
        unitOptions={[
          { value: 'therms', label: 'therms' },
          { value: 'ccf', label: 'CCF' },
          { value: 'mcf', label: 'MCF' }
        ]}
      />

      <UtilitySection
        title="Water"
        icon={Droplets}
        color="bg-blue-500"
        utility="water"
        usageLabel="Usage"
        unitOptions={[
          { value: 'gallons', label: 'gallons' },
          { value: 'cubic_feet', label: 'cubic feet' }
        ]}
      />

      <div className="pt-6">
        <button
          type="submit"
          disabled={!isFormValid() || isLoading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Calculating Emissions...
            </div>
          ) : (
            'Calculate CO₂ Emissions'
          )}
        </button>
      </div>
    </form>
  );
};