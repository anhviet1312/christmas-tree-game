/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        christmas: {
          red: '#c41e3a',
          darkRed: '#780016',
          green: '#165b33',
          darkGreen: '#0b381e',
          lightGreen: '#2e8b57',
          gold: '#f8b229',
          ice: '#e8f4f8'
        }
      },
      animation: {
        'sway': 'sway 3s ease-in-out infinite',
        'twinkle': 'twinkle 1.5s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        sway: {
          '0%, 100%': { transform: 'rotate(-1.5deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
        },
        twinkle: {
          '0%': { opacity: '0.4', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(248, 178, 41, 0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(248, 178, 41, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
