import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Crown, Star, ArrowLeft, RotateCcw, Heart, Flame } from "lucide-react";

interface Player {
  name: string;
  score: number;
  difficulty: string;
  timestamp: Date;
  mode?: 'rizz' | 'roast';
}

interface LeaderboardProps {
  currentPlayer?: Player;
  onPlayAgain: () => void;
  onBackToSetup: () => void;
}

export default function Leaderboard({ currentPlayer, onPlayAgain, onBackToSetup }: LeaderboardProps) {
  const [rizzLeaders, setRizzLeaders] = useState<Player[]>([]);
  const [roastLeaders, setRoastLeaders] = useState<Player[]>([]);
  const [activeTab, setActiveTab] = useState<'rizz' | 'roast'>('rizz');

  useEffect(() => {
    // Load existing leaderboards from localStorage
    const savedRizz = localStorage.getItem('flirt-champion-leaderboard-rizz');
    const savedRoast = localStorage.getItem('flirt-champion-leaderboard-roast');
    
    let rizzList: Player[] = savedRizz ? JSON.parse(savedRizz) : [];
    let roastList: Player[] = savedRoast ? JSON.parse(savedRoast) : [];

    // Add current player if provided
    if (currentPlayer) {
      if (currentPlayer.mode === 'roast') {
        roastList.push(currentPlayer);
        roastList.sort((a, b) => b.score - a.score);
        roastList = roastList.slice(0, 10);
        localStorage.setItem('flirt-champion-leaderboard-roast', JSON.stringify(roastList));
        setActiveTab('roast');
      } else {
        rizzList.push(currentPlayer);
        rizzList.sort((a, b) => b.score - a.score);
        rizzList = rizzList.slice(0, 10);
        localStorage.setItem('flirt-champion-leaderboard-rizz', JSON.stringify(rizzList));
        setActiveTab('rizz');
      }
    }

    setRizzLeaders(rizzList);
    setRoastLeaders(roastList);
  }, [currentPlayer]);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <Star className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-secondary text-secondary-foreground';
      case 'hard': return 'bg-accent text-accent-foreground';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  const getDifficultyName = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Sweet Talker';
      case 'medium': return 'Smooth Operator';
      case 'hard': return 'Heartbreaker';
      default: return difficulty;
    }
  };

  const getScoreMessage = (score: number) => {
    if (score >= 50) return "🔥 Legendary Charmer!";
    if (score >= 40) return "💖 Smooth Operator!";
    if (score >= 30) return "✨ Sweet Talker!";
    return "😊 Getting There!";
  };

  const getCurrentPlayerRank = (mode: 'rizz' | 'roast') => {
    if (!currentPlayer || currentPlayer.mode !== mode) return 0;
    const leaderboard = mode === 'rizz' ? rizzLeaders : roastLeaders;
    return leaderboard.findIndex(p => p.name === currentPlayer.name && p.score === currentPlayer.score) + 1;
  };

  const currentPlayerRank = currentPlayer ? getCurrentPlayerRank(currentPlayer.mode || 'rizz') : 0;

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBackToSetup}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Main Menu
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-romantic bg-clip-text text-transparent">
            Hall of Fame
          </h1>
          <Button
            variant="romantic"
            onClick={onPlayAgain}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full p-4 space-y-6">
        {/* Current Game Result */}
        {currentPlayer && (
          <Card className="shadow-romantic border-primary/20">
            <CardHeader className="bg-gradient-romantic text-white text-center">
              <CardTitle className="text-2xl flex items-center justify-center space-x-2">
                {getRankIcon(currentPlayerRank)}
                <span>Game Complete!</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center space-y-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">{currentPlayer.name}</h3>
                <div className="flex items-center justify-center space-x-4">
                  <Badge className={getDifficultyColor(currentPlayer.difficulty)}>
                    {getDifficultyName(currentPlayer.difficulty)}
                  </Badge>
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {currentPlayer.score} points
                  </Badge>
                </div>
                <p className="text-xl text-muted-foreground">
                  {getScoreMessage(currentPlayer.score)}
                </p>
                {currentPlayerRank <= 3 && (
                  <p className="text-lg text-primary font-semibold">
                    🎉 You made it to the Top 3! 🎉
                  </p>
                )}
                {currentPlayerRank > 3 && (
                  <p className="text-muted-foreground">
                    Ranked #{currentPlayerRank} on the leaderboard
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboards with Tabs */}
        <Card className="shadow-soft">
          <CardHeader className="bg-gradient-dreamy text-white">
            <CardTitle className="text-xl flex items-center justify-center space-x-2">
              <Trophy className="w-6 h-6" />
              <span>Hall of Fame</span>
            </CardTitle>
            <CardDescription className="text-center text-white/80">
              Top 10 Champions by Mode
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'rizz' | 'roast')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="rizz" className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Rizz Masters</span>
                </TabsTrigger>
                <TabsTrigger value="roast" className="flex items-center space-x-2">
                  <Flame className="w-4 h-4" />
                  <span>Roast Survivors</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="rizz" className="mt-6">
                <LeaderboardList 
                  leaders={rizzLeaders}
                  currentPlayer={currentPlayer}
                  mode="rizz"
                  getRankIcon={getRankIcon}
                  getDifficultyColor={getDifficultyColor}
                  getDifficultyName={getDifficultyName}
                />
              </TabsContent>
              
              <TabsContent value="roast" className="mt-6">
                <LeaderboardList 
                  leaders={roastLeaders}
                  currentPlayer={currentPlayer}
                  mode="roast"
                  getRankIcon={getRankIcon}
                  getDifficultyColor={getDifficultyColor}
                  getDifficultyName={getDifficultyName}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Clear Leaderboards (for testing) */}
        <div className="text-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              localStorage.removeItem('flirt-champion-leaderboard-rizz');
              setRizzLeaders([]);
            }}
            className="text-muted-foreground hover:text-destructive"
          >
            Clear Rizz
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              localStorage.removeItem('flirt-champion-leaderboard-roast');
              setRoastLeaders([]);
            }}
            className="text-muted-foreground hover:text-destructive"
          >
            Clear Roast
          </Button>
        </div>
      </div>
    </div>
  );
}

// Separate component for the leaderboard list to avoid repetition
function LeaderboardList({ 
  leaders, 
  currentPlayer, 
  mode, 
  getRankIcon, 
  getDifficultyColor, 
  getDifficultyName 
}: {
  leaders: Player[];
  currentPlayer: Player | null;
  mode: 'rizz' | 'roast';
  getRankIcon: (position: number) => JSX.Element;
  getDifficultyColor: (difficulty: string) => string;
  getDifficultyName: (difficulty: string) => string;
}) {
  const emptyMessage = mode === 'rizz' 
    ? "No flirt champions yet! Be the first to master the art of rizz." 
    : "No roast survivors yet! Be the first to survive the savage roasting.";

  const emptyIcon = mode === 'rizz' ? "💖" : "🔥";

  if (leaders.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <div className="text-4xl mb-4">{emptyIcon}</div>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {leaders.map((player, index) => (
        <div
          key={`${player.name}-${player.timestamp}`}
          className={`flex items-center space-x-4 p-4 transition-colors hover:bg-muted/50 ${
            currentPlayer && 
            player.name === currentPlayer.name && 
            player.score === currentPlayer.score &&
            player.mode === currentPlayer.mode
              ? 'bg-primary/10 border-l-4 border-primary' 
              : ''
          }`}
        >
          <div className="flex items-center justify-center w-10">
            {getRankIcon(index + 1)}
          </div>
          <Avatar className="w-10 h-10">
            <AvatarFallback className={mode === 'rizz' ? 'bg-gradient-romantic text-white' : 'bg-gradient-savage text-white'}>
              {player.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-foreground">{player.name}</h4>
              <Badge 
                size="sm" 
                className={getDifficultyColor(player.difficulty)}
              >
                {getDifficultyName(player.difficulty)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(player.timestamp).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-foreground">
              {player.score}
            </div>
            <div className="text-sm text-muted-foreground">points</div>
          </div>
        </div>
      ))}
    </div>
  );
}
