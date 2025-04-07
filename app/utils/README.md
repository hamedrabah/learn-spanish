# Audio Generation for Spanish Quiz App

This utility helps pre-generate all audio files for the Spanish quiz questions and answers, avoiding runtime API calls and rate limiting issues.

## Prerequisites

Before running the script, make sure you have:

1. Node.js installed
2. An Eleven Labs API key
3. The `node-fetch` package installed:
   ```
   npm install node-fetch@2
   ```

## Setup Instructions

1. Place your Eleven Labs API key in an environment variable:
   ```
   export ELEVEN_LABS_API_KEY=your_api_key_here
   ```
   
   Alternatively, you can hard-code it in the script (not recommended for production).

2. Run the script:
   ```
   node app/utils/generateAudioFiles.js
   ```

3. The script will:
   - Create a `/public/audio` directory
   - Generate audio files for all questions and possible answers
   - Create a manifest file at `app/data/audioManifest.json` mapping questions and answers to their audio files

4. Once complete, the app will automatically use these pre-generated files instead of making API calls.

## Troubleshooting

- If you encounter rate limiting issues, modify the delays in the script (currently set to 1 second between requests).
- Make sure the `/public/audio` directory is included in your deployment.
- Check the console for any errors during audio generation.

## Benefits

- No more API rate limiting issues during gameplay
- Faster audio playback (no delay waiting for API responses)
- Reduced bandwidth usage
- Works offline once files are generated 