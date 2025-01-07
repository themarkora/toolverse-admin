import { Navbar } from "@/components/Navbar";
import { ToolCard } from "@/components/ToolCard";

// Temporary mock data
const tools = [
  {
    title: "Color Picker",
    description: "A simple but powerful color picking tool with various formats support.",
    category: "Design",
  },
  {
    title: "JSON Formatter",
    description: "Format and validate your JSON with this easy-to-use tool.",
    category: "Development",
  },
  {
    title: "Image Optimizer",
    description: "Optimize your images for the web without losing quality.",
    category: "Media",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Web Tools Collection
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A curated collection of useful web tools to help streamline your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <ToolCard key={index} {...tool} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;