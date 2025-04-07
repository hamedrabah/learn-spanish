// Script to pre-generate all audio files for the quiz
// Run with: node app/utils/generateAudioFiles.js

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Import quizQuestions directly from the TypeScript file
// We need to use require with .default because it's a TypeScript module
let quizQuestions;
try {
  // Try to import directly (works if ts-node is used)
  quizQuestions = require('../data/quizQuestions').quizQuestions;
} catch (error) {
  // If direct import fails, let's read and parse the file
  console.log('Reading quiz questions from file...');
  
  const quizQuestionsPath = path.join(__dirname, '../data/quizQuestions.ts');
  const fileContent = fs.readFileSync(quizQuestionsPath, 'utf8');
  
  // Extract the questions array using regex
  const questionsMatch = fileContent.match(/export const quizQuestions: QuizQuestion\[\] = \[([\s\S]*)\];/);
  
  if (!questionsMatch) {
    console.error('\x1b[31mFailed to parse quiz questions file.\x1b[0m');
    process.exit(1);
  }
  
  // Create a temporary JS file with the questions array
  const tempJsContent = `module.exports = [${questionsMatch[1]}];`;
  const tempJsPath = path.join(__dirname, 'temp_questions.js');
  fs.writeFileSync(tempJsPath, tempJsContent);
  
  // Now require the temporary file
  try {
    quizQuestions = require('./temp_questions.js');
    console.log(`Successfully loaded ${quizQuestions.length} quiz questions`);
  } catch (error) {
    console.error('\x1b[31mFailed to load quiz questions:\x1b[0m', error.message);
    process.exit(1);
  }
}

// API key - you need to provide this as an environment variable or hardcode for script execution
const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY || 'sk_ce9715a8e9895e1d0e0300f295b1c98890ef9be4f1900e18';

// Voice IDs
const VOICE_IDS = {
  spanishMale: 'tVkOo4DLgZb89qB0x4qP', // LeChuck voice
  playerVoice: 'WOY6pnQ1WCg0mrOZ54lM', // Guybrush voice
};

// Check if API key is set
if (ELEVEN_LABS_API_KEY === 'YOUR_API_KEY_HERE') {
  console.error('\x1b[31mError: Eleven Labs API key not set!\x1b[0m');
  console.log('\x1b[33mSet your API key using:\x1b[0m');
  console.log('  export ELEVEN_LABS_API_KEY=your_key_here');
  console.log('\x1b[33mOr edit the script to include your key directly.\x1b[0m');
  process.exit(1);
}

// Function to create a complete sentence with the answer
const createAnswerSentence = (question, answer) => {
  return question.replace('_____', answer);
};

// Function to generate a safe filename from text
const getSafeFilename = (text, isPlayer) => {
  // Replace spaces and special characters, add player/opponent prefix
  const prefix = isPlayer ? 'player_' : 'opponent_';
  return prefix + text
    .replace(/[^a-z0-9áéíóúñü]/gi, '_')
    .toLowerCase()
    .substring(0, 100) + '.mp3';
};

// Function to generate audio file for a text
async function generateAudioFile(text, isPlayer) {
  console.log(`Generating audio for: ${text} (${isPlayer ? 'Player' : 'Opponent'})`);
  
  const voice_id = isPlayer ? VOICE_IDS.playerVoice : VOICE_IDS.spanishMale;
  
  let voiceSettings = {
    stability: 0.4,           
    similarity_boost: 0.8,    
    style: 0.3,               
    use_speaker_boost: true,
    speech_rate: 0.25         
  };
  
  if (isPlayer) {
    voiceSettings = {
      stability: 0.4,        
      similarity_boost: 0.85, 
      style: 0.3,             
      use_speaker_boost: true,
      speech_rate: 0.35       
    };
  }
  
  try {
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
      const errorText = await response.text();
      if (response.status === 429) {
        throw new Error(`Rate limit exceeded (429). Please wait a while and try again.`);
      } else {
        throw new Error(`Eleven Labs API error (${response.status}): ${errorText}`);
      }
    }
    
    const audioBuffer = await response.buffer();
    const fileName = getSafeFilename(text, isPlayer);
    const filePath = path.join(__dirname, '../../public/audio', fileName);
    
    // Ensure the directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(filePath, audioBuffer);
    console.log(`✓ Saved: ${fileName}`);
    
    return fileName;
  } catch (error) {
    console.error(`\x1b[31mError generating audio for "${text}":\x1b[0m`, error.message);
    
    if (error.message.includes('429')) {
      console.log('\x1b[33mWaiting for 10 seconds due to rate limit...\x1b[0m');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    
    return null;
  }
}

// Function to generate audio for all quiz questions
async function generateAllAudioFiles() {
  console.log('\x1b[36m=== Starting audio generation for all quiz questions ===\x1b[0m');
  
  // Create a manifest to map questions and answers to audio files
  const audioManifest = {
    questions: {},
    answers: {}
  };
  
  // Try to load existing manifest if it exists
  const manifestPath = path.join(__dirname, '../data/audioManifest.json');
  if (fs.existsSync(manifestPath)) {
    try {
      const existingManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      audioManifest.questions = existingManifest.questions || {};
      audioManifest.answers = existingManifest.answers || {};
      console.log('\x1b[33mLoaded existing manifest. Will only generate missing audio files.\x1b[0m');
    } catch (error) {
      console.error('Error loading existing manifest:', error.message);
    }
  }
  
  // Create the public/audio directory if it doesn't exist
  const audioDir = path.join(__dirname, '../../public/audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
    console.log(`Created directory: ${audioDir}`);
  }
  
  let questionCount = 0;
  let answerCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  // Set longer delays to avoid rate limiting
  const QUESTION_DELAY = 2000;  // 2 seconds between questions
  const ANSWER_DELAY = 1500;    // 1.5 seconds between answers
  
  for (const question of quizQuestions) {
    // Skip if we already have this question in the manifest and the file exists
    const existingQuestionFile = audioManifest.questions[question.id];
    const questionFilePath = existingQuestionFile ? 
      path.join(__dirname, '../../public/audio', existingQuestionFile) : null;
    
    if (existingQuestionFile && fs.existsSync(questionFilePath)) {
      console.log(`Skipping existing question: ${question.question}`);
      skipCount++;
    } else {
      // Generate audio for the question (LeChuck's voice)
      const questionFileName = await generateAudioFile(question.question, false);
      if (questionFileName) {
        audioManifest.questions[question.id] = questionFileName;
        questionCount++;
        
        // Save manifest after each successful generation to avoid losing progress
        fs.writeFileSync(manifestPath, JSON.stringify(audioManifest, null, 2));
      } else {
        errorCount++;
      }
      
      // Wait between questions to avoid rate limiting
      console.log(`Waiting ${QUESTION_DELAY/1000} seconds to avoid rate limiting...`);
      await new Promise(resolve => setTimeout(resolve, QUESTION_DELAY));
    }
    
    // Generate audio for each possible answer (Guybrush's voice)
    if (question.options) {
      if (!audioManifest.answers[question.id]) {
        audioManifest.answers[question.id] = {};
      }
      
      for (const option of question.options) {
        // Skip if we already have this answer in the manifest
        if (audioManifest.answers[question.id][option]) {
          const answerFilePath = path.join(
            __dirname, 
            '../../public/audio', 
            audioManifest.answers[question.id][option]
          );
          
          if (fs.existsSync(answerFilePath)) {
            console.log(`Skipping existing answer: ${option}`);
            skipCount++;
            continue;
          }
        }
        
        const answerSentence = createAnswerSentence(question.question, option);
        const answerFileName = await generateAudioFile(answerSentence, true);
        
        if (answerFileName) {
          audioManifest.answers[question.id][option] = answerFileName;
          answerCount++;
          
          // Save manifest after each successful generation
          fs.writeFileSync(manifestPath, JSON.stringify(audioManifest, null, 2));
        } else {
          errorCount++;
        }
        
        // Wait to avoid rate limiting
        console.log(`Waiting ${ANSWER_DELAY/1000} seconds to avoid rate limiting...`);
        await new Promise(resolve => setTimeout(resolve, ANSWER_DELAY));
      }
    }
  }
  
  // Final save of the manifest
  fs.writeFileSync(manifestPath, JSON.stringify(audioManifest, null, 2));
  
  console.log('\n\x1b[36m=== Audio generation complete! ===\x1b[0m');
  console.log(`Generated ${questionCount} question audios and ${answerCount} answer audios.`);
  if (skipCount > 0) {
    console.log(`Skipped ${skipCount} existing audio files.`);
  }
  if (errorCount > 0) {
    console.log(`\x1b[33mEncountered ${errorCount} errors during generation.\x1b[0m`);
  }
  console.log(`Manifest saved to: ${manifestPath}`);
}

// Run the generator
generateAllAudioFiles().catch(error => {
  console.error('\x1b[31mFatal error generating audio files:\x1b[0m', error);
  process.exit(1);
}); 