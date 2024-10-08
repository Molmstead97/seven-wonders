/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      textShadow: {
        xl: '3px 3px 6px rgba(0, 0, 0, 0.9)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-shadow-xl': {
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.9)',
        },
      });
    },
  ],
}

