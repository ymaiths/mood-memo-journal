
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import StartupAnimation from "@/components/StartupAnimation";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Show animation on successful login
        setShowAnimation(true);
        toast.success("เข้าสู่ระบบสำเร็จ");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success("สมัครสมาชิกสำเร็จ กรุณายืนยันอีเมล");
      }
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };
  
  const handleAnimationComplete = () => {
    navigate("/");
  };

  return (
    <div className="container max-w-md mx-auto py-8">
      <StartupAnimation show={showAnimation} onComplete={handleAnimationComplete} />
      
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          {isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
        </h1>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="อีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </Button>
        </form>
        <p className="text-center mt-4">
          {isLogin ? "ยังไม่มีบัญชี?" : "มีบัญชีอยู่แล้ว?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline ml-2"
          >
            {isLogin ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
          </button>
        </p>
      </Card>
    </div>
  );
};

export default Auth;
