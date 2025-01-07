import { Suspense } from 'react';
import { getToolComponent } from '../tools/registry';

interface ToolPreviewProps {
  slug: string;
}

export function ToolPreview({ slug }: ToolPreviewProps) {
  const ToolComponent = getToolComponent(slug);

  if (!ToolComponent) {
    return (
      <div className="p-4 text-center text-gray-500">
        No preview available for this tool
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Tool Preview</h2>
      <div className="bg-white rounded-lg shadow">
        <Suspense fallback={<div>Loading tool preview...</div>}>
          <ToolComponent />
        </Suspense>
      </div>
    </div>
  );
}