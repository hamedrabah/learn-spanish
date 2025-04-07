#!/bin/bash

# Install dependencies
npm install

# Create needed directories if they don't exist
mkdir -p app/styles app/components app/data

# Run development server
echo "Setup complete! Run 'npm run dev' to start the development server."
echo "Then open http://localhost:3000 in your browser to play the game." 