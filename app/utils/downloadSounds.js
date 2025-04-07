// Script to download sound effects from Freesound.org
const fs = require('fs');
const path = require('path');
const https = require('https');
const fetch = require('node-fetch');

// Freesound API configuration
// Register at https://freesound.org/apiv2/apply/ to get a client ID
const FREESOUND_CLIENT_ID = process.env.FREESOUND_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';

// Define the sounds to download with their Freesound IDs
const SOUNDS = [
  {
    id: '568169', // Sword Clash by Merrick079
    filename: 'sword-hit.mp3',
    description: 'Victory sword clash sound'
  },
  {
    id: '59992', // Sword Swing by qubodup
    filename: 'sword-miss.mp3',
    description: 'Sword miss/flail sound'
  }
];

// Alternative sounds if the main ones fail
const ALTERNATIVE_SOUNDS = [
  {
    id: '439538', // Alternative Sword Hit
    filename: 'sword-hit.mp3',
    description: 'Alternative victory sword clash sound'
  },
  {
    id: '445958', // Alternative Swoosh
    filename: 'sword-miss.mp3',
    description: 'Alternative sword miss/flail sound'
  }
];

// Create the audio directory if it doesn't exist
const audioDir = path.join(process.cwd(), 'public', 'audio');
if (!fs.existsSync(audioDir)) {
  console.log('Creating audio directory...');
  fs.mkdirSync(audioDir, { recursive: true });
}

/**
 * Download a file from a URL to the specified path
 */
async function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
}

/**
 * Directly download specified sound files without API authentication
 * This uses direct URLs to the sound previews
 */
async function downloadSoundsDirectly() {
  console.log('Starting direct download of sound effects...');
  
  // Direct preview URLs (accessible without authentication)
  const directUrls = {
    'sword-hit.mp3': 'https://cdn.freesound.org/previews/568/568169_7962599-hq.mp3',
    'sword-miss.mp3': 'https://cdn.freesound.org/previews/59/59992_123072-hq.mp3'
  };
  
  for (const [filename, url] of Object.entries(directUrls)) {
    try {
      const filePath = path.join(audioDir, filename);
      console.log(`Downloading ${filename} from ${url}...`);
      await downloadFile(url, filePath);
      console.log(`✅ Successfully downloaded ${filename}`);
    } catch (error) {
      console.error(`❌ Error downloading ${filename}: ${error.message}`);
      
      // Try alternative URLs if available
      if (filename === 'sword-hit.mp3') {
        try {
          console.log('Trying alternative sword hit sound...');
          await downloadFile('https://cdn.freesound.org/previews/439/439538_4256189-hq.mp3', path.join(audioDir, filename));
          console.log(`✅ Successfully downloaded alternative ${filename}`);
        } catch (altError) {
          console.error(`❌ Error downloading alternative ${filename}: ${altError.message}`);
        }
      } else if (filename === 'sword-miss.mp3') {
        try {
          console.log('Trying alternative sword miss sound...');
          await downloadFile('https://cdn.freesound.org/previews/445/445958_9158296-hq.mp3', path.join(audioDir, filename));
          console.log(`✅ Successfully downloaded alternative ${filename}`);
        } catch (altError) {
          console.error(`❌ Error downloading alternative ${filename}: ${altError.message}`);
        }
      }
    }
  }
  
  console.log('Done downloading sound effects!');
}

/**
 * Download sounds from Freesound.org using API authentication
 * Use this method if direct download fails or if you need better customization
 */
async function downloadSoundsWithAPI() {
  if (!FREESOUND_CLIENT_ID || FREESOUND_CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
    console.error('Please set your Freesound Client ID first!');
    console.error('1. Register at https://freesound.org/apiv2/apply/');
    console.error('2. Update the FREESOUND_CLIENT_ID in this file or set it as an environment variable');
    process.exit(1);
  }

  console.log('Starting to download sound effects from Freesound.org API...');

  for (const sound of SOUNDS) {
    try {
      console.log(`Fetching info for sound ${sound.id} (${sound.description})...`);
      
      // Get the sound details from the API
      const soundResponse = await fetch(
        `https://freesound.org/apiv2/sounds/${sound.id}/?fields=previews&token=${FREESOUND_CLIENT_ID}`
      );
      
      if (!soundResponse.ok) {
        throw new Error(`API responded with status ${soundResponse.status}`);
      }
      
      const soundData = await soundResponse.json();
      
      // Get the preview MP3 URL
      const mp3Url = soundData.previews['preview-hq-mp3'];
      if (!mp3Url) {
        throw new Error('Could not find MP3 preview URL');
      }
      
      // Download the file
      const filePath = path.join(audioDir, sound.filename);
      console.log(`Downloading ${sound.filename} from ${mp3Url}...`);
      await downloadFile(mp3Url, filePath);
      
      console.log(`✅ Successfully downloaded ${sound.filename}`);
    } catch (error) {
      console.error(`❌ Error downloading ${sound.filename}: ${error.message}`);
      
      // Try alternative sound
      const altSound = ALTERNATIVE_SOUNDS.find(s => s.filename === sound.filename);
      if (altSound) {
        try {
          console.log(`Trying alternative sound ${altSound.id} (${altSound.description})...`);
          
          const altSoundResponse = await fetch(
            `https://freesound.org/apiv2/sounds/${altSound.id}/?fields=previews&token=${FREESOUND_CLIENT_ID}`
          );
          
          if (!altSoundResponse.ok) {
            throw new Error(`API responded with status ${altSoundResponse.status}`);
          }
          
          const altSoundData = await altSoundResponse.json();
          const altMp3Url = altSoundData.previews['preview-hq-mp3'];
          
          if (!altMp3Url) {
            throw new Error('Could not find MP3 preview URL for alternative sound');
          }
          
          const filePath = path.join(audioDir, altSound.filename);
          console.log(`Downloading ${altSound.filename} from ${altMp3Url}...`);
          await downloadFile(altMp3Url, filePath);
          
          console.log(`✅ Successfully downloaded alternative ${altSound.filename}`);
        } catch (altError) {
          console.error(`❌ Error downloading alternative ${altSound.filename}: ${altError.message}`);
        }
      }
    }
  }

  console.log('Done downloading sound effects!');
}

// First try direct download which doesn't require API keys
downloadSoundsDirectly().catch(err => {
  console.error('Direct download failed:', err);
  console.log('Falling back to API download method...');
  downloadSoundsWithAPI().catch(console.error);
}); 