export const conversionRates: { [key: string]: { [key: string]: number } } = {
  meters: {
    meters: 1,
    kilometers: 0.001,
    miles: 0.000621371,
    feet: 3.28084,
    inches: 39.3701,
  },
  kilometers: {
    meters: 1000,
    kilometers: 1,
    miles: 0.621371,
    feet: 3280.84,
    inches: 39370.1,
  },
  miles: {
    meters: 1609.34,
    kilometers: 1.60934,
    miles: 1,
    feet: 5280,
    inches: 63360,
  },
  feet: {
    meters: 0.3048,
    kilometers: 0.0003048,
    miles: 0.000189394,
    feet: 1,
    inches: 12,
  },
  inches: {
    meters: 0.0254,
    kilometers: 0.0000254,
    miles: 0.0000157828,
    feet: 0.0833333,
    inches: 1,
  },
};

export const convertLength = (value: number, fromUnit: string, toUnit: string): number => {
  if (!conversionRates[fromUnit] || !conversionRates[fromUnit][toUnit]) {
    throw new Error(`Invalid conversion units: ${fromUnit} to ${toUnit}`);
  }
  return value * conversionRates[fromUnit][toUnit];
};

// Add some utility functions to get available units
export const getAvailableUnits = (): string[] => {
  return Object.keys(conversionRates);
};