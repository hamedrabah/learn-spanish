# Spanish Dueling Game

A Spanish language learning game inspired by the insult sword fighting mini-game from The Secret of Monkey Island.

## Overview

This game helps you practice Spanish through a fun, pirate-themed dueling mechanic. Players engage in verbal duels by responding to Spanish insults with appropriate comebacks.

## Features

- Three difficulty levels (Beginner, Intermediate, Advanced)
- Spanish phrases with English translations
- Animated sword fighting with pirate characters
- Score tracking system
- Option to show/hide translations
- Authentic Spanish voice-over using Eleven Labs API

## How to Play

1. Start the game and select your difficulty level
2. Your opponent will insult you in Spanish
3. Choose the correct Spanish comeback from the options provided
4. Win 3 duels to become the Spanish Sword Fighting champion!

## Learning Benefit

This game helps you practice:
- Spanish vocabulary
- Reading comprehension
- Understanding context
- Quick language recall
- Humor and cultural expressions

## Technologies Used

- Next.js
- React
- TypeScript
- CSS Modules
- Eleven Labs API for realistic Spanish voice

## Getting Started

1. Create a `.env.local` file in the root directory with your Eleven Labs API key:
```
NEXT_PUBLIC_ELEVEN_LABS_API_KEY=your_api_key_here
```

2. Install dependencies and run the development server:
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to play the game.

## Voice-Over Configuration

The game uses Eleven Labs for high-quality Spanish voice-over. By default, it uses the 'Antonio' voice (a male Spanish voice), but you can replace it with any voice ID from your Eleven Labs account.

To change the voice:
1. Get your voice IDs by clicking the "Debug Voices" button in the game
2. Update the VOICE_IDS object in `app/components/GameBoard.tsx` with your preferred voice ID

## Inspiration

This game is inspired by the insult sword fighting mechanic from LucasArts' classic adventure game "The Secret of Monkey Island," where players had to learn and respond with appropriate pirate insults to win sword fights. 