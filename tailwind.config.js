/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          default: "#e9e2e2",
          dark: "#1a1a1a",
          lighterDark: "#bababa",
        },
        text: {
          default: "#1a1a1a",
          dark: "#e9e2e2",
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
