import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Plus } from "lucide-react";
import { StatsCards } from "@/components/admin/StatsCards";
import { ToolTable } from "@/components/admin/ToolTable";
import { Tool } from "@/types/tools";
import { Card } from "@/components/ui/card";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    checkAdminAccess();
    fetchUserCount();
    fetchTools();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin/login');
        return;
      }

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (roles?.role !== 'admin') {
        throw new Error('Unauthorized access');
      }

      setLoading(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      navigate('/admin/login');
    }
  };

  const fetchUserCount = async () => {
    try {
      const { count } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact' });
      
      setUserCount(count || 0);
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  };

  const fetchTools = async () => {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('name');

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch tools",
      });
      return;
    }

    setTools(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <StatsCards 
          userCount={userCount}
          toolsCount={tools.length}
        />

        {/* Tools Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Tools</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Tool
            </Button>
          </div>
          <Card>
            <ToolTable tools={tools} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;