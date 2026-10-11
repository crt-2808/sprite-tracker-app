/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        base: ["#2369B3", "#2B4766", "#007bff"],
        gold: ["#B8B140", "#FFD700", "#9C8C34"],
        cheatmaster: ["#345F36", "#20BF2B", "#287D2D"],
        hackerloot: ["#B14AED", "#2E1A63", "#B14AED"],
        bountyhacker: ["#6C2584", "#782F90", "#4A1B57"],
        trickortreat: ["#FD8700", "#FFC100", "#FF7100"],
      },
      fontFamily: {
        games: ["gamesItalic", "sans-serif"],
      },
    },
  },
  plugins: [],
};
