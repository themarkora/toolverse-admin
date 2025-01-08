import { Suspense, useEffect } from 'react';
import { getToolComponent } from '../tools/registry';
import { Navigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

interface ToolPreviewProps {
  slug: string;
  isPublic?: boolean;
}

export function ToolPreview({ slug, isPublic = false }: ToolPreviewProps) {
  const Component = getToolComponent(slug);
  
  useEffect(() => {
    const checkToolPublished = async () => {
      if (isPublic) {
        const { data, error } = await supabase
          .from('tools')
          .select('published')
          .eq('slug', slug)
          .single();
        
        if (error || !data?.published) {
          window.location.href = '/404';
        }
      }
    };
    
    checkToolPublished();
  }, [slug, isPublic]);
  
  if (!Component) {
    return isPublic ? (
      <Navigate to="/404" replace />
    ) : (
      <div className="p-4 text-center text-gray-500">
        Tool not found or not available
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