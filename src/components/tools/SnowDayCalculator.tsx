import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Snowflake, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function SnowDayCalculator() {
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [snowDays, setSnowDays] = useState("");
  const { toast } = useToast();

  const calculateSnowDayChance = async () => {
    if (!location) {
      setPrediction("Please enter a location");
      return;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('get-weather-data', {
        body: { location }
      });

      if (error) throw error;

      setSnowDays(data.snowDays.toString());
      setPrediction(
        `Based on current weather conditions in ${data.location}, ${data.country}, there is a ${data.probability}% chance of snow in the next few days.`
      );
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to get weather data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[400px] p-8 bg-gradient-to-br from-[#2e3748] to-[#161b26] rounded-xl">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto bg-[#ff7171] rounded-full flex items-center justify-center">
            <Snowflake className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Snow Day Predictor
          </h1>
          <p className="text-gray-300 max-w-lg mx-auto">
            Enter your location to calculate your chance of having snow days using real-time weather data
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter Location (e.g., London, UK)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 pr-10"
            />
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="mt-4">
            <Input
              type="text"
              placeholder="Predicted Snow Days"
              value={snowDays}
              readOnly
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
            />
          </div>

          <Button 
            onClick={calculateSnowDayChance}
            disabled={isLoading}
            className="mt-6 w-full md:w-auto bg-[#ff7171] hover:bg-[#ff5f5f] text-white font-semibold px-8"
          >
            {isLoading ? "Calculating..." : "Predict"}
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