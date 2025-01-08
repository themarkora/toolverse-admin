import { Suspense, lazy } from 'react';
import { getToolComponent } from '../tools/registry';
import { Navigate } from 'react-router-dom';

interface ToolPreviewProps {
  slug: string;
  isPublic?: boolean;
}

export function ToolPreview({ slug, isPublic = false }: ToolPreviewProps) {
  const component = getToolComponent(slug);
  
  if (!component) {
    return isPublic ? (
      <Navigate to="/404" replace />
    ) : (
      <div className="p-4 text-center text-gray-500">
        Tool not found or not available
      </div>
    );
  }

  const ToolComponent = lazy(() => Promise.resolve({ default: component }));

  return (
    <div className={`w-full ${isPublic ? 'min-h-screen' : 'border rounded-lg p-4'}`}>
      {!isPublic && (
        <h2 className="text-lg font-semibold mb-4">Tool Preview</h2>
      )}
      <div className={`${isPublic ? 'w-full' : 'bg-white rounded-lg shadow'}`}>
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">Loading tool...</div>}>
          <ToolComponent isPublic={isPublic} />
        </Suspense>
      </div>
    </div>
  );
}