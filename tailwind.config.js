/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pirate-blue': '#1e3d59',
        'pirate-gold': '#ffc13b',
        'pirate-cream': '#f5f0e1',
        'pirate-red': '#ff6e40',
      },
      fontFamily: {
        pirate: ['Pirata One', 'cursive'],
      },
    },
  },
  plugins: [],
} 