import { useMemo, useState, useEffect } from 'react';
import type { UtilityUsage, EmissionResults, LocationData } from '../types';
import { calculateEmissions } from '../utils/calculations';

export const usePerformantCalculation = (
  usage: UtilityUsage | null,
  location: LocationData | null
): EmissionResults | null => {
  return useMemo(() => {
    if (!usage || !location) return null;
    return calculateEmissions(usage, location);
  }, [usage, location]);
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};