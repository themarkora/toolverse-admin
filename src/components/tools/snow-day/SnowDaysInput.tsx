import { Input } from "@/components/ui/input";

interface SnowDaysInputProps {
  snowDays: string;
}

export function SnowDaysInput({ snowDays }: SnowDaysInputProps) {
  return (
    <Input
      type="text"
      placeholder="Predicted Snow Days"
      value={snowDays}
      readOnly
      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
    />
  );
}