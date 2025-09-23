import React, { useState, useEffect } from 'react';
import { Zap, Flame, Droplets, DollarSign, Calculator } from 'lucide-react';
import type { UtilityUsage } from '../../types';
import { estimateUsageFromCost } from '../../utils/calculations';

/**
 * Props for the UsageInputForm component
 */
interface UsageInputFormProps {
  onSubmit: (usage: UtilityUsage) => void; // Callback function when form is submitted
  isLoading?: boolean;                     // Loading state for submit button
  state?: string;                          // User's state for cost estimation
}

/**
 * Internal form data structure for managing user input
 * Tracks both direct usage entry and cost-based estimation for each utility
 */
interface FormData {
  electricity: {
    usage: string;        // Direct usage input (kWh)
    cost: string;         // Monthly bill amount
    useEstimate: boolean; // Whether to estimate usage from cost
  };
  naturalGas: {
    usage: string;                      // Direct usage input
    cost: string;                       // Monthly bill amount
    unit: 'therms' | 'ccf' | 'mcf';    // Unit of measurement
    useEstimate: boolean;               // Whether to estimate usage from cost
  };
  water: {
    usage: string;                       // Direct usage input
    cost: string;                        // Monthly bill amount
    unit: 'gallons' | 'cubic_feet';     // Unit of measurement
    useEstimate: boolean;                // Whether to estimate usage from cost
  };
}

/**
 * UsageInputForm component provides an interface for users to input utility usage data
 * Supports both direct usage entry and cost-based usage estimation
 * Handles electricity (kWh), natural gas (therms/ccf/mcf), and water (gallons/cubic feet)
 *
 * @param onSubmit - Callback function called when form is successfully submitted
 * @param isLoading - Whether the form is in a loading state (disables submit)
 * @param state - User's state for accurate cost-to-usage estimation
 * @returns JSX element containing the complete usage input form
 */
export const UsageInputForm: React.FC<UsageInputFormProps> = ({
  onSubmit,
  isLoading = false,
  state
}) => {
  // Initialize form data with empty values and default units
  const [formData, setFormData] = useState<FormData>({
    electricity: { usage: '', cost: '', useEstimate: false },
    naturalGas: { usage: '', cost: '', unit: 'therms', useEstimate: false },
    water: { usage: '', cost: '', unit: 'gallons', useEstimate: false }
  });

  // Store estimated usage values calculated from bill costs
  const [estimatedUsage, setEstimatedUsage] = useState<Partial<Record<keyof FormData, number>>>({});

  /**
   * Effect to calculate estimated usage values when cost estimation is enabled
   * Runs whenever form data or state changes to keep estimates current
   */
  useEffect(() => {
    const newEstimatedUsage: Partial<Record<keyof FormData, number>> = {};

    // Calculate electricity usage estimate from bill cost
    if (formData.electricity.useEstimate && formData.electricity.cost) {
      const cost = parseFloat(formData.electricity.cost);
      if (!isNaN(cost)) {
        newEstimatedUsage.electricity = estimateUsageFromCost(cost, 'electricity', state);
      }
    }

    // Calculate natural gas usage estimate from bill cost
    if (formData.naturalGas.useEstimate && formData.naturalGas.cost) {
      const cost = parseFloat(formData.naturalGas.cost);
      if (!isNaN(cost)) {
        newEstimatedUsage.naturalGas = estimateUsageFromCost(cost, 'naturalGas', state);
      }
    }

    // Calculate water usage estimate from bill cost
    if (formData.water.useEstimate && formData.water.cost) {
      const cost = parseFloat(formData.water.cost);
      if (!isNaN(cost)) {
        newEstimatedUsage.water = estimateUsageFromCost(cost, 'water', state);
      }
    }

    setEstimatedUsage(newEstimatedUsage);
  }, [formData, state]);

  /**
   * Updates a specific field for a given utility in the form data
   * Maintains immutability by creating new objects rather than mutating existing ones
   *
   * @param utility - The utility type (electricity, naturalGas, water)
   * @param field - The field to update (usage, cost, unit, useEstimate)
   * @param value - The new value for the field
   */
  const updateFormData = (utility: keyof FormData, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [utility]: {
        ...prev[utility],
        [field]: value
      }
    }));
  };

  /**
   * Handles form submission by converting form data to UtilityUsage format
   * Uses estimated values when estimation is enabled, otherwise uses direct input
   * Ensures all numeric values default to 0 if parsing fails
   *
   * @param e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build usage object with either estimated or directly entered values
    const usage: UtilityUsage = {
      electricity: {
        usage: formData.electricity.useEstimate
          ? estimatedUsage.electricity || 0
          : parseFloat(formData.electricity.usage) || 0,
        cost: parseFloat(formData.electricity.cost) || 0,
        unit: 'kWh' // Electricity is always measured in kWh
      },
      naturalGas: {
        usage: formData.naturalGas.useEstimate
          ? estimatedUsage.naturalGas || 0
          : parseFloat(formData.naturalGas.usage) || 0,
        cost: parseFloat(formData.naturalGas.cost) || 0,
        unit: formData.naturalGas.unit // User-selected unit (therms/ccf/mcf)
      },
      water: {
        usage: formData.water.useEstimate
          ? estimatedUsage.water || 0
          : parseFloat(formData.water.usage) || 0,
        cost: parseFloat(formData.water.cost) || 0,
        unit: formData.water.unit // User-selected unit (gallons/cubic_feet)
      }
    };

    onSubmit(usage);
  };

  /**
   * Validates that all required form fields have values
   * For each utility, either direct usage OR (cost estimation enabled AND cost value) is required
   *
   * @returns true if form is valid and ready for submission
   */
  const isFormValid = () => {
    return (
      (formData.electricity.usage || (formData.electricity.useEstimate && formData.electricity.cost)) &&
      (formData.naturalGas.usage || (formData.naturalGas.useEstimate && formData.naturalGas.cost)) &&
      (formData.water.usage || (formData.water.useEstimate && formData.water.cost))
    );
  };

  /**
   * Reusable component for rendering utility input sections (electricity, gas, water)
   * Handles both direct usage input and cost-based estimation modes
   *
   * @param title - Display title for the utility section
   * @param icon - Icon component to display
   * @param color - Tailwind color class for the icon background
   * @param utility - Which utility this section represents
   * @param usageLabel - Label for the usage input field
   * @param usageUnit - Fixed unit label (for electricity)
   * @param unitOptions - Dropdown options for unit selection (gas/water)
   * @returns JSX element containing the complete utility input section
   */
  const UtilitySection = ({
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
      {/* Section header with icon and title */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="space-y-4">
        {/* Monthly bill cost input - always shown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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

        {/* Toggle for cost-based usage estimation */}
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id={`estimate-${utility}`}
            checked={formData[utility].useEstimate}
            onChange={(e) => updateFormData(utility, 'useEstimate', e.target.checked)}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
          />
          <label htmlFor={`estimate-${utility}`} className="text-sm text-gray-700 flex items-center gap-1">
            <Calculator className="w-4 h-4" />
            Estimate usage from bill amount
          </label>
        </div>

        {/* Conditional rendering: show estimate or direct input based on toggle */}
        {formData[utility].useEstimate ? (
          // Display calculated usage estimate
          <div className="p-3 bg-primary-50 rounded-lg">
            <p className="text-sm text-primary-700">
              Estimated usage: <span className="font-semibold">
                {estimatedUsage[utility]?.toLocaleString() || 0} {usageUnit || ('unit' in formData[utility] ? (formData[utility] as any).unit : '')}
              </span>
            </p>
          </div>
        ) : (
          // Show direct usage input fields
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              {/* Unit selector dropdown for utilities with multiple units */}
              {unitOptions && (
                <select
                  value={'unit' in formData[utility] ? (formData[utility] as any).unit : ''}
                  onChange={(e) => updateFormData(utility, 'unit', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {unitOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              {/* Fixed unit display for utilities with single unit */}
              {!unitOptions && usageUnit && (
                <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                  {usageUnit}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Form header with instructions */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Your Usage Data</h2>
        <p className="text-gray-600">Provide your monthly utility usage or let us estimate from your bills</p>
      </div>

      {/* Electricity section - uses fixed kWh unit */}
      <UtilitySection
        title="Electricity"
        icon={Zap}
        color="bg-yellow-500"
        utility="electricity"
        usageLabel="Usage (kWh)"
        usageUnit="kWh"
      />

      {/* Natural gas section - offers multiple unit options */}
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

      {/* Water section - offers gallons or cubic feet */}
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

      {/* Submit button with loading state and validation */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={!isFormValid() || isLoading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              {/* Loading spinner */}
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