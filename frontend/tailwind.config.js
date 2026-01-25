/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Replaced blue primary with an emerald palette (no blue shades)
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Accent colors
        accent: {
          50: '#fff5f3',
          100: '#ffe6e0',
          200: '#ffbdb0',
          300: '#ff8a66',
          400: '#ff6b46',
          500: '#ff5a36',
          600: '#ff4a2a',
          700: '#ff3a1e',
          800: '#cc2f19',
          900: '#992414',
        },
        // Secondary accent (amethyst)
        amethyst: {
          50: '#f6f5ff',
          100: '#efeefd',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95'
        },
        // Surfaces (no pure white/black)
        surface: {
          light: '#F3EEE8', // warm sand (light mode background)
          muted: '#E9E3DB',
          card: '#FFF7F2',
          dark: '#0E1720', // deep slate for dark mode background (not pure black)
          cardDark: '#111827'
        }
      },
    },
  },
  plugins: [],
}
