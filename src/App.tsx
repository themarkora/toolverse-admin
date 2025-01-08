import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ToolEditPage from "./pages/ToolEditPage";
import { getToolComponent } from "./components/tools/registry";
import { useParams } from "react-router-dom";

// Tool wrapper component to dynamically load the correct tool
const ToolWrapper = () => {
  const { slug } = useParams();
  if (!slug) return null;
  
  const ToolComponent = lazy(() => {
    const component = getToolComponent(slug);
    if (!component) {
      throw new Error(`Tool not found: ${slug}`);
    }
    return Promise.resolve({ default: component });
  });

  return (
    <Suspense fallback={<div>Loading tool...</div>}>
      <ToolComponent />
    </Suspense>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/tools/:slug/edit" element={<ToolEditPage />} />
        <Route path="/tools/:slug" element={<ToolWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;