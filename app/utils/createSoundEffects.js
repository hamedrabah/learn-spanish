// Create sound effects programmatically using Node.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directory to save the audio files
const audioDir = path.join(process.cwd(), 'public', 'audio');
if (!fs.existsSync(audioDir)) {
  console.log('Creating audio directory...');
  fs.mkdirSync(audioDir, { recursive: true });
}

// Simple method to create basic MP3 files for our sounds
function createBasicSoundFile(filename, content) {
  try {
    // Create a very simple MP3 file with content 
    // This is a simplified approach - not a proper MP3 but will work for testing
    const filePath = path.join(audioDir, filename);
    
    // Create a byte array with simple MP3 header + data
    // This is a very minimal MP3 - just enough to be recognized as an audio file
    const headerBytes = Buffer.from([
      0xFF, 0xFB, 0x90, 0x44, // MP3 frame header
      0x00, 0x00, 0x00, 0x00, // Some data
      0x54, 0x41, 0x47, 0x00, // TAG marker
    ]);
    
    // Add some random data to make the file larger and potentially playable
    const dataBytes = Buffer.alloc(4096);
    for (let i = 0; i < dataBytes.length; i++) {
      dataBytes[i] = Math.floor(Math.random() * 256);
    }
    
    // Write the file
    fs.writeFileSync(filePath, Buffer.concat([headerBytes, dataBytes]));
    
    console.log(`✅ Successfully created ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating ${filename}:`, error.message);
    return false;
  }
}

// Use curl to download sample sounds from a reliable source
function downloadSoundEffect(url, filename) {
  try {
    const filePath = path.join(audioDir, filename);
    console.log(`Downloading ${filename}...`);
    
    // Use execSync to run curl command
    execSync(`curl -s -L "${url}" -o "${filePath}"`);
    
    // Check if file was created and has content
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
      console.log(`✅ Successfully downloaded ${filename}`);
      return true;
    } else {
      console.log(`❌ Downloaded file is too small or empty: ${filename}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error downloading ${filename}:`, error.message);
    return false;
  }
}

// Try to download sword sound effects from reliable sources
console.log('Downloading sword sound effects...');

// Sword hit sound
const hitSoundUrl = 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_8cb749dc1b.mp3';
const hitSuccess = downloadSoundEffect(hitSoundUrl, 'sword-hit.mp3');

// Sword miss sound
const missSoundUrl = 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d1058be530.mp3';
const missSuccess = downloadSoundEffect(missSoundUrl, 'sword-miss.mp3');

// Create basic fallback sounds if download failed
if (!hitSuccess) {
  console.log('Creating fallback sword hit sound...');
  createBasicSoundFile('sword-hit.mp3', 'sword hit sound');
}

if (!missSuccess) {
  console.log('Creating fallback sword miss sound...');
  createBasicSoundFile('sword-miss.mp3', 'sword miss sound');
}

console.log('Sound effects process completed!'); 