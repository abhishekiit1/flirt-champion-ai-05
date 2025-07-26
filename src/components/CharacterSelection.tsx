import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Users, User, Settings } from "lucide-react";
import ApiKeySettings, { getStoredApiKey } from "@/components/ApiKeySettings";
import { toast } from "@/hooks/use-toast";

// Import character images
import mayaGirl from "@/assets/characters/maya-girl.jpg";
import kaiBoy from "@/assets/characters/kai-boy.jpg";
import alexGirl from "@/assets/characters/alex-girl.jpg";
import alexBoy from "@/assets/characters/alex-boy.jpg";
import jordanGirl from "@/assets/characters/jordan-girl.jpg";
import jordanBoy from "@/assets/characters/jordan-boy.jpg";

interface Character {
  id: string;
  name: string;
  personality: string;
  difficulty: string;
  image: string;
  description: string;
}

const characters: Record<'girl' | 'boy', Character[]> = {
  girl: [
    {
      id: 'maya-girl',
      name: 'Maya',
      personality: 'Sweet & Bubbly',
      difficulty: 'easy',
      image: mayaGirl,
      description: 'Giggles at your jokes, loves rom-coms, blushes easily ✨'
    },
    {
      id: 'alex-girl',
      name: 'Alexandra',
      personality: 'Witty & Confident',
      difficulty: 'medium',
      image: alexGirl,
      description: 'Sharp tongue, appreciates intelligence, loves banter 💜'
    },
    {
      id: 'jordan-girl',
      name: 'Jordan',
      personality: 'Sarcastic Genius',
      difficulty: 'hard',
      image: jordanGirl,
      description: 'Razor-sharp wit, impossibly high standards, literary queen 🖤'
    }
  ],
  boy: [
    {
      id: 'kai-boy',
      name: 'Kai',
      personality: 'Gentle & Sweet',
      difficulty: 'easy',
      image: kaiBoy,
      description: 'Warm smile, loves deep talks, genuine romantic 💙'
    },
    {
      id: 'alex-boy',
      name: 'Alexander',
      personality: 'Cool & Clever',
      difficulty: 'medium',
      image: alexBoy,
      description: 'Quick wit, pop culture master, challenges you back 🤍'
    },
    {
      id: 'jordan-boy',
      name: 'Jordan',
      personality: 'Mysterious Intellect',
      difficulty: 'hard',
      image: jordanBoy,
      description: 'Dark humor, literary references, brutally honest 🖤'
    }
  ]
};

interface CharacterSelectionProps {
  onStartGame: (playerName: string, difficulty: string, apiKey: string, character: Character, language: 'english' | 'hinglish') => void;
  onBack: () => void;
}

const CharacterSelection = ({ onStartGame, onBack }: CharacterSelectionProps) => {
  const [selectedGender, setSelectedGender] = useState<'girl' | 'boy' | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
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
    if (!selectedCharacter) {
      toast({
        title: "Character required",
        description: "Please select a character to chat with.",
      });
      return;
    }

    if (!playerName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to start the game.",
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

    onStartGame(playerName.trim(), selectedCharacter.difficulty, keyToUse, selectedCharacter, selectedLanguage);
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

  if (!selectedGender) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="absolute top-6 left-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="absolute top-6 right-6">
            <ApiKeySettings onApiKeySet={handleApiKeyUpdate} />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Crush
          </h1>
          <p className="text-xl text-muted-foreground">
            Who would you like to chat with?
          </p>
        </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer transition-bounce hover:scale-105 hover:shadow-romantic border-2 hover:border-primary"
              onClick={() => setSelectedGender('girl')}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-romantic rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Girls</h3>
                <p className="text-muted-foreground">Chat with anime girls</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer transition-bounce hover:scale-105 hover:shadow-romantic border-2 hover:border-primary"
              onClick={() => setSelectedGender('boy')}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-dreamy rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Boys</h3>
                <p className="text-muted-foreground">Chat with anime boys</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedGender(null)}
            className="absolute top-6 left-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="absolute top-6 right-6">
            <ApiKeySettings onApiKeySet={handleApiKeyUpdate} />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Character
          </h1>
          <p className="text-xl text-muted-foreground">
            Each character has a unique personality and difficulty level
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {characters[selectedGender].map((character) => (
            <Card 
              key={character.id}
              className={`cursor-pointer transition-bounce hover:scale-105 ${
                selectedCharacter?.id === character.id 
                  ? 'ring-2 ring-primary shadow-romantic' 
                  : 'hover:shadow-soft'
              }`}
              onClick={() => setSelectedCharacter(character)}
            >
              <CardContent className="p-6">
                <div className="aspect-[3/4] mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={character.image} 
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{character.name}</h3>
                <p className="text-primary font-semibold mb-2">{character.personality}</p>
                <p className="text-sm text-muted-foreground mb-3">{character.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    character.difficulty === 'easy' ? 'bg-success/20 text-success' :
                    character.difficulty === 'medium' ? 'bg-secondary/20 text-secondary' :
                    'bg-destructive/20 text-destructive'
                  }`}>
                    {character.difficulty.toUpperCase()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedCharacter && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-2xl font-bold text-center text-foreground mb-4">
                Ready to chat with {selectedCharacter.name}?
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
                      className="text-primary"
                    />
                    <span className="text-foreground">🇺🇸 English</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value="hinglish"
                      checked={selectedLanguage === 'hinglish'}
                      onChange={(e) => setSelectedLanguage(e.target.value as 'english' | 'hinglish')}
                      className="text-primary"
                    />
                    <span className="text-foreground">🇮🇳 Hinglish</span>
                  </label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="playerName">Your Name</Label>
                <Input
                  id="playerName"
                  type="text"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="mt-1"
                />
              </div>
              
              {!hasStoredApiKey && (
                <div>
                  <Label htmlFor="apiKey">Gemini API Key (Optional)</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your Gemini API key or use settings"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Get your free API key from Google AI Studio or save it permanently using API Settings above
                  </p>
                </div>
              )}
              
              {hasStoredApiKey && (
                <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-success">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Using Saved API Key</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your API key is stored and ready to use
                  </p>
                </div>
              )}
              
              <Button 
                onClick={handleStartGame}
                disabled={!playerName.trim() || (!hasStoredApiKey && !apiKey.trim())}
                className="w-full bg-gradient-romantic hover:opacity-90 text-white font-semibold py-3 mt-6"
                size="lg"
              >
                Start Chatting with {selectedCharacter.name}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CharacterSelection;