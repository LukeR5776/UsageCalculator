// Import React and the useState hook for managing component state
import React, { useState } from 'react';
// Import icon components for the map pin and error alert icons
import { MapPin, AlertCircle } from 'lucide-react';
// Import utility function to validate ZIP codes
import { isValidZipCode } from '../services/locationService';

// TypeScript interface defining what props this component expects
interface LocationInputProps {
  onLocationSubmit: (zipCode: string) => void;  // Function to call when user submits a valid ZIP code
  isLoading?: boolean;                          // Whether to show loading state (optional)
  error?: string;                               // Error message to display (optional)
}

// LocationInput component: Handles ZIP code input and validation
export const LocationInput: React.FC<LocationInputProps> = ({
  onLocationSubmit,     // Function to call when form is submitted with valid ZIP code
  isLoading = false,    // Whether the app is currently fetching location data
  error                 // Any error message from the parent component (e.g., "Invalid ZIP code")
}) => {
  // Component state: Store the ZIP code the user is typing
  const [zipCode, setZipCode] = useState('');
  // Component state: Store any client-side validation errors
  const [validationError, setValidationError] = useState('');

  // Function that runs when the user submits the form (clicks Continue button)
  const handleSubmit = (e: React.FormEvent) => {
    // Prevent the default form submission behavior (which would refresh the page)
    e.preventDefault();
    // Clear any previous validation errors
    setValidationError('');

    // Check if the user entered anything
    if (!zipCode.trim()) {
      setValidationError('Please enter a zip code');
      return;
    }

    // Validate the ZIP code format using our utility function
    if (!isValidZipCode(zipCode)) {
      setValidationError('Please enter a valid 5-digit zip code');
      return;
    }

    // If validation passes, call the parent component's function with the ZIP code
    onLocationSubmit(zipCode);
  };

  // Function that runs every time the user types in the ZIP code input field
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clean the input: remove any non-digits and limit to 5 characters
    // \D matches any non-digit character, so replace(/\D/g, '') removes everything except numbers
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    // Update the ZIP code state with the cleaned value
    setZipCode(value);
    // If there was a validation error, clear it as soon as the user starts typing
    if (validationError) setValidationError('');
  };

  // Return the JSX that defines what this component looks like
  return (
    <div className="card max-w-md mx-auto">

      {/* Header section with icon and title */}
      <div className="flex items-center gap-3 mb-6">
        {/* Icon container with light green background */}
        <div className="p-2 bg-primary-100 rounded-lg">
          {/* Map pin icon to represent location */}
          <MapPin className="w-6 h-6 text-primary-600" />
        </div>
        {/* Title and instructions text */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Your Location</h2>
          <p className="text-gray-600">Enter your zip code to get started</p>
        </div>
      </div>

      {/* Form that handles the ZIP code submission */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          {/* Label for the ZIP code input field */}
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
            Zip Code
          </label>

          {/* Text input field for ZIP code */}
          <input
            id="zipCode"                                    // Links to the label above
            type="text"                                     // Text input (not number to allow leading zeros)
            value={zipCode}                                 // Current value from component state
            onChange={handleZipCodeChange}                  // Function to call when user types
            placeholder="12345"                             // Example text shown when empty
            className={`input-field ${(validationError || error) ? 'border-red-300 focus:ring-red-500' : ''}`}  // Styling, with red border if there's an error
            disabled={isLoading}                            // Disable input while loading
          />

          {/* Error message display - only show if there's a validation error or server error */}
          {(validationError || error) && (
            <div className="flex items-center gap-2 mt-2 text-red-600">
              {/* Alert icon to draw attention to the error */}
              <AlertCircle className="w-4 h-4" />
              {/* Error text - show validation error first, then server error */}
              <span className="text-sm">{validationError || error}</span>
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"                                       // Makes this the submit button for the form
          disabled={isLoading || !zipCode}                   // Disable if loading or no ZIP code entered
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"  // Full width with disabled styling
        >
          {/* Conditional button content - show loading state or normal state */}
          {isLoading ? (
            // Loading state: spinner animation with text
            <div className="flex items-center justify-center gap-2">
              {/* Spinning circle animation */}
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Getting Location...
            </div>
          ) : (
            // Normal state: just the button text
            'Continue'
          )}
        </button>
      </form>
    </div>
  );
};