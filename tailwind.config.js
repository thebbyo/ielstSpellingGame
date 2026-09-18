/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ielts: {
          dark: '#0B0F19',
          card: '#131B2E',
          accent: '#00F2FE',
          purple: '#7C3AED',
          gold: '#F59E0B',
          pink: '#EC4899',
          green: '#10B981',
          red: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

