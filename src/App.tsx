import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ToolEditPage from "./pages/ToolEditPage";
import SnowDayCalculator from "./components/tools/SnowDayCalculator";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/tools/:slug/edit" element={<ToolEditPage />} />
        <Route path="/tools/:slug" element={<SnowDayCalculator />} />
      </Routes>
    </Router>
  );
}

export default App;