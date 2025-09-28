import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gift, Coins, Star, Trophy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const prizes = [
  { id: 1, text: "KSH 50", value: 50, color: "bg-gradient-gold", icon: Coins },
  { id: 2, text: "KSH 25", value: 25, color: "bg-gradient-green", icon: Coins },
  { id: 3, text: "KSH 100", value: 100, color: "bg-gradient-purple", icon: Trophy },
  { id: 4, text: "KSH 10", value: 10, color: "bg-orange", icon: Coins },
  { id: 5, text: "KSH 75", value: 75, color: "bg-blue", icon: Star },
  { id: 6, text: "Better Luck", value: 0, color: "bg-muted", icon: Gift },
  { id: 7, text: "KSH 150", value: 150, color: "bg-gradient-gold", icon: Trophy },
  { id: 8, text: "KSH 30", value: 30, color: "bg-gradient-green", icon: Coins },
];

interface SpinWheelProps {
  onWin: (amount: number) => void;
  canSpin: boolean;
}

export const SpinWheel = ({ onWin, canSpin }: SpinWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    if (!canSpin || isSpinning) return;
    
    setIsSpinning(true);
    
    // Generate random rotation (multiple full rotations + random position)
    const spinRotation = 1440 + Math.random() * 360;
    setRotation(prev => prev + spinRotation);
    
    // Calculate winner after spin animation
    setTimeout(() => {
      const normalizedRotation = spinRotation % 360;
      const segmentAngle = 360 / prizes.length;
      const winnerIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % prizes.length;
      const winner = prizes[winnerIndex];
      
      onWin(winner.value);
      
      if (winner.value > 0) {
        toast({
          title: "🎉 Congratulations!",
          description: `You won ${winner.text}!`,
        });
      } else {
        toast({
          title: "Try Again!",
          description: "Better luck next time!",
          variant: "default",
        });
      }
      
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <Card className="p-6 bg-gradient-main border-gold/20">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-2">
          Lucky Spin Wheel
        </h2>
        <p className="text-muted-foreground">Spin to win amazing prizes!</p>
      </div>
      
      <div className="relative flex justify-center items-center mb-6">
        {/* Wheel Container */}
        <div className="relative w-80 h-80">
          {/* Wheel */}
          <div
            className={`w-full h-full rounded-full relative overflow-hidden shadow-glow-gold transition-transform duration-[3000ms] ${
              isSpinning ? "animate-spin-wheel" : ""
            }`}
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {prizes.map((prize, index) => {
              const angle = (360 / prizes.length) * index;
              const Icon = prize.icon;
              
              return (
                <div
                  key={prize.id}
                  className={`absolute w-full h-full ${prize.color}`}
                  style={{
                    clipPath: `polygon(50% 50%, ${
                      50 + 40 * Math.cos((angle - 22.5) * Math.PI / 180)
                    }% ${
                      50 + 40 * Math.sin((angle - 22.5) * Math.PI / 180)
                    }%, ${
                      50 + 40 * Math.cos((angle + 22.5) * Math.PI / 180)
                    }% ${
                      50 + 40 * Math.sin((angle + 22.5) * Math.PI / 180)
                    }%)`,
                  }}
                >
                  <div
                    className="absolute flex flex-col items-center justify-center text-white text-xs font-bold"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-60px)`,
                      width: "60px",
                      textAlign: "center",
                    }}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-[10px] leading-tight">{prize.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-gold rounded-full shadow-gold flex items-center justify-center">
            <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-gold" />
            </div>
          </div>
          
          {/* Pointer */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-gold shadow-gold"></div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <Button
          onClick={handleSpin}
          disabled={!canSpin || isSpinning}
          className="bg-gradient-gold hover:bg-gradient-gold/80 text-background font-bold py-3 px-8 rounded-full shadow-gold hover:shadow-glow-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSpinning ? "Spinning..." : "SPIN NOW"}
        </Button>
        
        {!canSpin && (
          <p className="text-sm text-muted-foreground mt-2">
            Insufficient balance to spin
          </p>
        )}
      </div>
    </Card>
  );
};