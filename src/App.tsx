import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ToolEditPage from "./pages/ToolEditPage";
import { ToolPreview } from "./components/admin/ToolPreview";
import { useParams, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const PublicToolWrapper = () => {
  const { slug } = useParams();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    console.log("[PublicToolWrapper] Mounted");
    console.log("[PublicToolWrapper] Current path:", location.pathname);
    console.log("[PublicToolWrapper] Slug param:", slug);
    
    if (!slug) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No tool specified"
      });
    }
  }, [location, slug, toast]);
  
  if (!slug) {
    console.log("[PublicToolWrapper] No slug provided");
    return null;
  }
  
  return <ToolPreview slug={slug} isPublic={true} />;
};

function App() {
  const location = useLocation();
  
  useEffect(() => {
    console.log("[App] Rendering, current path:", location.pathname);
  }, [location]);
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/tools/:slug/edit" element={<ToolEditPage />} />
      <Route path="/tools/:slug" element={<PublicToolWrapper />} />
    </Routes>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <Suspense 
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading application...</p>
            </div>
          </div>
        }
      >
        <App />
      </Suspense>
    </Router>
  );
}