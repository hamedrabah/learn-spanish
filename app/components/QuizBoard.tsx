'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGameContext } from './GameContext';
import { QuizQuestion } from '../data/quizQuestions';
import audioManifest from '../data/audioManifest.json';
import * as quizImagesModule from '../data/quizImages';
import { getQuizImage } from '../utils/imageUtils';
import styles from '../styles/GameBoard.module.css';
import RepeatIcon from './RepeatIcon';

const QuizBoard: React.FC = () => {
  const {
    currentQuizQuestion,
    correctQuizAnswers,
    totalQuizQuestions,
    currentQuizQuestionIndex,
    quizComplete,
    gameState,
    gameMode,
    playerHealth,
    answerQuizQuestion,
    nextQuizQuestion,
    resetGame
  } = useGameContext();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingText, setCurrentSpeakingText] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentSpeaker, setCurrentSpeaker] = useState<'player' | 'opponent' | null>(null);
  const [spokenTexts, setSpokenTexts] = useState<Set<string>>(new Set());
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [showAudioMissingMessage, setShowAudioMissingMessage] = useState(false);

  // Add refs for sword sound effects
  const swordHitRef = useRef<HTMLAudioElement | null>(null);
  const swordMissRef = useRef<HTMLAudioElement | null>(null);
  const swordDropRef = useRef<HTMLAudioElement | null>(null);
  const swordWinRef = useRef<HTMLAudioElement | null>(null);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrectAnswer(false);
    setIsAnswerSubmitted(false);
    setSpokenTexts(new Set());
    
    // Check if audio is available before attempting to speak
    // Check if we have any entries in the audioManifest
    const hasAudioFiles = Object.keys(audioManifest.questions).length > 0;
    setAudioAvailable(hasAudioFiles);
    setShowAudioMissingMessage(!hasAudioFiles);
    
    // Speak the new question when it changes
    if (currentQuizQuestion) {
      speakText(currentQuizQuestion.question, false);
    }
  }, [currentQuizQuestion]);

  // Initialize background music
  useEffect(() => {
    let mounted = true;
    
    if (typeof window !== 'undefined') {
      // Create audio element
      const audio = new Audio('/song.mp3');
      backgroundMusicRef.current = audio;
      
      // Configure audio
      audio.loop = true;
      audio.volume = 0.15; // Lower background music volume
      
      // Wait a short moment before attempting to play to avoid potential race conditions
      const playTimer = setTimeout(() => {
        if (mounted && audio) {
          audio.play().catch(err => {
            console.error('Failed to play background music:', err);
            setIsMusicPlaying(false);
          });
        }
      }, 1000);
      
      // Clean up function
      return () => {
        mounted = false;
        clearTimeout(playTimer);
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      };
    }
    
    return () => {
      mounted = false;
    };
  }, []);

  // Initialize sound effects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      swordHitRef.current = new Audio('/audio/sword_fight.wav');
      swordMissRef.current = new Audio('/audio/sword_fight.wav');
      swordDropRef.current = new Audio('/audio/sword_drop.wav');
      swordWinRef.current = new Audio('/audio/sword_win.wav');
      
      // Preload sounds
      if (swordHitRef.current) swordHitRef.current.load();
      if (swordMissRef.current) swordMissRef.current.load();
      if (swordDropRef.current) swordDropRef.current.load();
      if (swordWinRef.current) swordWinRef.current.load();
    }
    
    return () => {
      // Cleanup sound effects
      if (swordHitRef.current) {
        swordHitRef.current.pause();
        swordHitRef.current.src = '';
      }
      if (swordMissRef.current) {
        swordMissRef.current.pause();
        swordMissRef.current.src = '';
      }
      if (swordDropRef.current) {
        swordDropRef.current.pause();
        swordDropRef.current.src = '';
      }
      if (swordWinRef.current) {
        swordWinRef.current.pause();
        swordWinRef.current.src = '';
      }
    };
  }, []);

  // Toggle background music
  const toggleBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      if (isMusicPlaying) {
        backgroundMusicRef.current.pause();
      } else {
        backgroundMusicRef.current.play().catch(err => {
          console.error('Failed to play background music:', err);
        });
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  // Helper function to stop all audio
  const stopAllAudio = () => {
    // Stop voice audio
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
      voiceAudioRef.current.src = '';
    }
    
    // Clear any progress intervals
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    // Cancel any Web Speech API utterances (for fallback)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    // Reset state
    setIsSpeaking(false);
    setCurrentSpeakingText(null);
    setCurrentSpeaker(null);
    setAudioProgress(0);
    setAudioDuration(0);
    setIsLoadingVoice(false);
  };

  // Get audio file path for a question
  const getQuestionAudioPath = (questionId: number): string | null => {
    // @ts-ignore - typescript doesn't know the structure of audioManifest
    const fileName = audioManifest.questions[questionId];
    return fileName ? `/audio/${fileName}` : null;
  };

  // Get audio file path for an answer
  const getAnswerAudioPath = (questionId: number, answer: string): string | null => {
    try {
      // @ts-ignore - typescript doesn't know the structure of audioManifest
      const fileName = audioManifest.answers[questionId]?.[answer];
      return fileName ? `/audio/${fileName}` : null;
    } catch (error) {
      console.error('Error getting answer audio path:', error);
      return null;
    }
  };

  // Create a complete sentence with the answer
  const createAnswerSentence = (question: string, answer: string): string => {
    // Replace blank with the answer
    return question.replace('_____', answer);
  };

  // Handle text-to-speech using pre-generated audio files
  const speakText = async (text: string, isPlayer: boolean = false) => {
    // Skip if this text has already been spoken
    if (spokenTexts.has(text)) {
      return Promise.resolve();
    }
    
    // Update UI even if audio is not available
    setCurrentSpeakingText(text);
    setCurrentSpeaker(isPlayer ? 'player' : 'opponent');
    
    // Skip actual audio playback if audio manifest is empty
    if (!audioAvailable || !currentQuizQuestion || Object.keys(audioManifest.questions).length === 0) {
      console.log('Audio files not yet generated. Run the script: node app/utils/generateAudioFiles.js');
      return Promise.resolve();
    }
    
    return new Promise<void>(async (resolveAll, rejectAll) => {
      try {
        // Stop any existing audio
        stopAllAudio();
        
        // Add this text to the set of spoken texts
        setSpokenTexts(prev => new Set(prev).add(text));
        
        setIsLoadingVoice(true);
        setIsSpeaking(true);
        setCurrentSpeakingText(text);
        setCurrentSpeaker(isPlayer ? 'player' : 'opponent');
        
        // Create a temporary audio element if it doesn't exist
        if (!voiceAudioRef.current) {
          voiceAudioRef.current = new Audio();
        } else {
          // Stop any currently playing audio
          voiceAudioRef.current.pause();
          voiceAudioRef.current.currentTime = 0;
        }
        
        // Get the audio file path
        let audioPath: string | null = null;
        
        if (isPlayer) {
          // For player (Guybrush), we're speaking a full answer sentence
          // Find the answer option that matches this sentence
          const options = currentQuizQuestion.options || [];
          for (const option of options) {
            const answerSentence = createAnswerSentence(currentQuizQuestion.question, option);
            if (answerSentence === text) {
              audioPath = getAnswerAudioPath(currentQuizQuestion.id, option);
              break;
            }
          }
        } else {
          // For opponent (LeChuck), we're speaking the question
          audioPath = getQuestionAudioPath(currentQuizQuestion.id);
        }
        
        if (!audioPath) {
          console.error(`No audio file found for: ${text}`);
          throw new Error('Audio file not found');
        }
        
        // Set the audio source and play
        voiceAudioRef.current.src = audioPath;
        // Set volume within the valid range
        voiceAudioRef.current.volume = isPlayer ? 0.8 : 1.0; // Maximum volume for LeChuck within valid range
        
        // Set up event handlers
        voiceAudioRef.current.onended = () => {
          setIsSpeaking(false);
          setCurrentSpeakingText(null);
          setCurrentSpeaker(null);
          setAudioProgress(0);
          setAudioDuration(0);
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          resolveAll(); // Resolve the promise when audio ends
        };
        
        voiceAudioRef.current.onerror = (e) => {
          console.error('Audio playback error:', e);
          setIsSpeaking(false);
          setCurrentSpeakingText(null);
          setCurrentSpeaker(null);
          setAudioProgress(0);
          setAudioDuration(0);
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          rejectAll(new Error('Audio playback error')); // Reject the promise on error
        };
        
        voiceAudioRef.current.onloadedmetadata = () => {
          if (voiceAudioRef.current) {
            setAudioDuration(voiceAudioRef.current.duration);
          }
        };
        
        // Set up timer to update progress
        progressIntervalRef.current = setInterval(() => {
          if (voiceAudioRef.current && !voiceAudioRef.current.paused) {
            setAudioProgress(voiceAudioRef.current.currentTime);
          }
        }, 100);
        
        await voiceAudioRef.current.play();
        
      } catch (error) {
        console.error('Error playing audio:', error);
        setIsSpeaking(false);
        setCurrentSpeakingText(null);
        setCurrentSpeaker(null);
        setIsLoadingVoice(false);
        resolveAll(); // Resolve anyway to not block game flow
      } finally {
        setIsLoadingVoice(false);
      }
    });
  };

  // Function to play sword sound based on answer correctness
  const playSwordSound = (isCorrect: boolean) => {
    try {
      // Get the appropriate sound paths
      const soundPath = isCorrect ? '/audio/sword_fight.wav' : '/audio/sword_fight.wav';
      const resultSoundPath = isCorrect ? '/audio/sword_win.wav' : '/audio/sword_drop.wav';
      
      // Create new Audio objects each time to ensure they can be played multiple times
      const soundRef = new Audio(soundPath);
      const resultSound = new Audio(resultSoundPath);
      
      // Start playing the sword fight sound
      soundRef.play().catch(err => {
        console.error(`Failed to play sword sound:`, err);
      });
      
      // Play the result sound immediately (it will mix with the sword fight sound)
      resultSound.play().catch(err => {
        console.error(`Failed to play result sound:`, err);
      });
    } catch (error) {
      console.error('Error playing sword sound:', error);
    }
  };

  const handleAnswerSelection = (answer: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(answer);
    // Automatically submit the answer when an option is selected
    handleAnswerSubmitWithAnswer(answer);
  };

  // New function to handle submission with a provided answer
  const handleAnswerSubmitWithAnswer = async (answer: string) => {
    if (isAnswerSubmitted || !currentQuizQuestion) return;
    
    // First, speak the complete sentence with Guybrush's voice
    const completeSentence = createAnswerSentence(currentQuizQuestion.question, answer);
    await speakText(completeSentence, true);
    
    // Then check if the answer is correct
    const isCorrect = answerQuizQuestion(answer);
    setIsCorrectAnswer(isCorrect);
    setShowFeedback(true);
    setIsAnswerSubmitted(true);
    
    // Play the appropriate sword sound
    playSwordSound(isCorrect);
    
    // After a short delay, proceed to the next question
    setTimeout(() => {
      setShowFeedback(false);
      nextQuizQuestion();
    }, 2000);
  };

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer || isAnswerSubmitted || !currentQuizQuestion) return;
    await handleAnswerSubmitWithAnswer(selectedAnswer);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.src = '';
      }
    };
  }, []);

  if (gameState === 'win') {
    return (
      <div className={`${styles.introContainer} ${styles.victoryAnimation}`}>
        <h1>¡Excelente!</h1>
        <div className={styles.pirateShip}>
          <div className={styles.shipImage}></div>
        </div>
        <p>Has superado la prueba de español con {correctQuizAnswers} respuestas correctas de {totalQuizQuestions}.</p>
        <button onClick={resetGame} className={styles.actionButton}>
          VOLVER AL MENÚ PRINCIPAL
        </button>
      </div>
    );
  }

  if (gameState === 'lose') {
    return (
      <div className={`${styles.introContainer} ${styles.defeatAnimation}`}>
        <h1>Necesitas Practicar Más</h1>
        <div className={styles.pirateShip}>
          <div className={styles.shipImage}></div>
        </div>
        <p>Solo obtuviste {correctQuizAnswers} respuestas correctas de {totalQuizQuestions}. ¡Sigue estudiando!</p>
        <button onClick={resetGame} className={styles.actionButton}>
          VOLVER AL MENÚ PRINCIPAL
        </button>
      </div>
    );
  }

  if (!currentQuizQuestion) {
    return <div>Cargando pregunta...</div>;
  }

  return (
    <div className={styles.gameContainer}>
      {showAudioMissingMessage && (
        <div style={{ 
          position: 'fixed', 
          top: '10px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          backgroundColor: '#fff3cd', 
          color: '#856404', 
          padding: '10px 15px', 
          borderRadius: '5px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 100,
          maxWidth: '90%',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>🔊 Audio files not generated</p>
          <p style={{ margin: '0', fontSize: '0.9em' }}>
            Run <code>node app/utils/generateAudioFiles.js</code> to generate audio files.
          </p>
        </div>
      )}
      
      <div className={styles.scoreBoard}>
        <div className={styles.playerScore}>
          Correct: {correctQuizAnswers}/{totalQuizQuestions}
        </div>
        <div className={styles.difficultyIndicator}>
          Question {currentQuizQuestionIndex + 1}/{totalQuizQuestions}
        </div>
        <div className={styles.healthBar}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`${styles.heart} ${i < playerHealth ? styles.heartFull : styles.heartEmpty}`}>
              <svg className={styles.heartSvg} viewBox="0 0 10 10">
                <g className={styles.heartPixels}>
                  <rect x="2" y="1" width="2" height="1" />
                  <rect x="6" y="1" width="2" height="1" />
                  <rect x="1" y="2" width="2" height="1" />
                  <rect x="4" y="2" width="2" height="1" />
                  <rect x="7" y="2" width="2" height="1" />
                  <rect x="1" y="3" width="8" height="1" />
                  <rect x="2" y="4" width="6" height="1" />
                  <rect x="3" y="5" width="4" height="1" />
                  <rect x="4" y="6" width="2" height="1" />
                </g>
              </svg>
            </div>
          ))}
        </div>
        <div className={styles.opponentScore}>
          <button
            onClick={toggleBackgroundMusic}
            className={`${styles.iconButton} ${styles.muteButton}`}
            aria-label={isMusicPlaying ? "Mute music" : "Play music"}
          >
            <img
              src={isMusicPlaying ? "/images/sound.svg" : "/images/mute.svg"}
              alt={isMusicPlaying ? "Sound on" : "Sound off"}
            />
          </button>
        </div>
      </div>

      <div className={styles.duelScene}>
        <div className={styles.shipBackground}></div>
        <div className={styles.shipDeck}></div>

        <div className={`${styles.character} ${styles.player} ${isAnswerSubmitted ? (isCorrectAnswer ? styles.attack : styles.hit) : styles.idle}`}
             style={{ left: '30%', marginLeft: '0px', bottom: '30px' }}>
          <div className={styles.characterImage}>
          </div>
          <div className={styles.sword}></div>
        </div>

        <div className={styles.quizContentContainer}>
          <div className={styles.quizQuestionContainer}>
            <div className={styles.quizQuestion}>
              <h2>LeChuck pregunta:</h2>
              <p className={styles.questionText}>{currentQuizQuestion.question}</p>
              
              {showFeedback && (
                <div className={isCorrectAnswer ? styles.correctFeedback : styles.incorrectFeedback}>
                  <p>{isCorrectAnswer ? '¡Correcto!' : '¡Incorrecto!'}</p>
                  {!isCorrectAnswer && (
                    <p>La respuesta correcta es: {currentQuizQuestion.correctAnswer}</p>
                  )}
                </div>
              )}

              {currentSpeaker === 'player' && currentSpeakingText && (
                <div className={styles.playerSpeaking}>
                  <p>{currentSpeakingText}</p>
                </div>
              )}
              
              {/* Only show opponent speaking when it's not the same as the current question */}
              {currentSpeaker === 'opponent' && currentSpeakingText && 
                currentSpeakingText !== currentQuizQuestion.question && (
                <div className={styles.opponentSpeaking}>
                  <p>{currentSpeakingText}</p>
                </div>
              )}
            </div>
          </div>

          {/* Vocabulary Box - Display the appropriate 16-bit art */}
          {currentQuizQuestion && (
            <div className={`${styles.vocabularyBox} ${
              isAnswerSubmitted ? (isCorrectAnswer ? styles.correct : styles.incorrect) : ''
            }`}>
              <div className={styles.vocabularyBoxContent}>
                {/* Using getQuizImage to always have an appropriate image */}
                {(() => {
                  const quizImage = getQuizImage(currentQuizQuestion);
                  return (
                    <img 
                      src={quizImage.imageSrc} 
                      alt={quizImage.altText}
                      width={quizImage.width}
                      height={quizImage.height}
                      style={{
                        imageRendering: 'pixelated',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        <div className={`${styles.character} ${styles.opponent} ${isAnswerSubmitted ? (isCorrectAnswer ? styles.hit : styles.attack) : styles.idle}`}
             style={{ left: '55%', marginLeft: '0px', bottom: '30px' }}>
          <div className={styles.characterImage}>
          </div>
          <div className={styles.sword}></div>
        </div>
      </div>

      <div className={styles.responseContainer}>
        <div className={styles.translationToggle}>
          <RepeatIcon 
            onClick={() => {
              if (currentQuizQuestion) {
                // Remove the current question from spoken texts so it can be spoken again
                const updatedSpokenTexts = new Set(spokenTexts);
                updatedSpokenTexts.delete(currentQuizQuestion.question);
                setSpokenTexts(updatedSpokenTexts);
                
                // Speak the question again with LeChuck's voice
                speakText(currentQuizQuestion.question, false);
              }
            }} 
            className={styles.repeatIcon}
          />
        </div>

        <div className={styles.quizAnswers}>
          {currentQuizQuestion.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelection(option)}
              className={`${styles.responseButton} ${selectedAnswer === option ? styles.selectedAnswer : ''}`}
              disabled={isAnswerSubmitted || isSpeaking}
            >
              <p>{option}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizBoard;