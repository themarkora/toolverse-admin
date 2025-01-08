import { Suspense, useEffect, useState } from 'react';
import { getToolComponent } from '../tools/registry';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

interface ToolPreviewProps {
  slug: string;
  isPublic?: boolean;
}

export function ToolPreview({ slug, isPublic = false }: ToolPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [toolExists, setToolExists] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  console.log("ToolPreview rendering for slug:", slug, "isPublic:", isPublic);
  
  useEffect(() => {
    const checkToolPublished = async () => {
      try {
        console.log("Checking tool publication status for slug:", slug);
        const { data, error } = await supabase
          .from("tools")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) {
          console.error("Error fetching tool:", error.message);
          setError(error.message);
          return;
        }

        console.log("Tool data from database:", data);
        
        if (!data) {
          console.error("No tool found in database for slug:", slug);
          setError("Tool not found");
          return;
        }

        setToolExists(true);
        
        if (isPublic && !data.published) {
          console.log("Tool is not published, redirecting...");
          setError("Tool is not published");
          return;
        }

      } catch (err) {
        console.error("Error checking tool status:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    checkToolPublished();
  }, [slug, isPublic, navigate]);
  
  const Component = getToolComponent(slug);
  
  if (isLoading) {
    return <div className="p-4 text-center">Loading tool data...</div>;
  }

  if (error || !Component) {
    console.error("Tool error:", error || "Component not found for slug: " + slug);
    return isPublic ? (
      <Navigate to="/" replace />
    ) : (
      <div className="p-4 text-center text-gray-500">
        {error || "Tool not found or not available"}
      </div>
    );
  }

  return (
    <div className={`w-full ${isPublic ? 'min-h-screen' : 'border rounded-lg p-4'}`}>
      {!isPublic && (
        <h2 className="text-lg font-semibold mb-4">Tool Preview</h2>
      )}
      <div className={`${isPublic ? 'w-full' : 'bg-white rounded-lg shadow'}`}>
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">Loading tool...</div>}>
          <Component isPublic={isPublic} />
        </Suspense>
      </div>
    </div>
  );
}