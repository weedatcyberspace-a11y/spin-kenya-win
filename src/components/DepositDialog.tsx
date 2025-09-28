import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Smartphone, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeposit: (amount: number) => void;
}

export const DepositDialog = ({ open, onOpenChange, onDeposit }: DepositDialogProps) => {
  const [amount, setAmount] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  
  const minDeposit = 49;

  const handleProceed = () => {
    const depositAmount = parseFloat(amount);
    
    if (!depositAmount || depositAmount < minDeposit) {
      toast({
        title: "Invalid Amount",
        description: `Minimum deposit is KSH ${minDeposit}`,
        variant: "destructive",
      });
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    const depositAmount = parseFloat(amount);
    onDeposit(depositAmount);
    
    toast({
      title: "Deposit Successful",
      description: `KSH ${depositAmount} added to your balance`,
    });

    onOpenChange(false);
    setAmount("");
    setShowPayment(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green">
            <Smartphone className="w-5 h-5" />
            M-Pesa Deposit
          </DialogTitle>
        </DialogHeader>

        <Card className="p-6 bg-gradient-main border-green/20">
          {!showPayment ? (
            <div className="space-y-4">
              <div className="p-3 bg-gradient-green/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Minimum deposit: <span className="font-semibold text-green">KSH {minDeposit}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="depositAmount">Deposit Amount</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border-green/20 focus:border-green"
                  min={minDeposit}
                />
              </div>

              <Button 
                onClick={handleProceed}
                className="w-full bg-gradient-green hover:bg-gradient-green/80 text-white font-semibold"
                disabled={!amount || parseFloat(amount) < minDeposit}
              >
                <Plus className="w-4 h-4 mr-2" />
                Proceed to M-Pesa
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Complete Payment</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Amount: <span className="font-semibold text-green">KSH {amount}</span>
                </p>
              </div>

              {/* Pesapal iframe integration */}
              <div className="border border-green/20 rounded-lg p-4 bg-card/50">
                <iframe 
                  width="100%" 
                  height="200" 
                  src="https://store.pesapal.com/embed-code?pageUrl=https://store.pesapal.com/moneyflow" 
                  frameBorder="0" 
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setShowPayment(false)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handlePaymentComplete}
                  className="flex-1 bg-gradient-green hover:bg-gradient-green/80 text-white font-semibold"
                >
                  Payment Complete
                </Button>
              </div>
            </div>
          )}
        </Card>
      </DialogContent>
    </Dialog>
  );
};