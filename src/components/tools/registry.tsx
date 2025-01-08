import SnowDayCalculator from './SnowDayCalculator';
import LengthConverter from './LengthConverter';

const toolComponents = {
  'snow-day-calculator': SnowDayCalculator,
  'length-converter': LengthConverter,
} as const;

export const getToolComponent = (slug: string) => {
  console.log("Getting tool component for slug:", slug);
  console.log("Available tools:", Object.keys(toolComponents));
  
  const component = toolComponents[slug as keyof typeof toolComponents];
  console.log("Found component:", component ? "Yes" : "No");
  
  return component;
};