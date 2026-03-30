/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        zen: {
          dark: '#000000',
          gold: '#D4AF37',
          cream: '#F5F5DC',
        }
      }
    },
  },
  plugins: [],
}
