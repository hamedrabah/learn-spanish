'use client';

import { GameProvider } from './components/GameContext';
import GameBoard from './components/GameBoard';
import QuizBoard from './components/QuizBoard';
import { useEffect, useState } from 'react';

export default function Home() {
  // Use client-side rendering for the game mode selection
  const [mounted, setMounted] = useState(false);
  
  // After initial render, mark component as mounted
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <main>
      <GameProvider>
        {/* Conditionally render the appropriate game board */}
        {mounted ? (
          <>
            {/* The GameBoard component now includes the intro screen with mode selection */}
            {/* It will forward to QuizBoard when quiz mode is selected */}
            <GameModeSelector />
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Cargando...</p>
          </div>
        )}
      </GameProvider>
    </main>
  );
}

// This component decides which game board to show based on the selected mode
function GameModeSelector() {
  const { gameMode, gameState } = require('./components/GameContext').useGameContext();
  
  // For intro screen and duel mode, show GameBoard
  if (gameState === 'intro' || gameMode === 'duel') {
    return <GameBoard />;
  }
  
  // For quiz mode, show QuizBoard
  if (gameMode === 'quiz') {
    return <QuizBoard />;
  }
  
  // Fallback
  return <GameBoard />;
} 