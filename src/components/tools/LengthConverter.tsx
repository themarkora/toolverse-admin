import { useEffect } from "react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type UnitType = "meters" | "kilometers" | "miles" | "feet" | "inches";

type ConversionRates = {
  [key in UnitType]: {
    [key in UnitType]: number;
  };
};

const conversionRates: ConversionRates = {
  meters: {
    meters: 1,
    kilometers: 0.001,
    miles: 0.000621371,
    feet: 3.28084,
    inches: 39.3701,
  },
  kilometers: {
    meters: 1000,
    kilometers: 1,
    miles: 0.621371,
    feet: 3280.84,
    inches: 39370.1,
  },
  miles: {
    meters: 1609.34,
    kilometers: 1.60934,
    miles: 1,
    feet: 5280,
    inches: 63360,
  },
  feet: {
    meters: 0.3048,
    kilometers: 0.0003048,
    miles: 0.000189394,
    feet: 1,
    inches: 12,
  },
  inches: {
    meters: 0.0254,
    kilometers: 0.0000254,
    miles: 0.0000157828,
    feet: 0.0833333,
    inches: 1,
  },
};

export default function LengthConverter() {
  const [value, setValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<UnitType>("meters");
  const [toUnit, setToUnit] = useState<UnitType>("kilometers");
  const [result, setResult] = useState<number | null>(null);

  // SEO
  useEffect(() => {
    document.title = "Length Converter - Convert between different units of length";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Free online length converter tool. Convert between meters, kilometers, miles, feet, and inches instantly."
      );
    }
  }, []);

  const handleConvert = () => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const converted = numValue * conversionRates[fromUnit][toUnit];
      setResult(converted);
    }
  };

  const units: UnitType[] = ["meters", "kilometers", "miles", "feet", "inches"];

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Length Converter</h1>
        <p className="text-gray-600 mb-6">
          Convert between different units of length instantly
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Value</label>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter value"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">From</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as UnitType)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value as UnitType)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button onClick={handleConvert} className="w-full">
          Convert
        </Button>

        {result !== null && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-center">
              {value} {fromUnit} = {result.toFixed(6)} {toUnit}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}