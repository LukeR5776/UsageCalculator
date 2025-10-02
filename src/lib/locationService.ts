import type { LocationData } from './types';
import { getEmissionFactor } from './emissionFactors';

const ZIP_CODE_TO_STATE: Record<string, string> = {
  '90': 'CA', '91': 'CA', '92': 'CA', '93': 'CA', '94': 'CA', '95': 'CA', '96': 'CA',
  '100': 'NY', '101': 'NY', '102': 'NY', '103': 'NY', '104': 'NY', '105': 'NY',
  '110': 'NY', '111': 'NY', '112': 'NY', '113': 'NY', '114': 'NY', '116': 'NY',
  '117': 'NY', '118': 'NY', '119': 'NY', '120': 'NY', '121': 'NY', '122': 'NY',
  '123': 'NY', '124': 'NY', '125': 'NY', '126': 'NY', '127': 'NY', '128': 'NY',
  '129': 'NY', '130': 'NY', '131': 'NY', '132': 'NY', '133': 'NY', '134': 'NY',
  '135': 'NY', '136': 'NY', '137': 'NY', '138': 'NY', '139': 'NY', '140': 'NY',
  '141': 'NY', '142': 'NY', '143': 'NY', '144': 'NY', '145': 'NY', '146': 'NY',
  '147': 'NY', '148': 'NY', '149': 'NY',
  '770': 'TX', '771': 'TX', '772': 'TX', '773': 'TX', '774': 'TX', '775': 'TX',
  '776': 'TX', '777': 'TX', '778': 'TX', '779': 'TX', '780': 'TX', '781': 'TX',
  '782': 'TX', '783': 'TX', '784': 'TX', '785': 'TX', '786': 'TX', '787': 'TX',
  '788': 'TX', '789': 'TX', '790': 'TX', '791': 'TX', '792': 'TX', '793': 'TX',
  '794': 'TX', '795': 'TX', '796': 'TX', '797': 'TX', '798': 'TX', '799': 'TX',
  '320': 'FL', '321': 'FL', '322': 'FL', '323': 'FL', '324': 'FL', '325': 'FL',
  '326': 'FL', '327': 'FL', '328': 'FL', '329': 'FL', '330': 'FL', '331': 'FL',
  '332': 'FL', '333': 'FL', '334': 'FL', '335': 'FL', '336': 'FL', '337': 'FL',
  '338': 'FL', '339': 'FL', '340': 'FL', '341': 'FL', '342': 'FL', '343': 'FL',
  '344': 'FL', '345': 'FL', '346': 'FL', '347': 'FL',
};

function getStateFromZipCode(zipCode: string): string {
  const zipPrefix = zipCode.substring(0, 2);
  const zipPrefix3 = zipCode.substring(0, 3);
  
  return ZIP_CODE_TO_STATE[zipPrefix3] || ZIP_CODE_TO_STATE[zipPrefix] || 'US';
}

export async function getLocationData(zipCode: string): Promise<LocationData> {
  try {
    const state = getStateFromZipCode(zipCode);
    
    const locationData: LocationData = {
      zipCode,
      state,
      electricityEmissionFactor: getEmissionFactor('electricity', state),
      naturalGasEmissionFactor: getEmissionFactor('naturalGas', 'therms'),
      waterEmissionFactor: getEmissionFactor('water', 'gallons'),
    };
    
    return locationData;
  } catch {
    throw new Error('Unable to fetch location data. Please check your zip code.');
  }
}

export function isValidZipCode(zipCode: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
}