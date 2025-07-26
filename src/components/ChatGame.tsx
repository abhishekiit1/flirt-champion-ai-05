import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Heart, Send, Trophy, Sparkles, ArrowLeft, Clock, Target } from "lucide-react";
import { LLMService } from "@/services/llmService";
import { GameEndService } from "@/services/gameEndService";
import { ThemeToggle } from "@/components/ThemeToggle";
import AnimeCharacter from "@/components/AnimeCharacter";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  points?: number;
  mood?: 'neutral' | 'happy' | 'impressed' | 'unimpressed' | 'annoyed';
}

interface ChatGameProps {
  playerName: string;
  difficulty: string;
  apiKey: string;
  character?: any;
  mode?: 'rizz' | 'roast';
  language?: 'english' | 'hinglish';
  onGameEnd: (finalScore: number, gameResult?: any) => void;
  onBackToSetup: () => void;
}

export default function ChatGame({ playerName, difficulty, apiKey, character, mode, language, onGameEnd, onBackToSetup }: ChatGameProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [score, setScore] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [llmService] = useState(() => new LLMService(apiKey));
  const [gameEndService] = useState(() => new GameEndService(apiKey));
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [currentMood, setCurrentMood] = useState<'neutral' | 'happy' | 'impressed' | 'unimpressed' | 'annoyed'>('neutral');
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const maxMessages = 10;
  const isRoastMode = mode === 'roast';
  const targetScore = isRoastMode ? 20 : (difficulty === 'easy' ? 25 : difficulty === 'medium' ? 40 : 50);

  // Initialize game and start timer
  useEffect(() => {
    const initializeGame = async () => {
      try {
        const isConnected = await llmService.testConnection();
        if (!isConnected) {
          setConnectionError("Failed to connect to Gemini API. Please check your API key.");
          return;
        }

        // Generate initial AI message
        const initialResponse = await llmService.generateResponse(
          "START_GAME", 
          [], 
          difficulty, 
          playerName,
          character,
          language
        );
        
        const initialMessage: Message = {
          id: '1',
          text: initialResponse.response,
          sender: 'ai',
          timestamp: new Date(),
          mood: initialResponse.mood
        };
        
        setMessages([initialMessage]);
        setCurrentMood(initialResponse.mood);
        setGameStarted(true);
      } catch (error) {
        setConnectionError("Failed to initialize game. Please check your connection.");
      }
    };
    
    initializeGame();
  }, [llmService, difficulty, playerName]);

  // Timer logic
  useEffect(() => {
    if (!gameStarted || isLoading || gameEnded || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, isLoading, gameEnded, timeLeft]);

  // End game when time runs out
  useEffect(() => {
    if (timeLeft <= 0 && gameStarted && !gameEnded) {
      handleGameEnd();
    }
  }, [timeLeft, gameStarted, gameEnded]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGameEnd = async () => {
    if (gameEnded) return;
    setGameEnded(true);

    try {
      const chatHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text
      }));

      const gameResult = await gameEndService.generateGameEndContent(
        playerName,
        score,
        targetScore,
        difficulty,
        chatHistory
      );

      onGameEnd(score, gameResult);
    } catch (error) {
      console.error('Failed to generate game end content:', error);
      onGameEnd(score);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading || connectionError || gameEnded) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage("");
    setIsLoading(true);

    try {
      // Convert messages to chat history format, including the current user message
      const chatHistory = [...messages, userMessage].map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text
      }));

      // Get AI response using LLM
      const llmResponse = await llmService.generateResponse(
        messageToSend, 
        chatHistory, 
        difficulty, 
        playerName,
        character,
        language
      );
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: llmResponse.response,
        sender: 'ai',
        timestamp: new Date(),
        points: llmResponse.score,
        mood: llmResponse.mood
      };

      setMessages(prev => [...prev, aiMessage]);
      setScore(prev => prev + llmResponse.score);
      setMessageCount(prev => prev + 1);
      setCurrentMood(llmResponse.mood);

      toast({
        title: `+${llmResponse.score} points!`,
        description: llmResponse.reasoning,
      });

      // Check win condition
      const newScore = score + llmResponse.score;
      if (newScore >= targetScore) {
        setTimeout(() => {
          handleGameEnd();
        }, 2000);
        return;
      }

      // End game after max messages
      if (messageCount + 1 >= maxMessages) {
        setTimeout(() => {
          handleGameEnd();
        }, 2000);
      }

    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble thinking of a response right now. Let's try again!",
        sender: 'ai',
        timestamp: new Date(),
        points: 1
      };

      setMessages(prev => [...prev, fallbackMessage]);
      setScore(prev => prev + 1);
      setMessageCount(prev => prev + 1);

      toast({
        title: "Connection Issue",
        description: "Using fallback response. Check your API key and connection.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = () => {
    if (isRoastMode) {
      switch (difficulty) {
        case 'chill': return 'bg-yellow-500';
        case 'g-faad': return 'bg-orange-500';
        case 'g-faad-plus': return 'bg-red-600';
        default: return 'bg-red-500';
      }
    }
    switch (difficulty) {
      case 'easy': return 'bg-success';
      case 'medium': return 'bg-secondary';
      case 'hard': return 'bg-accent';
      default: return 'bg-primary';
    }
  };

  const getDifficultyName = () => {
    if (isRoastMode) {
      switch (difficulty) {
        case 'chill': return 'Chill';
        case 'g-faad': return 'G-Faad';
        case 'g-faad-plus': return 'G-Faad++';
        default: return difficulty;
      }
    }
    switch (difficulty) {
      case 'easy': return 'Sweet Talker';
      case 'medium': return 'Smooth Operator';
      case 'hard': return 'Heartbreaker';
      default: return difficulty;
    }
  };

  return (
    <div className={`min-h-screen ${isRoastMode ? 'bg-gradient-savage' : 'bg-gradient-soft'} flex`}>
      {/* Anime Character Panel - Left 30% */}
      <div className="w-[30%] bg-card/50 backdrop-blur-sm border-r border-border/50 flex flex-col">
        {/* Character Header */}
        <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToSetup}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h2 className="text-lg font-bold text-foreground">{playerName}</h2>
              <Badge className={`${getDifficultyColor()} text-white text-xs`}>
                {getDifficultyName()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Anime Character Display */}
        <div className="flex-1 p-4">
          <AnimeCharacter 
            mood={currentMood}
            character={character}
            className="h-full"
          />
        </div>

        {/* Stats Footer */}
        <div className="bg-card/80 backdrop-blur-sm border-t border-border/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-lg font-mono">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Time Left</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-foreground">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="text-lg font-bold">{score}</span>
              <span className="text-sm text-muted-foreground">/{targetScore}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {messageCount}/{maxMessages} msgs
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-foreground">
              <Target className="w-4 h-4 text-success" />
              <span className="text-sm">{Math.round((score/targetScore)*100)}%</span>
            </div>
            <span className="text-xs text-muted-foreground">Progress</span>
          </div>
          {connectionError && (
            <div className="text-destructive text-xs">
              ⚠️ Connection Error
            </div>
          )}
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Chat Area - Right 70% */}
      <div className="flex-1 flex flex-col">{/* Chat Header */}
        <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-romantic bg-clip-text text-transparent">
              {isRoastMode ? (
                <>🔥 Roast Zone 💀</>
              ) : (
                <>💖 Rizz-o-meter ✨</>
              )}
            </h1>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-4">
          <Card className="h-[calc(100vh-160px)] flex flex-col shadow-soft">{/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}>
                      {message.sender === 'user' ? playerName[0].toUpperCase() : (isRoastMode ? '🔥' : '💖')}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    {message.points && (
                      <div className="mt-1 text-right">
                        <Badge variant="secondary" className="text-xs">
                          +{message.points} pts
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">{isRoastMode ? '🔥' : '💖'}</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted text-muted-foreground rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input Area */}
            {messageCount < maxMessages && !gameEnded && timeLeft > 0 && (
              <div className="border-t border-border p-4">
                <div className="flex space-x-2">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder={score >= targetScore ? 
                      (isRoastMode ? "You survived! Keep going or wait for end..." : "You've won! Keep chatting or wait for game end...") : 
                      (isRoastMode ? "Try to survive the roasting..." : "Type your charming message...")
                    }
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={isLoading || score >= targetScore}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!currentMessage.trim() || isLoading || !!connectionError || score >= targetScore}
                    variant={isRoastMode ? "destructive" : "romantic"}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                {score >= targetScore && (
                  <div className="text-center mt-2 text-sm text-success font-medium">
                    {isRoastMode ? "🔥 You survived the roasting! Game ending soon..." : "🎉 Target reached! Game ending soon..."}
                  </div>
                )}
              </div>
            )}
            
            {(gameEnded || timeLeft <= 0) && (
              <div className="border-t border-border p-4 text-center">
                <div className="text-lg font-bold text-foreground mb-2">
                  {score >= targetScore ? "🎉 Congratulations!" : timeLeft <= 0 ? "⏰ Time's Up!" : "🎯 Game Complete!"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Final Score: {score}/{targetScore} points
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}