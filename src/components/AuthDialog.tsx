import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { UserPlus, LogIn } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (userData: { phone: string; name: string }) => void;
}

export const AuthDialog = ({ open, onOpenChange, onLogin }: AuthDialogProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && !formData.name) {
      toast({
        title: "Error", 
        description: "Name is required for registration",
        variant: "destructive",
      });
      return;
    }

    // Mock authentication
    const userData = {
      phone: formData.phone,
      name: formData.name || "User",
    };

    // Store in localStorage
    localStorage.setItem("luckySpin_user", JSON.stringify(userData));
    
    toast({
      title: isLogin ? "Login Successful" : "Registration Successful",
      description: `Welcome ${userData.name}! You've received KSH 200 bonus.`,
    });

    onLogin(userData);
    onOpenChange(false);
    
    // Reset form
    setFormData({ name: "", phone: "", password: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gold">
            {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            {isLogin ? "Login" : "Sign Up"}
          </DialogTitle>
        </DialogHeader>

        <Card className="p-6 bg-gradient-main border-gold/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-gold/20 focus:border-gold"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0712345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border-gold/20 focus:border-gold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border-gold/20 focus:border-gold"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-gold hover:bg-gradient-gold/80 text-black font-semibold"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-gold hover:text-gold/80 underline"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
};