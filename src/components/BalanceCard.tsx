import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, TrendingUp, Gift, ArrowUpRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BalanceCardProps {
  balance: number;
  totalWinnings: number;
  registrationBonus: number;
  onWithdraw: () => void;
}

export const BalanceCard = ({ 
  balance, 
  totalWinnings, 
  registrationBonus, 
  onWithdraw 
}: BalanceCardProps) => {
  const minWithdrawal = 249;
  const canWithdraw = balance >= minWithdrawal;

  const handleWithdrawClick = () => {
    if (!canWithdraw) {
      toast({
        title: "Insufficient Balance",
        description: `Minimum withdrawal amount is KSH ${minWithdrawal}`,
        variant: "destructive",
      });
      return;
    }
    onWithdraw();
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Main Balance Card */}
      <Card className="p-6 bg-gradient-main border-gold/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-gold/10 rounded-full -translate-y-16 translate-x-16"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-gold/20 rounded-lg">
              <Wallet className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Current Balance</h3>
              <p className="text-sm text-muted-foreground">Available for withdrawal</p>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-3xl font-bold text-gold mb-1">
              KSH {balance.toLocaleString()}
            </div>
            {registrationBonus > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Gift className="w-4 h-4 text-green" />
                <span className="text-green">
                  +KSH {registrationBonus} Registration Bonus
                </span>
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleWithdrawClick}
            disabled={!canWithdraw}
            className={`w-full font-semibold py-2 rounded-lg transition-all duration-300 ${
              canWithdraw 
                ? "bg-gradient-green hover:bg-gradient-green/80 text-white shadow-green hover:shadow-glow-green" 
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            {canWithdraw ? "Withdraw Now" : `Need KSH ${minWithdrawal - balance} more`}
          </Button>
          
          {canWithdraw && (
            <p className="text-xs text-center text-green mt-2">
              ✓ Ready for withdrawal
            </p>
          )}
        </div>
      </Card>

      {/* Stats Card */}
      <Card className="p-6 bg-gradient-main border-purple/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-purple/10 rounded-full -translate-y-16 translate-x-16"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-purple/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Total Winnings</h3>
              <p className="text-sm text-muted-foreground">Lifetime earnings</p>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="text-3xl font-bold text-purple mb-1">
              KSH {totalWinnings.toLocaleString()}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Min. Withdrawal:</span>
              <span className="font-semibold text-foreground">KSH {minWithdrawal}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Registration Bonus:</span>
              <span className="font-semibold text-green">KSH 200</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};