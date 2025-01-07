import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertLength, getAvailableUnits } from "@/lib/converter";

export default function Index() {
  const [value, setValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<string>("meters");
  const [toUnit, setToUnit] = useState<string>("feet");
  const [result, setResult] = useState<number | null>(null);

  const units = getAvailableUnits();

  const handleConvert = () => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const converted = convertLength(numValue, fromUnit, toUnit);
      setResult(converted);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Length Converter</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Value</label>
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value to convert"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">From</label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleConvert} className="w-full">
            Convert
          </Button>

          {result !== null && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-center">
                {value} {fromUnit} = {result.toFixed(6)} {toUnit}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}