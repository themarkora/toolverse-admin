import SnowDayCalculator from './SnowDayCalculator';
import LengthConverter from './LengthConverter';

const toolComponents = {
  'snow-day-calculator': SnowDayCalculator,
  'length-converter': LengthConverter,
};

export const getToolComponent = (slug: string) => {
  console.log("Getting tool component for slug:", slug);
  return toolComponents[slug as keyof typeof toolComponents];
};