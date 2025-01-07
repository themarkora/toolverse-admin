import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";

export default function SnowDayCalculator() {
  const [zipCode, setZipCode] = useState("");
  const [snowDays, setSnowDays] = useState("");
  const [prediction, setPrediction] = useState<string | null>(null);

  const calculateSnowDayChance = () => {
    if (!zipCode) {
      setPrediction("Please enter a valid zip code");
      return;
    }

    // Simple mock prediction for demo purposes
    const randomChance = Math.floor(Math.random() * 100);
    setPrediction(`Based on historical data and current conditions, there is a ${randomChance}% chance of snow days in your area.`);
    setSnowDays(Math.floor(Math.random() * 10).toString());
  };

  return (
    <div className="min-h-[400px] p-8 bg-gradient-to-br from-[#2e3748] to-[#161b26] rounded-xl">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto bg-[#ff7171] rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 3v18M8 6l4-3 4 3M8 18l4 3 4-3M3 12h18M6 8l-3 4 3 4M18 8l3 4-3 4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Snow Day Predictor
          </h1>
          <p className="text-gray-300 max-w-lg mx-auto">
            Use your zipcode to automatically calculate your chance of having snow days using AI & Machine Learning
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 pr-10"
              />
              <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Snow Days This Year"
                value={snowDays}
                readOnly
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <Button 
            onClick={calculateSnowDayChance}
            className="mt-6 w-full md:w-auto bg-[#ff7171] hover:bg-[#ff5f5f] text-white font-semibold px-8"
          >
            Predict
          </Button>
        </Card>

        {/* Prediction Result */}
        {prediction && (
          <div className="animate-fadeIn">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4">
              <p className="text-white text-center">{prediction}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}