import { Tool } from "@/types/tools";

interface ToolInfoDisplayProps {
  tool: Tool;
}

export function ToolInfoDisplay({ tool }: ToolInfoDisplayProps) {
  // Always use the production domain for the public URL
  const publicUrl = `https://webtoolverse.com/tools/${tool.slug}`;

  return (
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
            href={publicUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {publicUrl}
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
  );
}