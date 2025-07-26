import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles, Flame } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface GameSetupProps {
  onStartGame: (playerName: string, difficulty: string, apiKey: string) => void;
}

const difficulties = [
  {
    id: "easy",
    name: "Sweet Talker",
    description: "Gentle conversation, easy to charm",
    icon: Heart,
    color: "bg-success",
    points: "1-3 points per message"
  },
  {
    id: "medium", 
    name: "Smooth Operator",
    description: "Moderate challenge, witty responses needed",
    icon: Sparkles,
    color: "bg-secondary",
    points: "2-5 points per message"
  },
  {
    id: "hard",
    name: "Heartbreaker",
    description: "Expert level, creative charm required",
    icon: Flame,
    color: "bg-accent",
    points: "3-7 points per message"
  }
];

export default function GameSetup({ onStartGame }: GameSetupProps) {
  const [playerName, setPlayerName] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("easy");
  const [apiKey, setApiKey] = useState("");

  const handleStartGame = () => {
    if (playerName.trim() && apiKey.trim()) {
      onStartGame(playerName.trim(), selectedDifficulty, apiKey.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-2xl shadow-romantic border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-gradient-romantic shadow-passionate">
              <Heart className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-romantic bg-clip-text text-transparent">
            Flirt Champion AI
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Test your charm and flirting skills against our AI. Earn points for witty responses and climb the leaderboard!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Player Name Input */}
          <div className="space-y-2">
            <label htmlFor="playerName" className="text-sm font-medium text-foreground">
              Enter Your Name
            </label>
            <Input
              id="playerName"
              type="text"
              placeholder="Your charming name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="text-center text-lg font-medium"
              onKeyPress={(e) => e.key === 'Enter' && handleStartGame()}
            />
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium text-foreground">
              Gemini API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              placeholder="AIza..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleStartGame()}
            />
            <p className="text-xs text-muted-foreground">
              Get your free API key from{" "}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center text-foreground">
              Choose Your Challenge Level
            </h3>
            <div className="grid gap-4">
              {difficulties.map((diff) => {
                const Icon = diff.icon;
                return (
                  <Card
                    key={diff.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-soft ${
                      selectedDifficulty === diff.id
                        ? 'ring-2 ring-primary shadow-romantic scale-[1.02]'
                        : 'hover:scale-[1.01]'
                    }`}
                    onClick={() => setSelectedDifficulty(diff.id)}
                  >
                    <CardContent className="flex items-center space-x-4 p-4">
                      <div className={`p-3 rounded-full ${diff.color} text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-foreground">{diff.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {diff.points}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{diff.description}</p>
                      </div>
                      {selectedDifficulty === diff.id && (
                        <div className="text-primary">
                          <Heart className="w-5 h-5 fill-current" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Start Game Button */}
          <Button
            onClick={handleStartGame}
            disabled={!playerName.trim() || !apiKey.trim()}
            variant="romantic"
            size="xl"
            className="w-full"
          >
            <Heart className="w-5 h-5 mr-2" />
            Start Flirting Challenge
            <Sparkles className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}