import SnowDayCalculator from './SnowDayCalculator';
import LengthConverter from './LengthConverter';

const toolComponents = {
  'snow-day-calculator': SnowDayCalculator,
  'length-converter': LengthConverter,
} as const;

export type ToolSlug = keyof typeof toolComponents;

export const getToolComponent = (slug: string) => {
  console.log("[Registry] Getting tool component for slug:", slug);
  console.log("[Registry] Available tools:", Object.keys(toolComponents));
  
  if (!slug) {
    console.error("[Registry] No slug provided to getToolComponent");
    return null;
  }
  
  const component = toolComponents[slug as ToolSlug];
  
  if (!component) {
    console.error(`[Registry] No component found for slug: ${slug}. Available components:`, 
      Object.keys(toolComponents).join(', '));
    return null;
  }
  
  console.log("[Registry] Successfully found component for slug:", slug);
  return component;
};