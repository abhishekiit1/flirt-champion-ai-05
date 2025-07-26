import { useState } from "react";
import ModeSelection from "@/components/ModeSelection";
import CharacterSelection from "@/components/CharacterSelection";
import RoastModeSetup from "@/components/RoastModeSetup";
import ChatGame from "@/components/ChatGame";
import Leaderboard from "@/components/Leaderboard";
import heroImage from "@/assets/hero-bg.jpg";

type GameState = 'mode-selection' | 'character-selection' | 'roast-setup' | 'playing' | 'leaderboard';

interface Player {
  name: string;
  score: number;
  difficulty: string;
  timestamp: Date;
  apiKey?: string;
  gameResult?: any;
  character?: any;
  mode?: 'rizz' | 'roast';
  language?: 'english' | 'hinglish';
}

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('mode-selection');
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [selectedMode, setSelectedMode] = useState<'rizz' | 'roast' | null>(null);

  const handleModeSelection = (mode: 'rizz' | 'roast') => {
    setSelectedMode(mode);
    if (mode === 'rizz') {
      setGameState('character-selection');
    } else {
      setGameState('roast-setup');
    }
  };

  const handleRizzStartGame = (playerName: string, difficulty: string, apiKey: string, character: any, language: 'english' | 'hinglish') => {
    setCurrentPlayer({
      name: playerName,
      score: 0,
      difficulty,
      timestamp: new Date(),
      apiKey,
      character,
      mode: 'rizz',
      language
    });
    setGameState('playing');
  };

  const handleRoastStartGame = (playerName: string, difficulty: string, apiKey: string, language: 'english' | 'hinglish') => {
    setCurrentPlayer({
      name: playerName,
      score: 0,
      difficulty,
      timestamp: new Date(),
      apiKey,
      mode: 'roast',
      language
    });
    setGameState('playing');
  };

  const handleGameEnd = (finalScore: number, gameResult?: any) => {
    if (currentPlayer) {
      setCurrentPlayer({
        ...currentPlayer,
        score: finalScore,
        timestamp: new Date(),
        gameResult
      });
    }
    setGameState('leaderboard');
  };

  const handlePlayAgain = () => {
    setGameState('mode-selection');
    setCurrentPlayer(null);
    setSelectedMode(null);
  };

  const handleBackToSetup = () => {
    setGameState('mode-selection');
    setCurrentPlayer(null);
    setSelectedMode(null);
  };

  const handleViewLeaderboard = () => {
    setGameState('leaderboard');
  };

  if (gameState === 'character-selection') {
    return (
      <CharacterSelection
        onStartGame={handleRizzStartGame}
        onBack={() => setGameState('mode-selection')}
      />
    );
  }

  if (gameState === 'roast-setup') {
    return (
      <RoastModeSetup
        onStartGame={handleRoastStartGame}
        onBack={() => setGameState('mode-selection')}
      />
    );
  }

  if (gameState === 'playing' && currentPlayer && currentPlayer.apiKey) {
    return (
      <ChatGame
        playerName={currentPlayer.name}
        difficulty={currentPlayer.difficulty}
        apiKey={currentPlayer.apiKey}
        character={currentPlayer.character}
        mode={currentPlayer.mode}
        language={currentPlayer.language}
        onGameEnd={handleGameEnd}
        onBackToSetup={handleBackToSetup}
      />
    );
  }

  if (gameState === 'leaderboard') {
    return (
      <Leaderboard
        currentPlayer={currentPlayer}
        onPlayAgain={handlePlayAgain}
        onBackToSetup={handleBackToSetup}
      />
    );
  }

  return (
    <>
      <ModeSelection onSelectMode={handleModeSelection} />
      
      {/* Floating leaderboard button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleViewLeaderboard}
          className="bg-gradient-passionate text-white px-6 py-3 rounded-full shadow-passionate hover:scale-105 transition-bounce font-medium"
        >
          🏆 View Leaderboard
        </button>
      </div>
    </>
  );
};

export default Index;