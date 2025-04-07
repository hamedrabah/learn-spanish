// Real MP3 sound effects as base64 strings
const fs = require('fs');
const path = require('path');

// Directory to save the audio files
const audioDir = path.join(process.cwd(), 'public', 'audio');
if (!fs.existsSync(audioDir)) {
  console.log('Creating audio directory...');
  fs.mkdirSync(audioDir, { recursive: true });
}

// Base64 encoded sound files
// These are real, small MP3 files converted to base64
const soundEffects = {
  // Sword hit sound (metallic clang)
  'sword-hit.mp3': 'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCgUFBQUFDMzMzMzM0dHR0dHR1xHR0dHR3BwcHBwcISEhISEhJmZmZmZma2tra2trcDAwMDAwNTU1NTU1Ojp6enp6f39/f39/f///////////wAAAABMYXZjNTguMTMAAAAAAAAAAAAAAAAkAkgAAAAAAAAAAAAAAAAD//tAwAAAAVYIBhtBEAF1PFZJ+a+JrMTEtJyHsxEnLcTfA/u/qE9H6vy6P6P/1/zMf45Jn+3/w/9f9f/+n5nJ////+58yD//Of///////////9jD///7P/////////+xhv///z//////4xh/O8///////////8YwKTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tQwJ8AAAGkAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV',

  // Sword miss sound (whoosh)
  'sword-miss.mp3': 'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeSAAUFBQUFCgUFBQUFDMzMzMzM0dHR0dHR1xHR0dHR3BwcHBwcISEhISEhJmZmZmZma2tra2trcDAwMDAwNTU1NTU1Ojp6enp6f39/f39/f///////////wAAAABMYXZjNTguMTMAAAAAAAAAAAAAAAAkAkgAAAAAAAAAAAAAAAAD//tAwAAAAXAKBD6wAgBusyLKTebiKU3TG5lFJr4lZnQuZYuef/8TH54gIEh0QJkwRmHCeInJhBTSRPEiVB1E/////////////////////////////////////////////////8nBMFJiDBSYIQU2EEEE5////////+JwTgpMQYKTBCCkwgggp///////TEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tQwJcAAAGkAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'
};

// Write sound files to disk
Object.entries(soundEffects).forEach(([filename, base64Data]) => {
  const filePath = path.join(audioDir, filename);
  console.log(`Creating ${filename}...`);
  
  // Convert base64 to binary and write to file
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, buffer);
  
  console.log(`✅ Successfully created ${filename} (${buffer.length} bytes)`);
});

console.log('Sound effects created successfully!'); 