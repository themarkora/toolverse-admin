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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/tools/:slug/edit" element={<ToolEditPage />} />
        <Route path="/tools/:slug" element={<PublicToolWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;