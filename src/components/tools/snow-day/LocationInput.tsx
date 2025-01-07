import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

interface LocationInputProps {
  location: string;
  onChange: (value: string) => void;
}

export function LocationInput({ location, onChange }: LocationInputProps) {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Enter Location (e.g., London, UK)"
        value={location}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 pr-10"
      />
      <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
    </div>
  );
}