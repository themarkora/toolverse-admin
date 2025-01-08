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
  const [isPublishing, setIsPublishing] = useState(false);

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

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      const { error } = await supabase
        .from("tools")
        .update({
          published: !tool.published,
          published_at: !tool.published ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", tool.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: tool.published 
          ? "Tool unpublished successfully"
          : "Tool published successfully! It's now live at /tools/" + tool.slug,
      });
      
      onUpdate();
    } catch (error: any) {
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
            <a 
              href={`/tools/${tool.slug}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              /tools/{tool.slug}
            </a>
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">Status</label>
          <p className="mt-1">
            {tool.published ? (
              <span className="text-green-600">Published</span>
            ) : (
              <span className="text-gray-600">Draft</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          variant="outline"
        >
          {isSaving ? "Saving..." : "Update Metadata"}
        </Button>

        <Button 
          onClick={handlePublish} 
          disabled={isPublishing}
          variant={tool.published ? "destructive" : "default"}
        >
          {isPublishing ? "Processing..." : tool.published ? "Unpublish" : "Publish"}
        </Button>
      </div>
    </div>
  );
}