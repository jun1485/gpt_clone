/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      sm: "360px",
      md: "680px",
      lg: "1280px",
      xl: "1920px",
    },
  },
  plugins: [],
};
