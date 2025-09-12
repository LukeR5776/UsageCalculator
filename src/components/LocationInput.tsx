import React, { useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { isValidZipCode } from '../services/locationService';

interface LocationInputProps {
  onLocationSubmit: (zipCode: string) => void;
  isLoading?: boolean;
  error?: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  onLocationSubmit,
  isLoading = false,
  error
}) => {
  const [zipCode, setZipCode] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!zipCode.trim()) {
      setValidationError('Please enter a zip code');
      return;
    }

    if (!isValidZipCode(zipCode)) {
      setValidationError('Please enter a valid 5-digit zip code');
      return;
    }

    onLocationSubmit(zipCode);
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setZipCode(value);
    if (validationError) setValidationError('');
  };

  return (
    <div className="card max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-100 rounded-lg">
          <MapPin className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Your Location</h2>
          <p className="text-gray-600">Enter your zip code to get started</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
            Zip Code
          </label>
          <input
            id="zipCode"
            type="text"
            value={zipCode}
            onChange={handleZipCodeChange}
            placeholder="12345"
            className={`input-field ${(validationError || error) ? 'border-red-300 focus:ring-red-500' : ''}`}
            disabled={isLoading}
          />
          {(validationError || error) && (
            <div className="flex items-center gap-2 mt-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{validationError || error}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !zipCode}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Getting Location...
            </div>
          ) : (
            'Continue'
          )}
        </button>
      </form>
    </div>
  );
};