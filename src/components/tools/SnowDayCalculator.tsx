import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Snowflake } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LocationInput } from "./snow-day/LocationInput";
import { SnowDaysInput } from "./snow-day/SnowDaysInput";
import { PredictionResult } from "./snow-day/PredictionResult";

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

      // Log the raw weather data for verification
      console.log('Raw Weather Data:', data);
      console.log('Current Temperature:', data.current_temp);
      console.log('Current Precipitation:', data.current_precip);
      console.log('3-Day Forecast:', data.forecast);

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

        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-6">
          <LocationInput location={location} onChange={setLocation} />

          <div className="mt-4">
            <SnowDaysInput snowDays={snowDays} />
          </div>

          <Button 
            onClick={calculateSnowDayChance}
            disabled={isLoading}
            className="mt-6 w-full md:w-auto bg-[#ff7171] hover:bg-[#ff5f5f] text-white font-semibold px-8"
          >
            {isLoading ? "Calculating..." : "Predict"}
          </Button>
        </Card>

        <PredictionResult prediction={prediction} />
      </div>
    </div>
  );
}