/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ridge: "#F6F3EC",
        pine: "#1C3A2E",
        "pine-deep": "#122720",
        glacier: "#4C7D93",
        clay: "#C07F4E",
        flag: "#A23E3F",
        ink: "#211F1A",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
