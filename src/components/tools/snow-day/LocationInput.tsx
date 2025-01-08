import { Input } from "@/components/ui/input";

interface LocationInputProps {
  location: string;
  onChange: (value: string) => void;
}

export function LocationInput({ location, onChange }: LocationInputProps) {
  return (
    <Input
      type="text"
      placeholder="Enter your location (e.g., New York, London)"
      value={location}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
    />
  );
}