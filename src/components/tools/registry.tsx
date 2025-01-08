import SnowDayCalculator from './SnowDayCalculator';
import LengthConverter from './LengthConverter';

const toolComponents = {
  'snow-day-calculator': SnowDayCalculator,
  'length-converter': LengthConverter,
} as const;

export type ToolSlug = keyof typeof toolComponents;

export const getToolComponent = (slug: string) => {
  if (!slug) return null;
  return toolComponents[slug as ToolSlug] || null;
};

export const getPublicToolPath = (slug: string) => {
  return `/tools/${slug}`;
};