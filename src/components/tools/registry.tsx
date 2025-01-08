import SnowDayCalculator from './SnowDayCalculator';
import LengthConverter from './LengthConverter';

const toolComponents = {
  'snow-day-calculator': SnowDayCalculator,
  'length-converter': LengthConverter,
} as const;

export const getToolComponent = (slug: string) => {
  console.log("Getting tool component for slug:", slug);
  console.log("Available tools:", Object.keys(toolComponents));
  
  if (!slug) {
    console.error("No slug provided to getToolComponent");
    return null;
  }
  
  const component = toolComponents[slug as keyof typeof toolComponents];
  console.log("Found component:", component ? "Yes" : "No");
  
  if (!component) {
    console.error(`No component found for slug: ${slug}`);
  }
  
  return component;
};