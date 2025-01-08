import { Suspense, useEffect, useState } from 'react';
import { getToolComponent } from '../tools/registry';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ToolPreviewProps {
  slug: string;
  isPublic?: boolean;
}

export function ToolPreview({ slug, isPublic = false }: ToolPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [toolExists, setToolExists] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  console.log("[ToolPreview] Rendering for slug:", slug, "isPublic:", isPublic);
  
  useEffect(() => {
    const checkToolPublished = async () => {
      try {
        console.log("[ToolPreview] Checking tool publication status for slug:", slug);
        const { data, error: fetchError } = await supabase
          .from("tools")
          .select("*")
          .eq("slug", slug)
          .single();

        if (fetchError) {
          console.error("[ToolPreview] Error fetching tool:", fetchError.message);
          setError(fetchError.message);
          toast({
            variant: "destructive",
            title: "Error loading tool",
            description: fetchError.message
          });
          return;
        }

        console.log("[ToolPreview] Tool data from database:", data);
        
        if (!data) {
          const msg = `No tool found with slug: ${slug}`;
          console.error("[ToolPreview]", msg);
          setError(msg);
          toast({
            variant: "destructive",
            title: "Tool not found",
            description: msg
          });
          return;
        }

        setToolExists(true);
        
        if (isPublic && !data.published) {
          const msg = "This tool is not yet published";
          console.log("[ToolPreview]", msg);
          setError(msg);
          toast({
            variant: "destructive",
            title: "Tool unavailable",
            description: msg
          });
          return;
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        console.error("[ToolPreview] Error checking tool status:", errorMessage);
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkToolPublished();
  }, [slug, isPublic, navigate, toast]);
  
  const Component = getToolComponent(slug);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tool data...</p>
        </div>
      </div>
    );
  }

  if (error || !Component) {
    console.error("[ToolPreview] Tool error:", error || "Component not found for slug: " + slug);
    return isPublic ? (
      <Navigate to="/" replace />
    ) : (
      <div className="p-8 text-center bg-red-50 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Tool Error</h3>
        <p className="text-red-600">
          {error || `Tool component not found for: ${slug}`}
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full ${isPublic ? 'min-h-screen' : 'border rounded-lg p-4'}`}>
      {!isPublic && (
        <h2 className="text-lg font-semibold mb-4">Tool Preview</h2>
      )}
      <div className={`${isPublic ? 'w-full' : 'bg-white rounded-lg shadow'}`}>
        <Suspense 
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading tool...</p>
              </div>
            </div>
          }
        >
          <Component isPublic={isPublic} />
        </Suspense>
      </div>
    </div>
  );
}