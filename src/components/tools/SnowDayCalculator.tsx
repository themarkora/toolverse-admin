import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SnowDayCalculator() {
  const [temperature, setTemperature] = useState("");
  const [snowfall, setSnowfall] = useState("");
  const [prediction, setPrediction] = useState<string | null>(null);

  const calculateSnowDayChance = () => {
    const temp = parseFloat(temperature);
    const snow = parseFloat(snowfall);
    
    if (isNaN(temp) || isNaN(snow)) {
      setPrediction("Please enter valid numbers");
      return;
    }

    let chance = 0;
    
    // Basic prediction logic
    if (temp < 32 && snow >= 6) {
      chance = 90;
    } else if (temp < 32 && snow >= 3) {
      chance = 60;
    } else if (temp < 32 && snow > 0) {
      chance = 30;
    } else {
      chance = 10;
    }

    setPrediction(`There is a ${chance}% chance of a snow day!`);
  };

  return (
    <Card className="max-w-md mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Snow Day Calculator</h1>
        <p className="text-gray-600">
          Calculate the chances of a snow day based on temperature and expected snowfall.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Temperature (°F)</label>
          <Input
            type="number"
            placeholder="Enter temperature"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Expected Snowfall (inches)</label>
          <Input
            type="number"
            placeholder="Enter snowfall"
            value={snowfall}
            onChange={(e) => setSnowfall(e.target.value)}
            className="w-full"
          />
        </div>

        <Button 
          onClick={calculateSnowDayChance}
          className="w-full"
        >
          Calculate Chances
        </Button>
      </div>

      {prediction && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <p className="text-center font-medium">{prediction}</p>
        </div>
      )}
    </Card>
  );
}