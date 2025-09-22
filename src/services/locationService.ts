// Import TypeScript type definitions for location data structure
import type { LocationData } from '../types';
// Import utility function to get emission factors for different utility types
import { getEmissionFactor } from '../utils/emissionFactors';

// Mapping of ZIP code prefixes to US state abbreviations
// This is a simplified lookup table for demonstration purposes
// In a real application, you'd use a comprehensive ZIP code database or API
const ZIP_CODE_TO_STATE: Record<string, string> = {
  // California ZIP codes (90000-96999)
  '90': 'CA', '91': 'CA', '92': 'CA', '93': 'CA', '94': 'CA', '95': 'CA', '96': 'CA',

  // New York ZIP codes (10000-14999) - using 3-digit prefixes for more accuracy
  '100': 'NY', '101': 'NY', '102': 'NY', '103': 'NY', '104': 'NY', '105': 'NY',
  '110': 'NY', '111': 'NY', '112': 'NY', '113': 'NY', '114': 'NY', '116': 'NY',
  '117': 'NY', '118': 'NY', '119': 'NY', '120': 'NY', '121': 'NY', '122': 'NY',
  '123': 'NY', '124': 'NY', '125': 'NY', '126': 'NY', '127': 'NY', '128': 'NY',
  '129': 'NY', '130': 'NY', '131': 'NY', '132': 'NY', '133': 'NY', '134': 'NY',
  '135': 'NY', '136': 'NY', '137': 'NY', '138': 'NY', '139': 'NY', '140': 'NY',
  '141': 'NY', '142': 'NY', '143': 'NY', '144': 'NY', '145': 'NY', '146': 'NY',
  '147': 'NY', '148': 'NY', '149': 'NY',

  // Texas ZIP codes (77000-79999)
  '770': 'TX', '771': 'TX', '772': 'TX', '773': 'TX', '774': 'TX', '775': 'TX',
  '776': 'TX', '777': 'TX', '778': 'TX', '779': 'TX', '780': 'TX', '781': 'TX',
  '782': 'TX', '783': 'TX', '784': 'TX', '785': 'TX', '786': 'TX', '787': 'TX',
  '788': 'TX', '789': 'TX', '790': 'TX', '791': 'TX', '792': 'TX', '793': 'TX',
  '794': 'TX', '795': 'TX', '796': 'TX', '797': 'TX', '798': 'TX', '799': 'TX',

  // Florida ZIP codes (32000-34999)
  '320': 'FL', '321': 'FL', '322': 'FL', '323': 'FL', '324': 'FL', '325': 'FL',
  '326': 'FL', '327': 'FL', '328': 'FL', '329': 'FL', '330': 'FL', '331': 'FL',
  '332': 'FL', '333': 'FL', '334': 'FL', '335': 'FL', '336': 'FL', '337': 'FL',
  '338': 'FL', '339': 'FL', '340': 'FL', '341': 'FL', '342': 'FL', '343': 'FL',
  '344': 'FL', '345': 'FL', '346': 'FL', '347': 'FL',
};

// Helper function to determine the state from a ZIP code
// This function tries to match ZIP codes with increasing specificity
function getStateFromZipCode(zipCode: string): string {
  // Get the first 2 digits of the ZIP code (e.g., "90" from "90210")
  const zipPrefix = zipCode.substring(0, 2);
  // Get the first 3 digits of the ZIP code (e.g., "902" from "90210")
  const zipPrefix3 = zipCode.substring(0, 3);

  // Try to find a match with 3-digit prefix first (more specific)
  // Then try 2-digit prefix, and finally default to 'US' if no match found
  return ZIP_CODE_TO_STATE[zipPrefix3] || ZIP_CODE_TO_STATE[zipPrefix] || 'US';
}

// Main function to get location data and emission factors for a given ZIP code
// This is marked as async to simulate an API call (in real apps this would fetch from a database)
export async function getLocationData(zipCode: string): Promise<LocationData> {
  try {
    // Determine which state this ZIP code belongs to
    const state = getStateFromZipCode(zipCode);

    // Create a location data object with the ZIP code, state, and emission factors
    const locationData: LocationData = {
      zipCode,                                                          // Store the original ZIP code
      state,                                                           // Store the determined state
      electricityEmissionFactor: getEmissionFactor('electricity', state),  // Get CO2 per kWh for this state's electricity grid
      naturalGasEmissionFactor: getEmissionFactor('naturalGas', 'therms'),  // Get CO2 per therm of natural gas (same nationwide)
      waterEmissionFactor: getEmissionFactor('water', 'gallons'),          // Get CO2 per gallon of water (processing/delivery emissions)
    };

    // Return the complete location data
    return locationData;
  } catch (error) {
    // If anything goes wrong, throw a user-friendly error message
    throw new Error('Unable to fetch location data. Please check your zip code.');
  }
}

// Function to validate whether a string is a properly formatted ZIP code
export function isValidZipCode(zipCode: string): boolean {
  // Regular expression that matches:
  // ^ - start of string
  // \d{5} - exactly 5 digits
  // (-\d{4})? - optionally followed by a dash and 4 more digits (ZIP+4 format)
  // $ - end of string
  const zipRegex = /^\d{5}(-\d{4})?$/;

  // Test the input against the regex pattern and return true/false
  return zipRegex.test(zipCode);
}