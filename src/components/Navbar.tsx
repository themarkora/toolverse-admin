import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">
          WebTools
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative w-64">
            <Input
              type="search"
              placeholder="Search tools..."
              className="pl-8"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          
          <Link to="/categories" className="nav-link">
            Categories
          </Link>
          
          <Link to="/tools" className="nav-link">
            All Tools
          </Link>
          
          <Link to="/admin">
            <Button variant="outline">Admin</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};