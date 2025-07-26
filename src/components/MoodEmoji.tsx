import { useEffect, useState } from "react";

interface MoodEmojiProps {
  mood: 'neutral' | 'happy' | 'impressed' | 'unimpressed' | 'annoyed';
  className?: string;
}

const moodEmojis = {
  neutral: '😐',
  happy: '😊',
  impressed: '😍',
  unimpressed: '🙄',
  annoyed: '😤'
};

const moodDescriptions = {
  neutral: 'Waiting to see what you got...',
  happy: 'Not bad, keep going!',
  impressed: 'Wow, that was good!',
  unimpressed: 'Come on, you can do better...',
  annoyed: 'Really? That\'s your best shot?'
};

export function MoodEmoji({ mood, className = "" }: MoodEmojiProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentMood, setCurrentMood] = useState(mood);

  useEffect(() => {
    if (mood !== currentMood) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentMood(mood);
        setIsAnimating(false);
      }, 150);
    }
  }, [mood, currentMood]);

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <div 
        className={`text-4xl transition-all duration-300 ${
          isAnimating ? 'scale-0 rotate-90' : 'scale-100 rotate-0'
        } ${
          mood === 'impressed' ? 'animate-pulse' : 
          mood === 'annoyed' ? 'animate-bounce' : 
          mood === 'happy' ? 'hover-scale' : ''
        }`}
      >
        {moodEmojis[currentMood]}
      </div>
      <div className={`text-xs text-center text-muted-foreground transition-opacity duration-300 ${
        isAnimating ? 'opacity-0' : 'opacity-100'
      }`}>
        {moodDescriptions[currentMood]}
      </div>
    </div>
  );
}