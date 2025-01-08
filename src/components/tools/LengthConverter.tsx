import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LengthConverterProps {
  isPublic?: boolean;
}

export default function LengthConverter({ isPublic = false }: LengthConverterProps) {
  const [value, setValue] = useState("");
  
  return (
    <div className="p-4">
      <h1>Length Converter</h1>
      <Input 
        type="number" 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter length"
      />
      <Button className="mt-2">Convert</Button>
    </div>
  );
}