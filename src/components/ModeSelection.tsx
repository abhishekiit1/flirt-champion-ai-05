import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Zap } from "lucide-react";

interface ModeSelectionProps {
  onSelectMode: (mode: 'rizz' | 'roast') => void;
}

const ModeSelection = ({ onSelectMode }: ModeSelectionProps) => {
  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Choose Your Adventure
          </h1>
          <p className="text-xl text-muted-foreground">
            What kind of conversation are you in the mood for?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Rizz Chats Mode */}
          <Card 
            className="cursor-pointer transition-bounce hover:scale-105 hover:shadow-romantic border-2 hover:border-primary"
            onClick={() => onSelectMode('rizz')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-romantic rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Rizz Chats
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Charm your way to victory with romantic conversations! Choose from various anime characters with unique personalities.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>💖 Multiple character personalities</p>
                <p>🎭 Choose your preferred gender</p>
                <p>🌟 Romantic & sweet conversations</p>
                <p>🏆 Win hearts and score points</p>
              </div>
              <Button 
                className="mt-6 w-full bg-gradient-romantic hover:opacity-90 text-white font-semibold py-3"
                size="lg"
              >
                Start Rizz Challenge
              </Button>
            </CardContent>
          </Card>

          {/* Roast Mode */}
          <Card 
            className="cursor-pointer transition-bounce hover:scale-105 hover:shadow-roast border-2 hover:border-destructive bg-gradient-to-br from-card to-destructive/5"
            onClick={() => onSelectMode('roast')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-roast rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Roast Bot
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Think you can handle the heat? Get roasted by our savage AI with increasing levels of brutality!
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>🔥 3 savage difficulty levels</p>
                <p>😈 Uncensored roasting experience</p>
                <p>🌶️ Hinglish cuss words included</p>
                <p>💀 Prepare to get destroyed</p>
              </div>
              <Button 
                className="mt-6 w-full bg-gradient-roast hover:opacity-90 text-white font-semibold py-3"
                size="lg"
              >
                Enter Roast Zone
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModeSelection;