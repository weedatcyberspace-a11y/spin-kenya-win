import { useState, useEffect } from "react";
import { SpinWheel } from "@/components/SpinWheel";
import { BalanceCard } from "@/components/BalanceCard";
import { PrizeHistory } from "@/components/PrizeHistory";
import { AuthDialog } from "@/components/AuthDialog";
import { WithdrawalDialog } from "@/components/WithdrawalDialog";
import { DepositDialog } from "@/components/DepositDialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Sparkles, Trophy, Plus, LogOut, Smartphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PrizeEntry {
  id: string;
  amount: number;
  timestamp: Date;
  type: 'spin' | 'bonus';
}

const Index = () => {
  const [user, setUser] = useState<{ phone: string; name: string } | null>(null);
  const [balance, setBalance] = useState(0);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [prizes, setPrizes] = useState<PrizeEntry[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showWithdrawalDialog, setShowWithdrawalDialog] = useState(false);
  const [showDepositDialog, setShowDepositDialog] = useState(false);

  // Check for existing user on load
  useEffect(() => {
    const savedUser = localStorage.getItem("luckySpin_user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setBalance(200); // Registration bonus
      setTotalWinnings(200);
      setPrizes([{
        id: 'bonus-1',
        amount: 200,
        timestamp: new Date(),
        type: 'bonus'
      }]);
      setShowWelcome(true);
    }
  }, []);

  const spinCost = 10;
  const canSpin = balance >= spinCost;

  const handleSpin = (winAmount: number) => {
    // Deduct spin cost
    setBalance(prev => prev - spinCost);
    
    if (winAmount > 0) {
      // Add winnings
      setBalance(prev => prev + winAmount);
      setTotalWinnings(prev => prev + winAmount);
    }
    
    // Add to prize history
    const newPrize: PrizeEntry = {
      id: `spin-${Date.now()}`,
      amount: winAmount,
      timestamp: new Date(),
      type: 'spin'
    };
    
    setPrizes(prev => [newPrize, ...prev]);
  };

  const handleLogin = (userData: { phone: string; name: string }) => {
    setUser(userData);
    setBalance(200); // Registration bonus
    setTotalWinnings(200);
    setPrizes([{
      id: 'bonus-1',
      amount: 200,
      timestamp: new Date(),
      type: 'bonus'
    }]);
    setShowWelcome(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("luckySpin_user");
    setUser(null);
    setBalance(0);
    setTotalWinnings(0);
    setPrizes([]);
    setShowWelcome(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleWithdraw = (amount: number) => {
    const maxWithdrawal = Math.min(balance, 210);
    if (amount <= maxWithdrawal) {
      setBalance(prev => prev - amount);
    }
  };

  const handleDeposit = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const dismissWelcome = () => {
    setShowWelcome(false);
  };

  // If not logged in, show login screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <Card className="p-8 max-w-md w-full mx-4 bg-gradient-main border-gold/20 text-center">
          <div className="mb-6">
            <div className="p-4 bg-gradient-gold/20 rounded-full w-fit mx-auto mb-4">
              <Star className="w-12 h-12 text-gold" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-2">
              Lucky Spin
            </h1>
            <p className="text-muted-foreground">
              Register to get KSH 200 bonus and start spinning!
            </p>
          </div>

          <Button 
            onClick={() => setShowAuthDialog(true)}
            className="w-full bg-gradient-gold hover:bg-gradient-gold/80 text-black font-semibold mb-4"
          >
            Get Started
          </Button>

          <p className="text-xs text-muted-foreground">
            Minimum withdrawal: KSH 249 • Registration bonus: KSH 200
          </p>
        </Card>

        <AuthDialog 
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-main">
      {/* Header */}
      <div className="bg-gradient-gold/10 border-b border-gold/20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-gold/20 rounded-xl">
                <Star className="w-8 h-8 text-gold" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                  Lucky Spin
                </h1>
                <p className="text-sm text-muted-foreground">Spin to win big prizes!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-lg font-bold text-gold">KSH {balance.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Available Balance</div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowDepositDialog(true)}
                  size="sm"
                  className="bg-gradient-green hover:bg-gradient-green/80 text-white"
                >
                  <Smartphone className="w-4 h-4 mr-1" />
                  M-Pesa
                </Button>
                
                <Button
                  onClick={handleLogout}
                  size="sm"
                  variant="outline"
                  className="border-gold/20 text-gold hover:bg-gold/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        {showWelcome && (
          <Card className="p-6 mb-8 bg-gradient-green/10 border-green/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-green/20 rounded-full -translate-y-12 translate-x-12"></div>
            
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-green/20 rounded-full">
                  <Sparkles className="w-8 h-8 text-green animate-pulse-gold" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Welcome Bonus Activated! 🎉
                  </h2>
                  <p className="text-muted-foreground mb-1">
                    Congratulations! You've received KSH 200 registration bonus.
                  </p>
                  <p className="text-sm text-green">
                    Start spinning now! Each spin costs KSH {spinCost}.
                  </p>
                </div>
              </div>
              
              <Button
                onClick={dismissWelcome}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </Button>
            </div>
          </Card>
        )}

        {/* Balance Cards */}
        <div className="mb-8">
          <BalanceCard
            balance={balance}
            totalWinnings={totalWinnings}
            registrationBonus={200}
            onWithdraw={() => setShowWithdrawalDialog(true)}
          />
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Spin Wheel */}
          <div className="lg:col-span-2">
            <SpinWheel onWin={handleSpin} canSpin={canSpin} />
            
            {/* Spin Info */}
            <Card className="mt-6 p-4 bg-card/50 border-gold/10">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-gold" />
                  <span className="text-muted-foreground">Cost per spin:</span>
                </div>
                <span className="font-semibold text-foreground">KSH {spinCost}</span>
              </div>
            </Card>
          </div>

          {/* Prize History */}
          <div className="lg:col-span-1">
            <PrizeHistory prizes={prizes} />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-card/30 border-t border-gold/10 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Minimum withdrawal: KSH 249 • Registration bonus: KSH 200 • Max withdrawal: KSH 210
          </p>
        </div>
      </div>

      {/* Dialogs */}
      <WithdrawalDialog
        open={showWithdrawalDialog}
        onOpenChange={setShowWithdrawalDialog}
        balance={balance}
        onWithdraw={handleWithdraw}
      />

      <DepositDialog
        open={showDepositDialog}
        onOpenChange={setShowDepositDialog}
        onDeposit={handleDeposit}
      />
    </div>
  );
};

export default Index;