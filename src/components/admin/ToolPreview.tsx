import { Suspense } from 'react';
import { getToolComponent } from '../tools/registry';
import { Navigate } from 'react-router-dom';

interface ToolPreviewProps {
  slug: string;
  isPublic?: boolean;
}

export function ToolPreview({ slug, isPublic = false }: ToolPreviewProps) {
  console.log("ToolPreview rendering for slug:", slug, "isPublic:", isPublic);
  
  const Component = getToolComponent(slug);
  
  if (!Component) {
    console.error("Tool component not found for slug:", slug);
    return isPublic ? (
      <Navigate to="/" replace />
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