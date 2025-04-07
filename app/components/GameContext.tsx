'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { phrases, responses, DuelPhrase, DuelResponse } from '../data/phrases';
import { quizQuestions, QuizQuestion } from '../data/quizQuestions';

interface GameContextType {
  currentLevel: number;
  playerScore: number;
  opponentScore: number;
  currentPhrase: DuelPhrase | null;
  availableResponses: DuelResponse[];
  gameState: 'intro' | 'playing' | 'playerTurn' | 'opponentTurn' | 'win' | 'lose';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'lesson1' | 'lesson2' | 'lesson3' | 'lesson4';
  showTranslation: boolean;
  gameMode: 'duel' | 'quiz';
  currentQuizQuestion: QuizQuestion | null;
  correctQuizAnswers: number;
  totalQuizQuestions: number;
  currentQuizQuestionIndex: number;
  quizComplete: boolean;
  playerHealth: number;
  
  startGame: (difficulty: 'beginner' | 'intermediate' | 'advanced' | 'lesson1' | 'lesson2' | 'lesson3' | 'lesson4', mode: 'duel' | 'quiz') => void;
  selectResponse: (responseId: number) => void;
  nextDuel: () => void;
  toggleTranslation: () => void;
  resetGame: () => void;
  answerQuizQuestion: (answer: string) => boolean;
  nextQuizQuestion: () => void;
  decreaseHealth: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState<DuelPhrase | null>(null);
  const [availableResponses, setAvailableResponses] = useState<DuelResponse[]>([]);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'playerTurn' | 'opponentTurn' | 'win' | 'lose'>('intro');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | 'lesson1' | 'lesson2' | 'lesson3' | 'lesson4'>('beginner');
  const [showTranslation, setShowTranslation] = useState(false);
  const [gameMode, setGameMode] = useState<'duel' | 'quiz'>('duel');
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState<QuizQuestion | null>(null);
  const [correctQuizAnswers, setCorrectQuizAnswers] = useState(0);
  const [totalQuizQuestions, setTotalQuizQuestions] = useState(10);
  const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState(0);
  const [quizQuestionSet, setQuizQuestionSet] = useState<QuizQuestion[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [playerHealth, setPlayerHealth] = useState(3);

  const getRandomPhrase = (level: 'beginner' | 'intermediate' | 'advanced' | 'lesson1' | 'lesson2' | 'lesson3' | 'lesson4'): DuelPhrase => {
    // For lessons, default to beginner difficulty for duels
    const duelLevel = level.startsWith('lesson') ? 'beginner' : level as 'beginner' | 'intermediate' | 'advanced';
    const levelPhrases = phrases.filter(phrase => phrase.difficulty === duelLevel);
    return levelPhrases[Math.floor(Math.random() * levelPhrases.length)];
  };

  const getRandomResponses = (correctResponseId: number, count: number = 3): DuelResponse[] => {
    const correctResponse = responses.find(r => r.id === correctResponseId)!;
    const otherResponses = responses.filter(r => r.id !== correctResponseId);
    
    // Randomly select other responses
    const shuffled = [...otherResponses].sort(() => 0.5 - Math.random());
    const selectedResponses = shuffled.slice(0, count - 1);
    
    // Add correct response and shuffle again
    const result = [...selectedResponses, correctResponse].sort(() => 0.5 - Math.random());
    return result;
  };

  const prepareQuizQuestions = (level: 'beginner' | 'intermediate' | 'advanced' | 'lesson1' | 'lesson2' | 'lesson3' | 'lesson4', count: number = 10) => {
    let filteredQuestions: QuizQuestion[] = [];
    
    // Map lessons to specific categories and question types
    if (level === 'lesson1') {
      // Lesson 1: Definite Articles (el, la, los, las) - IDs 1-5
      filteredQuestions = quizQuestions.filter(q => 
        q.category === 'articles' && q.id >= 1 && q.id <= 5);
    } 
    else if (level === 'lesson2') {
      // Lesson 2: Indefinite Articles (un, una, unos, unas) - IDs 6-10
      filteredQuestions = quizQuestions.filter(q => 
        q.category === 'articles' && q.id >= 6 && q.id <= 10);
    }
    else if (level === 'lesson3') {
      // Lesson 3: Colors in Spanish - IDs 11-20
      filteredQuestions = quizQuestions.filter(q => 
        q.category === 'colors');
    }
    else if (level === 'lesson4') {
      // Lesson 4: Adjectives - IDs 21-30
      filteredQuestions = quizQuestions.filter(q => 
        q.category === 'adjectives');
    }
    else {
      // Legacy difficulty-based filtering
      filteredQuestions = quizQuestions.filter(q => q.difficulty === level);
    }
    
    // Randomly select questions
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length));
    
    setQuizQuestionSet(selectedQuestions);
    setTotalQuizQuestions(selectedQuestions.length);
    setCurrentQuizQuestionIndex(0);
    setCorrectQuizAnswers(0);
    setQuizComplete(false);
    
    if (selectedQuestions.length > 0) {
      setCurrentQuizQuestion(selectedQuestions[0]);
    } else {
      setCurrentQuizQuestion(null);
    }
  };

  const startGame = (level: 'beginner' | 'intermediate' | 'advanced' | 'lesson1' | 'lesson2' | 'lesson3' | 'lesson4', mode: 'duel' | 'quiz' = 'duel') => {
    setDifficulty(level);
    setPlayerScore(0);
    setOpponentScore(0);
    setCurrentLevel(1);
    setShowTranslation(false);
    setGameMode(mode);
    setPlayerHealth(3); // Reset player health to 3 when starting a new game
    
    if (mode === 'duel') {
      // Set game state first to ensure the state change in nextDuel() isn't overwritten
      setGameState('playing');
      
      // Then set up the first duel
      const phrase = getRandomPhrase(level);
      setCurrentPhrase(phrase);
      setAvailableResponses(getRandomResponses(phrase.correctResponse));
      setGameState('playerTurn');
    } else if (mode === 'quiz') {
      // Prepare quiz questions
      prepareQuizQuestions(level);
      setGameState('playing');
    }
  };

  const nextDuel = () => {
    const phrase = getRandomPhrase(difficulty);
    setCurrentPhrase(phrase);
    setAvailableResponses(getRandomResponses(phrase.correctResponse));
    setGameState('playerTurn');
  };

  const selectResponse = (responseId: number) => {
    if (!currentPhrase) return;
    
    if (responseId === currentPhrase.correctResponse) {
      // Player wins this duel
      setPlayerScore(prev => prev + 1);
      
      if (playerScore + 1 >= 3) {
        // Player wins the game
        setGameState('win');
      } else {
        nextDuel();
      }
    } else {
      // Opponent wins this duel
      setOpponentScore(prev => prev + 1);
      
      if (opponentScore + 1 >= 3) {
        // Opponent wins the game
        setGameState('lose');
      } else {
        nextDuel();
      }
    }
  };

  const answerQuizQuestion = (answer: string): boolean => {
    if (!currentQuizQuestion) return false;
    
    const isCorrect = currentQuizQuestion.correctAnswer === answer;
    
    if (isCorrect) {
      setCorrectQuizAnswers(prev => prev + 1);
    } else {
      // Decrease health when answer is wrong
      decreaseHealth();
    }
    
    return isCorrect;
  };

  const nextQuizQuestion = () => {
    const nextIndex = currentQuizQuestionIndex + 1;
    setCurrentQuizQuestionIndex(nextIndex);
    
    if (nextIndex < quizQuestionSet.length) {
      setCurrentQuizQuestion(quizQuestionSet[nextIndex]);
    } else {
      // Quiz is complete
      setQuizComplete(true);
      setCurrentQuizQuestion(null);
      
      // Set win/lose based on score
      const passThreshold = Math.ceil(totalQuizQuestions * 0.6); // 60% correct to pass
      if (correctQuizAnswers >= passThreshold) {
        setGameState('win');
      } else {
        setGameState('lose');
      }
    }
  };

  const toggleTranslation = () => {
    setShowTranslation(prev => !prev);
  };

  const resetGame = () => {
    setGameState('intro');
    setPlayerScore(0);
    setOpponentScore(0);
    setCurrentLevel(1);
    setCurrentPhrase(null);
    setAvailableResponses([]);
    setCurrentQuizQuestion(null);
    setQuizQuestionSet([]);
    setCorrectQuizAnswers(0);
    setCurrentQuizQuestionIndex(0);
    setQuizComplete(false);
    setPlayerHealth(3); // Reset player health
  };

  const decreaseHealth = () => {
    setPlayerHealth(prev => Math.max(0, prev - 1));
    
    // Check if player has lost all health
    if (playerHealth <= 1) {
      setGameState('lose');
    }
  };

  return (
    <GameContext.Provider 
      value={{
        currentLevel,
        playerScore,
        opponentScore,
        currentPhrase,
        availableResponses,
        gameState,
        difficulty,
        showTranslation,
        gameMode,
        currentQuizQuestion,
        correctQuizAnswers,
        totalQuizQuestions,
        currentQuizQuestionIndex,
        quizComplete,
        playerHealth,
        startGame,
        selectResponse,
        nextDuel,
        toggleTranslation,
        resetGame,
        answerQuizQuestion,
        nextQuizQuestion,
        decreaseHealth
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}; 