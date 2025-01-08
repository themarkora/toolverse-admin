import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Snowflake } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LocationInput } from "./snow-day/LocationInput";
import { SnowDaysInput } from "./snow-day/SnowDaysInput";
import { PredictionResult } from "./snow-day/PredictionResult";
import { Helmet } from "react-helmet";

interface SnowDayCalculatorProps {
  isPublic?: boolean;
}

export default function SnowDayCalculator({ isPublic = false }: SnowDayCalculatorProps) {
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [snowDays, setSnowDays] = useState("");
  const [toolMetadata, setToolMetadata] = useState<{ name: string; description: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchToolMetadata = async () => {
      try {
        const { data, error } = await supabase
          .from("tools")
          .select("name, description")
          .eq("slug", "snow-day-calculator")
          .eq("published", true)
          .single();

        if (error) {
          console.error("Error fetching tool metadata:", error);
          return;
        }

        if (!data && isPublic) {
          window.location.href = "/404";
          return;
        }

        setToolMetadata(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchToolMetadata();
  }, [isPublic]);

  const calculateSnowDayChance = async () => {
    if (!location) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a location",
      });
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

  if (!toolMetadata) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading tool...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{toolMetadata.name} | WebToolverse</title>
        <meta name="description" content={toolMetadata.description} />
        <meta property="og:title" content={`${toolMetadata.name} | WebToolverse`} />
        <meta property="og:description" content={toolMetadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://webtoolverse.com/tools/snow-day-calculator`} />
      </Helmet>
      
      <div className={`${isPublic ? 'min-h-screen' : 'min-h-[400px]'} p-8 bg-gradient-to-br from-[#2e3748] to-[#161b26] rounded-xl`}>
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="w-24 h-24 mx-auto bg-[#ff7171] rounded-full flex items-center justify-center">
              <Snowflake className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              {toolMetadata.name}
            </h1>
            <p className="text-gray-300 max-w-lg mx-auto">
              {toolMetadata.description}
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
    </>
  );
}