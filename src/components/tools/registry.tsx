import { lazy } from 'react';

const toolComponents = {
  'length-converter': lazy(() => import('./LengthConverter')),
  'snow-day-calculator': lazy(() => import('./SnowDayCalculator')),
} as const;

export type ToolSlug = keyof typeof toolComponents;

export const getToolComponent = (slug: string) => {
  return toolComponents[slug as ToolSlug] || null;
};