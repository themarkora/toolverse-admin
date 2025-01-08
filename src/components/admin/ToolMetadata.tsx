import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ToolPublishControl } from "./ToolPublishControl";
import { ToolInfoDisplay } from "./ToolInfoDisplay";

interface ToolMetadataProps {
  tool: Tool;
  onUpdate: () => void;
}

export function ToolMetadata({ tool, onUpdate }: ToolMetadataProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  // Check authentication status when component mounts
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please log in again to continue.",
      });
      navigate("/admin/login");
      return;
    }
  };

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
      if (error.message?.includes('refresh_token_not_found')) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please log in again to continue.",
        });
        navigate("/admin/login");
        return;
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update tool metadata",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewLive = () => {
    // Always open the production URL in a new tab
    window.open(`https://webtoolverse.com/tools/${tool.slug}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Tool Information</h2>
        <p className="text-sm text-gray-500">View and manage tool details</p>
      </div>

      <ToolInfoDisplay tool={tool} />

      <div className="flex space-x-4">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          variant="outline"
        >
          {isSaving ? "Saving..." : "Update Metadata"}
        </Button>

        <Button 
          variant="default" 
          onClick={handleViewLive}
        >
          View Live Tool
        </Button>

        <ToolPublishControl tool={tool} onUpdate={onUpdate} />
      </div>
    </div>
  );
}