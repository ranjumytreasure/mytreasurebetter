/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-red': '#D32F2F',
        'custom-red-dark': '#B71C1C',
      },
    },
  },
  plugins: [],
}

