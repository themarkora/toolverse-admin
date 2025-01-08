import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ToolEditPage from "./pages/ToolEditPage";
import { ToolPreview } from "./components/admin/ToolPreview";
import { getToolComponent } from "./components/tools/registry";
import { useParams, useLocation } from "react-router-dom";

const PublicToolWrapper = () => {
  const { slug } = useParams();
  const location = useLocation();
  
  useEffect(() => {
    console.log("PublicToolWrapper mounted");
    console.log("Current path:", location.pathname);
    console.log("Slug param:", slug);
  }, [location, slug]);
  
  if (!slug) {
    console.log("No slug provided to PublicToolWrapper");
    return null;
  }
  
  return <ToolPreview slug={slug} isPublic={true} />;
};

function App() {
  const location = useLocation();
  
  useEffect(() => {
    console.log("App rendering, current path:", location.pathname);
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
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </Router>
  );
}