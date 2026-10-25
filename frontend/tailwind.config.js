/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#070A11',
          900: '#0B0F19',
          850: '#101626',
          800: '#161B2F',
          700: '#1F2942',
          600: '#333D56',
          500: '#54596D',
          400: '#8A92A6',
        },
        wine: {
          950: '#230A13',
          900: '#350F1C',
          800: '#57192E',
          700: '#74182F',
          600: '#921B2F',
          500: '#AA3234',
          400: '#C43B43',
          300: '#D95D65',
        },
        coral: {
          600: '#B84D47',
          500: '#CF625D',
          400: '#EC7E6F',
          300: '#FA947E',
          200: '#E4A28C',
          100: '#FAD4C0',
          50: '#FFF1EC',
        },
        emerald: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        }
      },
      fontFamily: {
        heading: ['Cinzel', 'Syne', 'Plus Jakarta Sans', 'serif'],
        display: ['Syne', 'Plus Jakarta Sans', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        telugu: ['Noto Sans Telugu', 'sans-serif'],
      },
      boxShadow: {
        'glow-wine': '0 0 25px -5px rgba(146, 27, 47, 0.45)',
        'glow-coral': '0 0 20px -5px rgba(250, 148, 126, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
