import { useState } from "react";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ToolPublishControlProps {
  tool: Tool;
  onUpdate: () => void;
}

export function ToolPublishControl({ tool, onUpdate }: ToolPublishControlProps) {
  const { toast } = useToast();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      console.log("Publishing tool:", tool.id, "Current published state:", tool.published);
      
      const { data, error } = await supabase
        .from("tools")
        .update({
          published: !tool.published,
          published_at: !tool.published ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", tool.id)
        .select();

      if (error) throw error;

      console.log("Publish response:", data);

      toast({
        title: "Success",
        description: tool.published 
          ? "Tool unpublished successfully"
          : "Tool published successfully! It's now live at /tools/" + tool.slug,
      });
      
      onUpdate();
    } catch (error: any) {
      console.error("Publish error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to publish tool",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Button 
      onClick={handlePublish} 
      disabled={isPublishing}
      variant={tool.published ? "destructive" : "default"}
    >
      {isPublishing ? "Processing..." : tool.published ? "Unpublish" : "Publish"}
    </Button>
  );
}