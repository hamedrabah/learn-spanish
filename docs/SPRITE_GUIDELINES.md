# Sprite Guidelines for Spanish Learning Game

This document outlines the best practices for creating and implementing sprite graphics for our Spanish learning game. Following these guidelines will ensure a consistent visual style across the application.

## SVG Format & Setup

- Use SVG format with `shape-rendering="crispEdges"` attribute for all sprites
- Set up viewBox using a 16-pixel grid (e.g., "0 0 16 24" for characters)

## Pixel Art Style

- Maintain a consistent 16-bit retro aesthetic
- Use simple rectangular blocks (`<rect>` elements) for pixel construction
- **Do not include text in image sprites** - text should be handled separately in HTML/CSS for better accessibility and localization
- **Do not include backgrounds in sprites** - backgrounds should be added via CSS or as separate elements to maintain flexibility and optimize performance

## CSS Implementation

- Apply `image-rendering: pixelated` in CSS to preserve crisp edges when scaled
- Use consistent scaling ratios (e.g., 120px height for character sprites)
