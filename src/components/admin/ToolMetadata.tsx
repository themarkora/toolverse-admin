import { useState } from "react";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ToolMetadataProps {
  tool: Tool;
  onUpdate: () => void;
}

export function ToolMetadata({ tool, onUpdate }: ToolMetadataProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("tools")
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq("id", tool.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tool metadata updated successfully",
      });
      
      onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update tool metadata",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Tool Information</h2>
        <p className="text-sm text-gray-500">View and manage tool details</p>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <p className="mt-1">{tool.name}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium">Description</label>
          <p className="mt-1">{tool.description || "No description"}</p>
        </div>

        <div>
          <label className="text-sm font-medium">Slug</label>
          <p className="mt-1">{tool.slug}</p>
        </div>

        <div>
          <label className="text-sm font-medium">Public URL</label>
          <p className="mt-1">
            {window.location.origin}/{tool.slug}
          </p>
        </div>
      </div>

      <Button 
        onClick={handleSave} 
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Update Metadata"}
      </Button>
    </div>
  );
}