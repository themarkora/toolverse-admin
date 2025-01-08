import { Suspense, useEffect, useState } from 'react';
import { getToolComponent } from '../tools/registry';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ToolPreviewProps {
  slug: string;
  isPublic?: boolean;
}

export function ToolPreview({ slug, isPublic = false }: ToolPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [toolExists, setToolExists] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
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
          console.error("[ToolPreview] Database error:", fetchError);
          setDebugInfo({
            type: 'database_error',
            error: fetchError,
            context: { slug, isPublic }
          });
          setError(`Database error: ${fetchError.message}`);
          toast({
            variant: "destructive",
            title: "Database Error",
            description: fetchError.message
          });
          return;
        }

        console.log("[ToolPreview] Tool data from database:", data);
        setDebugInfo(prev => ({ ...prev, databaseResponse: data }));
        
        if (!data) {
          const msg = `No tool found with slug: ${slug}`;
          console.error("[ToolPreview]", msg);
          setDebugInfo(prev => ({
            ...prev,
            type: 'tool_not_found',
            context: { slug, isPublic }
          }));
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
          setDebugInfo(prev => ({
            ...prev,
            type: 'tool_not_published',
            toolData: data
          }));
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
        setDebugInfo({
          type: 'unexpected_error',
          error: err,
          context: { slug, isPublic }
        });
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
    
    if (isPublic) {
      return <Navigate to="/" replace />;
    }
    
    return (
      <div className="p-8 space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Tool Error</AlertTitle>
          <AlertDescription>
            {error || `Tool component not found for: ${slug}`}
          </AlertDescription>
        </Alert>
        
        {process.env.NODE_ENV === 'development' && debugInfo && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-semibold mb-2">Debug Information:</h3>
            <pre className="text-xs whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
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