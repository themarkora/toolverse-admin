import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ToolEditPage from "./pages/ToolEditPage";
import { ToolPreview } from "./components/admin/ToolPreview";
import { getToolComponent } from "./components/tools/registry";
import { useParams } from "react-router-dom";

// Tool wrapper component to dynamically load the correct tool
const PublicToolWrapper = () => {
  const { slug } = useParams();
  if (!slug) return null;
  return <ToolPreview slug={slug} isPublic={true} />;
};

// 404 Page component
const NotFound = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#2e3748] to-[#161b26] flex items-center justify-center p-4">
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-8 max-w-lg w-full text-center">
      <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
      <p className="text-gray-300 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="text-[#ff7171] hover:text-[#ff5f5f] font-semibold">
        Return to Home
      </a>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/tools/:slug/edit" element={<ToolEditPage />} />
        <Route path="/tools/:slug" element={<PublicToolWrapper />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;