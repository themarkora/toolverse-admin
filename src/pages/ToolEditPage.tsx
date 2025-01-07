import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Tool } from "@/types/tools";

const defaultEmbeddedCode = `
import { useState, useEffect } from "react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const conversionRates = {
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
  const [fromUnit, setFromUnit] = useState<string>("meters");
  const [toUnit, setToUnit] = useState<string>("kilometers");
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

  const units = ["meters", "kilometers", "miles", "feet", "inches"];

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
            <Select
              value={fromUnit}
              onValueChange={setFromUnit}
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <Select
              value={toUnit}
              onValueChange={setToUnit}
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </option>
              ))}
            </Select>
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
}`;

export default function ToolEditPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tool, setTool] = useState<Tool | null>(null);
  const [embeddedCode, setEmbeddedCode] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTool = async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch tool details",
        });
        navigate("/admin");
        return;
      }

      setTool(data);
      setEmbeddedCode(data.embedded_code || defaultEmbeddedCode);
    };

    fetchTool();
  }, [slug, navigate, toast]);

  const handleSave = async () => {
    if (!tool) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("tools")
        .update({ embedded_code: embeddedCode })
        .eq("id", tool.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tool code updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update tool code",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!tool) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{tool.name}</h1>
          <p className="text-muted-foreground">Edit tool embedded code</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin")}>
          Back to Admin
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Tool URL</h2>
          <p className="text-muted-foreground">
            {window.location.origin}/{tool.slug}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Embedded Code</h2>
          <Textarea
            value={embeddedCode}
            onChange={(e) => setEmbeddedCode(e.target.value)}
            className="min-h-[400px] font-mono"
            placeholder="Enter the tool's embedded code here..."
          />
        </div>

        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full md:w-auto"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}