import { Suspense } from 'react';
import { getToolComponent } from '../tools/registry';

interface ToolPreviewProps {
  slug: string;
  isPublic?: boolean;
}

export function ToolPreview({ slug, isPublic = false }: ToolPreviewProps) {
  const ToolComponent = getToolComponent(slug);

  if (!ToolComponent) {
    return (
      <div className="p-4 text-center text-gray-500">
        No preview available for this tool
      </div>
    );
  }

  return (
    <div className={`${isPublic ? '' : 'border rounded-lg p-4'}`}>
      {!isPublic && (
        <h2 className="text-lg font-semibold mb-4">Tool Preview</h2>
      )}
      <div className={`${isPublic ? '' : 'bg-white rounded-lg shadow'}`}>
        <Suspense fallback={<div>Loading tool preview...</div>}>
          <ToolComponent />
        </Suspense>
      </div>
    </div>
  );
}