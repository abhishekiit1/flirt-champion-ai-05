import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AnimeCharacterProps {
  mood: 'neutral' | 'happy' | 'impressed' | 'unimpressed' | 'annoyed' | 'thinking';
  character: any;
  className?: string;
}

type EmotionState = {
  expression: string;
  pose: string;
  effect: string;
  description: string;
};

const emotionStates: Record<string, EmotionState> = {
  neutral: {
    expression: "🙂",
    pose: "standing",
    effect: "",
    description: "Waiting to see what you've got..."
  },
  happy: {
    expression: "😊",
    pose: "smiling",
    effect: "glow",
    description: "Not bad! Keep going!"
  },
  impressed: {
    expression: "😍",
    pose: "excited",
    effect: "sparkle",
    description: "Wow! That was amazing!"
  },
  unimpressed: {
    expression: "🙄",
    pose: "skeptical",
    effect: "fade",
    description: "Come on, you can do better..."
  },
  annoyed: {
    expression: "😤",
    pose: "crossed-arms",
    effect: "shake",
    description: "Really? That's your best shot?"
  },
  thinking: {
    expression: "🤔",
    pose: "pondering",
    effect: "pulse",
    description: "Hmm, let me think about this..."
  }
};

export default function AnimeCharacter({ mood, character, className }: AnimeCharacterProps) {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionState>(emotionStates.neutral);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (emotionStates[mood] && emotionStates[mood] !== currentEmotion) {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentEmotion(emotionStates[mood]);
        setIsTransitioning(false);
      }, 200);
    }
  }, [mood, currentEmotion]);

  const getCharacterImage = () => {
    if (!character?.image) return null;
    return character.image;
  };

  const getPoseClasses = () => {
    const baseClasses = "transition-all duration-500 ease-in-out";
    
    switch (currentEmotion.pose) {
      case "excited":
        return `${baseClasses} transform scale-105 rotate-1`;
      case "skeptical":
        return `${baseClasses} transform scale-95 -rotate-1`;
      case "crossed-arms":
        return `${baseClasses} transform scale-100 rotate-0 saturate-75`;
      case "pondering":
        return `${baseClasses} transform scale-98 rotate-0 blur-[0.5px]`;
      case "smiling":
        return `${baseClasses} transform scale-102 rotate-0 brightness-110`;
      default:
        return `${baseClasses} transform scale-100 rotate-0`;
    }
  };

  const getEffectClasses = () => {
    switch (currentEmotion.effect) {
      case "glow":
        return "shadow-lg shadow-primary/20 drop-shadow-lg";
      case "sparkle":
        return "shadow-xl shadow-accent/30 drop-shadow-xl animate-pulse";
      case "fade":
        return "opacity-75 grayscale-[0.3]";
      case "shake":
        return "animate-bounce";
      case "pulse":
        return "animate-pulse opacity-90";
      default:
        return "";
    }
  };

  const getBackgroundEffect = () => {
    switch (currentEmotion.effect) {
      case "sparkle":
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-accent rounded-full animate-ping"
                style={{
                  left: `${20 + (i * 15)}%`,
                  top: `${30 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        );
      case "glow":
        return (
          <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent rounded-full pointer-events-none" />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("relative w-full h-full flex flex-col items-center justify-center", className)}>
      {/* Background Effects */}
      {getBackgroundEffect()}
      
      {/* Character Container */}
      <div className="relative z-10 flex flex-col items-center space-y-4">
        {/* Character Image */}
        <div 
          className={cn(
            "relative w-32 h-32 rounded-full overflow-hidden border-4 border-border/20",
            getPoseClasses(),
            getEffectClasses(),
            isTransitioning && "opacity-50 scale-90"
          )}
        >
          {getCharacterImage() ? (
            <img 
              src={getCharacterImage()} 
              alt={character?.name || "Character"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-romantic flex items-center justify-center">
              <span className="text-4xl text-white">
                {character?.name?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
          )}
          
          {/* Emotion Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div 
              className={cn(
                "text-2xl transition-all duration-300",
                isTransitioning ? "scale-0 rotate-180" : "scale-100 rotate-0"
              )}
            >
              {currentEmotion.expression}
            </div>
          </div>
        </div>

        {/* Character Name */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-foreground">
            {character?.name || "Character"}
          </h3>
        </div>

        {/* Emotion Description */}
        <div 
          className={cn(
            "text-center px-4 py-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 transition-all duration-300",
            isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          )}
        >
          <p className="text-sm text-muted-foreground">
            {currentEmotion.description}
          </p>
        </div>

        {/* Mood Indicator Dots */}
        <div className="flex space-x-2">
          {Object.keys(emotionStates).map((emotionKey) => (
            <div
              key={emotionKey}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                mood === emotionKey 
                  ? "bg-primary scale-125" 
                  : "bg-muted-foreground/30 scale-100"
              )}
            />
          ))}
        </div>
      </div>

      {/* Animated Particles for Special Moods */}
      {(mood === 'impressed' || mood === 'happy') && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-1 h-1 rounded-full animate-bounce",
                mood === 'impressed' ? "bg-accent" : "bg-primary"
              )}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}