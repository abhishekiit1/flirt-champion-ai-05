import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Flame, Zap, Skull, Settings } from "lucide-react";
import roastBotImage from "@/assets/characters/roast-bot.jpg";
import ApiKeySettings, { getStoredApiKey } from "@/components/ApiKeySettings";
import { toast } from "@/hooks/use-toast";

interface RoastDifficulty {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  intensity: string;
}

const roastDifficulties: RoastDifficulty[] = [
  {
    id: 'chill',
    name: 'Chill',
    description: 'Decent roasting with mild language - perfect for beginners',
    icon: <Flame className="w-8 h-8" />,
    color: 'bg-yellow-500',
    intensity: 'Light roasting'
  },
  {
    id: 'g-faad',
    name: 'G-Faad',
    description: 'Moderate roasting with some Hinglish cuss words - bring your thick skin',
    icon: <Zap className="w-8 h-8" />,
    color: 'bg-orange-500',
    intensity: 'Medium heat'
  },
  {
    id: 'g-faad-plus',
    name: 'G-Faad++',
    description: 'BRUTAL roasting with heavy Hinglish abuse - you have been warned!',
    icon: <Skull className="w-8 h-8" />,
    color: 'bg-red-600',
    intensity: 'MAXIMUM DAMAGE'
  }
];

interface RoastModeSetupProps {
  onStartGame: (playerName: string, difficulty: string, apiKey: string, language: 'english' | 'hinglish') => void;
  onBack: () => void;
}

const RoastModeSetup = ({ onStartGame, onBack }: RoastModeSetupProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'hinglish'>('english');
  const [playerName, setPlayerName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [hasStoredApiKey, setHasStoredApiKey] = useState(false);

  useEffect(() => {
    const storedKey = getStoredApiKey();
    if (storedKey) {
      setApiKey(storedKey);
      setHasStoredApiKey(true);
    }
  }, []);

  const handleStartGame = () => {
    if (!selectedDifficulty) {
      toast({
        title: "Difficulty required",
        description: "Please select your destruction level.",
      });
      return;
    }

    if (!playerName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name so Savage knows who to roast.",
      });
      return;
    }

    // Check for stored API key first
    let keyToUse = apiKey.trim();
    if (!keyToUse) {
      const storedKey = getStoredApiKey();
      if (storedKey) {
        keyToUse = storedKey;
      } else {
        toast({
          title: "API Key required",
          description: "Please enter your Gemini API key or save one in settings.",
        });
        return;
      }
    }

    onStartGame(playerName.trim(), selectedDifficulty, keyToUse, selectedLanguage);
  };

  const handleApiKeyUpdate = (newApiKey: string) => {
    setApiKey(newApiKey);
    setHasStoredApiKey(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStartGame();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-savage p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="absolute top-6 left-6 text-red-200 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="absolute top-6 right-6">
            <ApiKeySettings onApiKeySet={handleApiKeyUpdate} />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            🔥 ROAST ZONE 🔥
          </h1>
          <p className="text-xl text-red-200 mb-2">
            Choose your level of destruction
          </p>
          <p className="text-sm text-red-300">
            Warning: This bot has no filter and will roast you mercilessly!
          </p>
        </div>

        {/* Roast Bot Character Card */}
        <Card className="mb-8 bg-black/50 border-red-500 border-2">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-red-500">
                <img 
                  src={roastBotImage} 
                  alt="Roast Bot"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <h2 className="text-3xl font-bold text-white mb-2">Savage</h2>
                <p className="text-red-400 font-semibold mb-2">The Roast Master</p>
                <p className="text-red-200 text-sm">
                  "I speak both English and Hinglish, and I'll destroy you in both languages 😈"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roastDifficulties.map((difficulty) => (
            <Card 
              key={difficulty.id}
              className={`cursor-pointer transition-all hover:scale-105 border-2 ${
                selectedDifficulty === difficulty.id 
                  ? 'ring-4 ring-red-500 border-red-500 shadow-roast bg-red-950/50' 
                  : 'border-red-800 hover:border-red-600 bg-black/30'
              }`}
              onClick={() => setSelectedDifficulty(difficulty.id)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${difficulty.color}`}>
                  {difficulty.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{difficulty.name}</h3>
                <p className="text-red-300 text-sm mb-3">{difficulty.description}</p>
                <div className="text-xs text-red-400 font-semibold">
                  {difficulty.intensity}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Game Setup Form */}
        {selectedDifficulty && (
          <Card className="max-w-2xl mx-auto bg-black/70 border-red-500">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-2xl font-bold text-center text-white mb-4">
                Ready to get roasted by Savage?
              </h3>
              
              <div>
                <Label>Language Preference</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value="english"
                      checked={selectedLanguage === 'english'}
                      onChange={(e) => setSelectedLanguage(e.target.value as 'english' | 'hinglish')}
                      className="text-red-400"
                    />
                    <span className="text-red-200">🇺🇸 English Roasts</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value="hinglish"
                      checked={selectedLanguage === 'hinglish'}
                      onChange={(e) => setSelectedLanguage(e.target.value as 'english' | 'hinglish')}
                      className="text-red-400"
                    />
                    <span className="text-red-200">🇮🇳 Hinglish Roasts</span>
                  </label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="playerName" className="text-red-200">Your Name (Victim)</Label>
                <Input
                  id="playerName"
                  type="text"
                  placeholder="Enter your name (so I know who to roast)"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="mt-1 bg-black/50 border-red-800 text-white placeholder-red-400"
                />
              </div>
              
              {!hasStoredApiKey && (
                <div>
                  <Label htmlFor="apiKey" className="text-red-200">Gemini API Key (Optional)</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your Gemini API key or use settings"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="mt-1 bg-black/50 border-red-800 text-white placeholder-red-400"
                  />
                  <p className="text-xs text-red-400 mt-1">
                    Get your free API key from Google AI Studio or save it permanently using API Settings above
                  </p>
                </div>
              )}
              
              {hasStoredApiKey && (
                <div className="bg-green-900/30 border border-green-700 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-green-400">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Using Saved API Key</span>
                  </div>
                  <p className="text-xs text-green-300 mt-1">
                    Your API key is stored and ready for destruction
                  </p>
                </div>
              )}
              
              <Button 
                onClick={handleStartGame}
                disabled={!playerName.trim() || (!hasStoredApiKey && !apiKey.trim())}
                className="w-full bg-gradient-roast hover:opacity-90 text-white font-bold py-3 mt-6 text-lg"
                size="lg"
              >
                🔥 Enter the Roast Zone 🔥
              </Button>
              
              <p className="text-center text-xs text-red-300 mt-2">
                Last chance to back out... this bot shows no mercy!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RoastModeSetup;