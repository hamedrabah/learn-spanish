'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGameContext } from './GameContext';
import styles from '../styles/GameBoard.module.css';

const GameBoard: React.FC = () => {
  const {
    playerScore,
    opponentScore,
    currentPhrase,
    availableResponses,
    gameState,
    showTranslation,
    difficulty,
    gameMode,
    playerHealth,
    selectResponse,
    toggleTranslation,
    nextDuel,
    resetGame,
    startGame
  } = useGameContext();

  const [playerAnimation, setPlayerAnimation] = useState('idle');
  const [opponentAnimation, setOpponentAnimation] = useState('idle');
  const [showVictoryAnimation, setShowVictoryAnimation] = useState(false);
  const [showDefeatAnimation, setShowDefeatAnimation] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectResponse, setIsCorrectResponse] = useState(false);
  const [selectedResponseId, setSelectedResponseId] = useState<number | null>(null);
  const [currentPlayerResponse, setCurrentPlayerResponse] = useState<number | null>(null);
  const [hideResponses, setHideResponses] = useState(false);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [currentSpeakingText, setCurrentSpeakingText] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentSpeaker, setCurrentSpeaker] = useState<'player' | 'opponent' | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Use environment variable if available, otherwise fallback to provided key
  const ELEVEN_LABS_API_KEY = process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY || 'YOUR_ELEVEN_LABS_API_KEY_HERE';
  
  // Add a state to track if TTS is available
  const [ttsAvailable, setTtsAvailable] = useState(true);
  
  // Track which texts have already been spoken
  const [spokenTexts, setSpokenTexts] = useState<Set<string>>(new Set());
  
  // Cache for audio blobs to avoid repeated API calls
  const [audioCache, setAudioCache] = useState<{[key: string]: Blob}>({});
  const [isCacheLoading, setIsCacheLoading] = useState(false);
  const [cacheProgress, setCacheProgress] = useState(0);
  const [totalCacheItems, setTotalCacheItems] = useState(0);
  
  // Add state for mode selection in the intro screen
  const [selectedMode, setSelectedMode] = useState<'duel' | 'quiz'>('duel');
  
  // Add refs for sword sound effects
  const swordHitRef = useRef<HTMLAudioElement | null>(null);
  const swordMissRef = useRef<HTMLAudioElement | null>(null);
  const swordDropRef = useRef<HTMLAudioElement | null>(null);
  const swordWinRef = useRef<HTMLAudioElement | null>(null);
  
  // Reset spoken texts when game state changes
  useEffect(() => {
    if (gameState === 'playerTurn') {
      setSpokenTexts(new Set());
      setCurrentPlayerResponse(null);
    }
  }, [gameState]);
  
  // Spanish voice IDs from Eleven Labs
  const VOICE_IDS = {
    spanishMale: 'tVkOo4DLgZb89qB0x4qP', // LeChuck voice
    playerVoice: 'WOY6pnQ1WCg0mrOZ54lM', // Guybrush voice - updated ID
  };
  
  // Helper function to get all required dialogue texts
  const getAllDialogueTexts = () => {
    const allTexts: {text: string, isPlayer: boolean}[] = [];
    
    // Add standard messages
    allTexts.push({text: '¡Victoria! ¡Eres el maestro de español!', isPlayer: false});
    allTexts.push({text: 'Has perdido. ¡Practica más tu español!', isPlayer: false});
    
    // Add all available responses
    availableResponses.forEach(response => {
      allTexts.push({text: response.response, isPlayer: true});
    });
    
    // Add all insults if we have currentPhrase data
    if (currentPhrase) {
      allTexts.push({text: currentPhrase.insult, isPlayer: false});
    }
    
    return allTexts;
  };

  // Function to pre-fetch all audio for dialogues
  const preloadAudioCache = async () => {
    if (!ttsAvailable) return;
    
    try {
      setIsCacheLoading(true);
      const allTexts = getAllDialogueTexts();
      setTotalCacheItems(allTexts.length);
      setCacheProgress(0);
      
      // Use a local cache to build up before setting state
      const newCache: {[key: string]: Blob} = {...audioCache};
      
      for (let i = 0; i < allTexts.length; i++) {
        const {text, isPlayer} = allTexts[i];
        
        // Skip if already in cache
        const cacheKey = `${text}_${isPlayer ? 'player' : 'opponent'}`;
        if (newCache[cacheKey]) {
          setCacheProgress(prev => prev + 1);
          continue;
        }
        
        // Prepare voice settings
        const voice_id = isPlayer ? VOICE_IDS.playerVoice : VOICE_IDS.spanishMale;
        let voiceSettings = {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
          speech_rate: 0.4
        };
        
        // Apply more pirate-y and flamboyant voice settings for Guybrush (player)
        if (isPlayer) {
          voiceSettings = {
            stability: 0.35,
            similarity_boost: 0.85,
            style: 0.4,
            use_speaker_boost: true,
            speech_rate: 0.45
          };
        }
        
        // Make the API call
        const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': ELEVEN_LABS_API_KEY
          },
          body: JSON.stringify({
            text: text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: voiceSettings
          })
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Invalid Eleven Labs API key - disabling TTS');
            setTtsAvailable(false);
            setIsCacheLoading(false);
            return;
          }
          throw new Error(`Eleven Labs API error: ${response.status}`);
        }
        
        // Store the blob in our cache
        const audioBlob = await response.blob();
        newCache[cacheKey] = audioBlob;
        
        // Update progress
        setCacheProgress(i + 1);
      }
      
      // Update the cache state
      setAudioCache(newCache);
      console.log(`Cached ${Object.keys(newCache).length} audio items`);
      
    } catch (error) {
      console.error('Error preloading audio cache:', error);
    } finally {
      setIsCacheLoading(false);
    }
  };
  
  // Preload cache when the game starts or when responses change
  useEffect(() => {
    if (gameState !== 'intro' && ttsAvailable) {
      preloadAudioCache();
    }
  }, [gameState, availableResponses, currentPhrase, ttsAvailable]);
  
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

  // Handle text-to-speech using Eleven Labs API - modified to use cache
  const speakText = async (text: string, isSpanish: boolean = true, isPlayer: boolean = false) => {
    // Skip if this text has already been spoken
    if (spokenTexts.has(text)) {
      return Promise.resolve();
    }
    
    // Skip if TTS is not available
    if (!ttsAvailable) {
      // Just update the dialogue text without attempting to speak
      setCurrentSpeakingText(text);
      setCurrentSpeaker(isPlayer ? 'player' : 'opponent');
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
        
        // Check if this text is in our cache
        const cacheKey = `${text}_${isPlayer ? 'player' : 'opponent'}`;
        let audioBlob: Blob;
        let audioUrl: string;
        
        if (audioCache[cacheKey]) {
          console.log(`Using cached audio for: ${text}`);
          audioBlob = audioCache[cacheKey];
          audioUrl = URL.createObjectURL(audioBlob);
        } else {
          // Prepare API request to Eleven Labs if not in cache
          console.log(`No cache found for: ${text}, making API call`);
          const voice_id = isPlayer ? VOICE_IDS.playerVoice : VOICE_IDS.spanishMale;
          console.log(`Using voice ID: ${voice_id} for ${isPlayer ? 'player' : 'opponent'}`);
          const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`;
          
          // Create voice settings based on character
          let voiceSettings = {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
            speech_rate: 0.4 // Even slower speech rate (was 0.5)
          };
          
          // Apply more pirate-y and flamboyant voice settings for Guybrush (player)
          if (isPlayer) {
            voiceSettings = {
              stability: 0.35, // Less stability for more character/variation
              similarity_boost: 0.85, // Higher similarity boost
              style: 0.4, // Add more stylistic variation
              use_speaker_boost: true,
              speech_rate: 0.45 // Slightly faster to add excitement
            };
          }
          
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'xi-api-key': ELEVEN_LABS_API_KEY
            },
            body: JSON.stringify({
              text: text,
              model_id: 'eleven_multilingual_v2',
              voice_settings: voiceSettings
            })
          });
          
          if (!response.ok) {
            // If unauthorized, disable TTS for future calls
            if (response.status === 401) {
              console.error('Invalid Eleven Labs API key - disabling TTS');
              setTtsAvailable(false);
            }
            throw new Error(`Eleven Labs API error: ${response.status}`);
          }
          
          // Convert the response to a blob
          audioBlob = await response.blob();
          audioUrl = URL.createObjectURL(audioBlob);
          
          // Save to cache for future use
          setAudioCache(prev => ({...prev, [cacheKey]: audioBlob}));
        }
        
        // Set the audio source and play
        voiceAudioRef.current.src = audioUrl;
        // Set volume to maximum for dialogue
        voiceAudioRef.current.volume = 1.0;
        
        // Set up event handlers
        voiceAudioRef.current.onended = () => {
          URL.revokeObjectURL(audioUrl);
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
        
        voiceAudioRef.current.onerror = () => {
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
        console.error('Error using Eleven Labs TTS:', error);
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

  // Animation effect for attacks
  useEffect(() => {
    let isMounted = true;
    
    const handleGameStateChange = async () => {
      if (gameState === 'playerTurn') {
        setOpponentAnimation('taunt');
        setPlayerAnimation('idle');
        
        // Speak the opponent's insult
        if (currentPhrase && isMounted) {
          try {
            // Wait a bit before speaking to let animations settle
            await new Promise(resolve => setTimeout(resolve, 500));
            if (isMounted) {
              await speakText(currentPhrase.insult, true, false);
            }
          } catch (err) {
            console.error('Error speaking opponent insult:', err);
          }
        }
      } else if (gameState === 'opponentTurn') {
        // Don't reset animations if we're still speaking
        if (!isSpeaking) {
          setPlayerAnimation('defend');
          setTimeout(() => {
            if (isMounted) {
              setOpponentAnimation('attack');
            }
          }, 500);
        }
      } else if (gameState === 'win' && isMounted) {
        setShowVictoryAnimation(true);
        try {
          await speakText('¡Victoria! ¡Eres el maestro de español!', true, false);
        } catch (err) {
          console.error('Error speaking victory message:', err);
        }
      } else if (gameState === 'lose' && isMounted) {
        setShowDefeatAnimation(true);
        try {
          await speakText('Has perdido. ¡Practica más tu español!', true, false);
        } catch (err) {
          console.error('Error speaking defeat message:', err);
        }
      }
    };
    
    handleGameStateChange();
    
    // Cleanup function to handle component unmounting during speech
    return () => {
      isMounted = false;
    };
  }, [gameState, currentPhrase, isSpeaking]);

  // Add a console log to help debug
  useEffect(() => {
    console.log("Current game state:", gameState);
    console.log("Current player response:", currentPlayerResponse);
    console.log("Current speaker:", currentSpeaker);
    console.log("Current speaking text:", currentSpeakingText);
  }, [gameState, currentPlayerResponse, currentSpeaker, currentSpeakingText]);

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
  
  // Function to play sword sound based on response correctness
  const playSwordSound = (isCorrect: boolean) => {
    try {
      // Use the sword fight sound for both hit and miss
      const soundRef = isCorrect ? swordHitRef.current : swordMissRef.current;
      const resultSound = isCorrect ? swordWinRef.current : swordDropRef.current;
      
      if (soundRef && resultSound) {
        // Start the sword fight sound
        soundRef.currentTime = 0;
        
        // Start playing the sword fight sound
        soundRef.play().catch(err => {
          console.error(`Failed to play sword sound:`, err);
        });
        
        // Play the result sound immediately (it will mix with the sword fight sound)
        resultSound.currentTime = 0;
        resultSound.play().catch(err => {
          console.error(`Failed to play result sound:`, err);
        });
      }
    } catch (error) {
      console.error('Error playing sword sound:', error);
    }
  };

  const handleResponseClick = async (responseId: number, responseText: string) => {
    // Disable response buttons during speaking (handled by the button disabled prop)
    
    // Save the selected response ID and hide other options
    setSelectedResponseId(responseId);
    setCurrentPlayerResponse(responseId);
    setHideResponses(true);
    
    // Set player attack animation
    setPlayerAnimation('attack');
    
    try {
      // Speak the player's response and WAIT until it completes
      await speakText(responseText, true, true);
      
      // After speech completes, trigger opponent defense animation
      setOpponentAnimation('defend');
      
      // Check if the response is correct
      const isCorrect = currentPhrase && currentPhrase.correctResponse === responseId;
      setIsCorrectResponse(!!isCorrect);
      setShowFeedback(true);
      
      // Play the appropriate sword sound
      playSwordSound(!!isCorrect);
      
      // Wait a bit then select the response to proceed with game flow
      setTimeout(() => {
        // Hide feedback and proceed with the game
        setShowFeedback(false);
        selectResponse(responseId);
        
        // Reset selectedResponseId but NOT currentPlayerResponse
        setTimeout(() => {
          setHideResponses(false);
          setSelectedResponseId(null);
          // Do NOT reset currentPlayerResponse here
        }, 500);
      }, 2000);
    } catch (error) {
      console.error('Error speaking player response:', error);
      
      // If there's an error, still proceed with game flow
      setOpponentAnimation('defend');
      
      // Check if the response is correct
      const isCorrect = currentPhrase && currentPhrase.correctResponse === responseId;
      setIsCorrectResponse(!!isCorrect);
      setShowFeedback(true);
      
      // Play the appropriate sword sound even if speech failed
      playSwordSound(!!isCorrect);
      
      setTimeout(() => {
        // Hide feedback and proceed with the game
        setShowFeedback(false);
        selectResponse(responseId);
        
        // Reset selectedResponseId but NOT currentPlayerResponse
        setTimeout(() => {
          setHideResponses(false);
          setSelectedResponseId(null);
          // Do NOT reset currentPlayerResponse here
        }, 500);
      }, 2000);
    }
  };

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

  // Initialize background music
  useEffect(() => {
    if (typeof window !== 'undefined') {
      backgroundMusicRef.current = new Audio('/song.mp3');
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.loop = true;
        backgroundMusicRef.current.volume = 0.15; // Lower background music volume
        backgroundMusicRef.current.play().catch(err => {
          console.error('Failed to play background music:', err);
          setIsMusicPlaying(false);
        });
      }
    }
    
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.src = '';
      }
    };
  }, []);

  // Cleanup the interval and audio resources on component unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.src = '';
      }
    };
  }, []);

  if (gameState === 'intro') {
    return (
      <div className={styles.introContainer}>
        <div className={styles.pirateShip}>
          <div className={styles.shipImage}></div>
        </div>
        <h1>Duelos de Esgrima en Español</h1>
        <p>¡Bienvenido a Isla Mêlée! Desafía a los piratas a duelos de ingenio en español.</p>
        
        {/* Mode Selection Cards */}
        <div className={styles.modeIndicator}>
          <div 
            className={`${styles.modeCard} ${selectedMode === 'duel' ? styles.selected : ''}`}
            onClick={() => setSelectedMode('duel')}
          >
            <h3>Duelo de Insultos</h3>
            <p>Gana respondiendo correctamente a los insultos con la réplica perfecta.</p>
          </div>
          
          <div 
            className={`${styles.modeCard} ${selectedMode === 'quiz' ? styles.selected : ''}`}
            onClick={() => setSelectedMode('quiz')}
          >
            <h3>Modo Examen</h3>
            <p>LeChuck pondrá a prueba tu conocimiento de español con preguntas para completar.</p>
          </div>
        </div>
        
        {/* Conditional rendering of difficulty or lesson selection */}
        {selectedMode === 'duel' ? (
          <div className={styles.difficultySelection}>
            <h2>Selecciona tu nivel de dificultad:</h2>
            <button onClick={() => startGame('beginner', 'duel')} className={styles.difficultyButton}>
              Principiante
            </button>
            <button onClick={() => startGame('intermediate', 'duel')} className={styles.difficultyButton}>
              Intermedio
            </button>
            <button onClick={() => startGame('advanced', 'duel')} className={styles.difficultyButton}>
              Avanzado
            </button>
          </div>
        ) : (
          <div className={styles.difficultySelection}>
            <h2>Selecciona una lección:</h2>
            <button onClick={() => startGame('lesson1', 'quiz')} className={styles.difficultyButton}>
              Lección 1: Artículos Definidos (el, la, los, las)
            </button>
            <button onClick={() => startGame('lesson2', 'quiz')} className={styles.difficultyButton}>
              Lección 2: Artículos Indefinidos (un, una, unos, unas)
            </button>
            <button onClick={() => startGame('lesson3', 'quiz')} className={styles.difficultyButton}>
              Lección 3: Colores en Español
            </button>
            <button onClick={() => startGame('lesson4', 'quiz')} className={styles.difficultyButton}>
              Lección 4: Adjetivos
            </button>
          </div>
        )}
      </div>
    );
  }

  if (gameState === 'win') {
    return (
      <div className={`${styles.resultContainer} ${showVictoryAnimation ? styles.victoryAnimation : ''}`}>
        <h1>¡Victoria!</h1>
        <div className={styles.victoryPirate}>
          <div className={styles.victoryImage}></div>
        </div>
        <p>¡Has vencido a LeChuck en un duelo de ingenio en español!</p>
        <button onClick={resetGame} className={styles.actionButton}>
          Volver a la Taberna Scumm
        </button>
      </div>
    );
  }

  if (gameState === 'lose') {
    return (
      <div className={`${styles.resultContainer} ${showDefeatAnimation ? styles.defeatAnimation : ''}`}>
        <h1>Derrota</h1>
        <div className={styles.defeatPirate}>
          <div className={styles.defeatImage}></div>
        </div>
        <p>¡Tus habilidades en español necesitan más práctica antes de convertirte en un poderoso pirata!</p>
        <button onClick={resetGame} className={styles.actionButton}>
          Volver a la Taberna Scumm
        </button>
      </div>
    );
  }

  return (
    <div className={styles.gameContainer}>
      <div className={styles.scoreBoard}>
        <div className={styles.playerScore}>
          Score: {playerScore}
        </div>
        <div className={styles.difficultyIndicator}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
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
          Score: {opponentScore}
        </div>
      </div>

      <div className={styles.duelScene}>
        <div className={styles.shipBackground}></div>
        <div className={styles.shipDeck}></div>

        <div className={`${styles.character} ${styles.player} ${styles[playerAnimation]}`}
             style={{ left: '30%', marginLeft: '0px', bottom: '30px' }}>
          <div className={styles.characterImage}>
          </div>
          <div className={styles.sword}></div>
        </div>

        {/* Replace individual dialogue bubbles with a centered dialogue area at the top */}
        <div className={styles.duelDialog} style={{ display: 'flex', top: '300px', position: 'absolute', width: '100%', textAlign: 'center' }}>
          {/* Player speaking */}
          {((currentSpeaker === 'player') || (currentPlayerResponse !== null && currentSpeaker !== 'opponent')) && (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)', margin: '0', padding: '0 20px' }}>
                {currentSpeaker === 'player' && currentSpeakingText 
                  ? currentSpeakingText 
                  : availableResponses.find(r => r.id === currentPlayerResponse)?.response || ''}
              </p>
              {showTranslation && currentPlayerResponse !== null && (
                <p style={{ fontSize: '1.4rem', color: '#d0d0d0', marginTop: '5px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                  {availableResponses.find(r => r.id === currentPlayerResponse)?.translation || ''}
                </p>
              )}
            </div>
          )}
          
          {/* Opponent speaking */}
          {((currentSpeaker === 'opponent' && currentSpeakingText) || (gameState === 'playerTurn' && currentPhrase)) && (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#ff9966', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)', margin: '0', padding: '0 20px' }}>
                {currentSpeaker === 'opponent' && currentSpeakingText 
                  ? currentSpeakingText 
                  : currentPhrase?.insult}
              </p>
              {showTranslation && currentPhrase && (
                <p style={{ fontSize: '1.4rem', color: '#d0d0d0', marginTop: '5px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                  {currentPhrase.translation}
                </p>
              )}
            </div>
          )}
        </div>

        <div className={`${styles.character} ${styles.opponent} ${styles[opponentAnimation]}`}
             style={{ left: '55%', marginLeft: '0px', bottom: '30px' }}>
          <div className={styles.characterImage}>
          </div>
          <div className={styles.sword}></div>
        </div>
      </div>

      <div className={styles.responseContainer}>
        <div className={styles.translationToggle}>
          <button onClick={toggleTranslation} className={styles.toggleButton}>
            {showTranslation ? "Ocultar Traducciones" : "Mostrar Traducciones"}
          </button>
          <button onClick={() => {
            if (currentPhrase) {
              // Remove the current insult from spoken texts so it can be spoken again
              const updatedSpokenTexts = new Set(spokenTexts);
              updatedSpokenTexts.delete(currentPhrase.insult);
              setSpokenTexts(updatedSpokenTexts);
              
              // Speak the opponent's insult again
              speakText(currentPhrase.insult, true, false);
            }
          }} className={styles.stopButton}>
            Repetir Insulto
          </button>
          {isCacheLoading && (
            <span className={styles.loadingIndicator}>
              Cargando audio: {cacheProgress}/{totalCacheItems}
            </span>
          )}
          {isSpeaking && voiceAudioRef.current && voiceAudioRef.current.duration > 0 && (
            <span className={styles.loadingIndicator}>
              {currentSpeaker === 'player' ? 'Guybrush (Pirata Extravagante)' : 'LeChuck'} hablando: {Math.round(audioProgress)}/{Math.round(audioDuration)}s
            </span>
          )}
        </div>

        <div className={styles.responses}>
          {!hideResponses && availableResponses.map((response) => (
            <button
              key={response.id}
              onClick={() => handleResponseClick(response.id, response.response)}
              className={styles.responseButton}
              disabled={gameState !== 'playerTurn' || isSpeaking}
            >
              <p>{response.response}</p>
              {showTranslation && <p className={styles.responseTranslation}>{response.translation}</p>}
            </button>
          ))}
          
          {showFeedback && selectedResponseId !== null && (
            <div className={styles.feedbackContainer}>
              {isCorrectResponse ? (
                <div className={styles.correctFeedback}>
                  <span>✓</span>
                  <p>¡Correcto!</p>
                </div>
              ) : (
                <div className={styles.incorrectFeedback}>
                  <span>✗</span>
                  <p>Incorrecto</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameBoard; 