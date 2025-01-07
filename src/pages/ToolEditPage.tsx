import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Tool } from "@/types/tools";

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
      setEmbeddedCode(data.embedded_code || "");
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