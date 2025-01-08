import { lazy } from 'react';

const toolComponents = {
  'snow-day-calculator': lazy(() => import('./SnowDayCalculator')),
  'length-converter': lazy(() => import('./LengthConverter')),
} as const;

export type ToolSlug = keyof typeof toolComponents;

export const getToolComponent = (slug: string) => {
  if (!slug) return null;
  return toolComponents[slug as ToolSlug] || null;
};