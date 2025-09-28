import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Clock, Coins } from "lucide-react";

interface PrizeEntry {
  id: string;
  amount: number;
  timestamp: Date;
  type: 'spin' | 'bonus';
}

interface PrizeHistoryProps {
  prizes: PrizeEntry[];
}

export const PrizeHistory = ({ prizes }: PrizeHistoryProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (prizes.length === 0) {
    return (
      <Card className="p-6 bg-gradient-main border-gold/20">
        <div className="text-center">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Prizes Yet</h3>
          <p className="text-muted-foreground">Start spinning to see your wins here!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-main border-gold/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-gold/20 rounded-lg">
          <Trophy className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Prize History</h3>
          <p className="text-sm text-muted-foreground">Your recent wins</p>
        </div>
      </div>
      
      <ScrollArea className="h-64">
        <div className="space-y-3">
          {prizes.map((prize) => (
            <div
              key={prize.id}
              className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-gold/10 hover:border-gold/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  prize.type === 'bonus' 
                    ? 'bg-green/20 text-green' 
                    : prize.amount > 0 
                      ? 'bg-gold/20 text-gold' 
                      : 'bg-muted/20 text-muted-foreground'
                }`}>
                  {prize.type === 'bonus' ? (
                    <Trophy className="w-4 h-4" />
                  ) : (
                    <Coins className="w-4 h-4" />
                  )}
                </div>
                
                <div>
                  <div className="font-semibold text-foreground">
                    {prize.amount > 0 ? `+KSH ${prize.amount}` : 'Better Luck'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {prize.type === 'bonus' ? 'Registration Bonus' : 'Spin Prize'}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(prize.timestamp)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(prize.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="mt-4 pt-4 border-t border-gold/10">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Total Entries:</span>
          <span className="font-semibold text-foreground">{prizes.length}</span>
        </div>
      </div>
    </Card>
  );
};