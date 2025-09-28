import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, Wallet } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balance: number;
  onWithdraw: (amount: number) => void;
}

export const WithdrawalDialog = ({ open, onOpenChange, balance, onWithdraw }: WithdrawalDialogProps) => {
  const [formData, setFormData] = useState({
    amount: "",
    accountName: "",
    accountNumber: "",
    bankName: "",
  });

  const minWithdrawal = 249;
  const maxAmount = Math.min(balance, 210); // Cap at KSH 210

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    
    if (!amount || amount < minWithdrawal) {
      toast({
        title: "Invalid Amount",
        description: `Minimum withdrawal is KSH ${minWithdrawal}`,
        variant: "destructive",
      });
      return;
    }

    if (amount > maxAmount) {
      toast({
        title: "Amount Too High",
        description: `Maximum withdrawal is KSH ${maxAmount}`,
        variant: "destructive",
      });
      return;
    }

    if (!formData.accountName || !formData.accountNumber || !formData.bankName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all account details",
        variant: "destructive",
      });
      return;
    }

    // Process withdrawal
    onWithdraw(amount);
    
    toast({
      title: "Withdrawal Requested",
      description: `KSH ${amount} withdrawal to ${formData.bankName} processed`,
    });

    onOpenChange(false);
    setFormData({ amount: "", accountName: "", accountNumber: "", bankName: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gold">
            <ArrowUpRight className="w-5 h-5" />
            Withdraw Funds
          </DialogTitle>
        </DialogHeader>

        <Card className="p-6 bg-gradient-main border-gold/20">
          <div className="mb-4 p-3 bg-gradient-gold/10 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Wallet className="w-4 h-4 text-gold" />
              <span className="text-muted-foreground">Available:</span>
              <span className="font-semibold text-gold">KSH {maxAmount}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Min: KSH {minWithdrawal} • Max: KSH {maxAmount}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="border-gold/20 focus:border-gold"
                min={minWithdrawal}
                max={maxAmount}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                type="text"
                placeholder="Full name on account"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                className="border-gold/20 focus:border-gold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                type="text"
                placeholder="Bank account number"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="border-gold/20 focus:border-gold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                type="text"
                placeholder="e.g. KCB, Equity, etc."
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="border-gold/20 focus:border-gold"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-green hover:bg-gradient-green/80 text-white font-semibold"
              disabled={!formData.amount || parseFloat(formData.amount) < minWithdrawal}
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Withdraw KSH {formData.amount || 0}
            </Button>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
};