
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    // Check for existing session
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    getUser();

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("ออกจากระบบสำเร็จ");
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!user) {
    return (
      <nav className="flex justify-center py-4 mb-6 border-b">
        <div className="flex items-center space-x-4">
          <Button onClick={() => navigate("/auth")}>เข้าสู่ระบบ</Button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex justify-between items-center py-4 mb-6 border-b px-4">
      <div className="flex space-x-8">
        <Link
          to="/"
          className={cn(
            "px-4 py-2 -mb-px text-sm font-medium transition-colors",
            "hover:text-primary",
            location.pathname === "/" && "border-b-2 border-primary text-primary"
          )}
        >
          ปฏิทิน
        </Link>
        <Link
          to="/analytics"
          className={cn(
            "px-4 py-2 -mb-px text-sm font-medium transition-colors",
            "hover:text-primary",
            location.pathname === "/analytics" && "border-b-2 border-primary text-primary"
          )}
        >
          สถิติอารมณ์
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">
          {user.email}
        </span>
        <Button variant="outline" onClick={handleLogout}>
          ออกจากระบบ
        </Button>
      </div>
    </nav>
  );
};
