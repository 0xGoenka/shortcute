/** @type {import('tailwindcss').Config} */
module.exports = {
  /** shared theme configuration */
  theme: {
    extend: {
      animation: {
        blink: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;',
      },
      keyframes: {
        blink: {
          '0%, 100%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.1,
          },
        },
      },
    },
  },
  /** shared plugins configuration */
  plugins: [],
};
