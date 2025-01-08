import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Tool } from "@/types/tools";
import { ToolPreview } from "@/components/admin/ToolPreview";
import { ToolMetadata } from "@/components/admin/ToolMetadata";

// Get the current domain based on environment
const PRODUCTION_DOMAIN = "https://webtoolverse.com";
const isDevelopment = process.env.NODE_ENV === "development";

export default function ToolEditPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tool, setTool] = useState<Tool | null>(null);

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
    };

    fetchTool();
  }, [slug, navigate, toast]);

  const getToolUrl = (slug: string) => {
    if (isDevelopment) {
      // In development, use relative path
      return `/tools/${slug}`;
    }
    // In production, use the full domain
    return `${PRODUCTION_DOMAIN}/tools/${slug}`;
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
          <p className="text-muted-foreground">Edit tool configuration</p>
        </div>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => navigate("/admin")}>
            Back to Admin
          </Button>
          <Button 
            variant="default" 
            onClick={() => window.open(getToolUrl(tool.slug), '_blank')}
          >
            View Live Tool
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <ToolMetadata tool={tool} onUpdate={() => window.location.reload()} />
        <ToolPreview slug={tool.slug} />
      </div>
    </div>
  );
}