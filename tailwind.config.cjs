/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/**/*.{html,css,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0a0a0a',
        secondary: '#1a1a1a',
        tertiary: '#2a2a2a',
        color: '#ffffff',
        gold: {
          DEFAULT: '#d4af37',
          light: '#f4e4ba',
          dark: '#b8960c'
        },
        'accent-primary': '#d4af37',
        'accent-primary-state': '#c9a227'
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)' }
        }
      }
    }
  },
  plugins: []
};
