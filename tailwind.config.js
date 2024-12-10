/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      textShadow: {
        xl: '3px 3px 6px rgba(0, 0, 0, 0.9)',
      },
      rotate: {
        'x-180': '180deg',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.rotate-x-180': {
          transform: 'rotateX(180deg)',
        },
      });
    },
  ],
}

