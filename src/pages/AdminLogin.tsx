import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (roles?.role === 'admin') {
        navigate('/admin');
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "dj.mareli@gmail.com",
        password: "Webtoolverse11!",
      });

      if (error) throw error;

      if (data.user) {
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        if (rolesError) throw rolesError;

        if (roles?.role === 'admin') {
          navigate('/admin');
        } else {
          throw new Error('Unauthorized access');
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020817]">
      <Card className="w-[400px] bg-[#020817] border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-white">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value="dj.mareli@gmail.com"
                className="bg-[#0F1629] border-gray-800 text-gray-300"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value="Webtoolverse11!"
                className="bg-[#0F1629] border-gray-800 text-gray-300"
                readOnly
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;