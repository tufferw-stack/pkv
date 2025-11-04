/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#0ea5e9" },
        card: "hsl(0 0% 100%)",
        border: "hsl(0 0% 88%)",
      },
    },
  },
  plugins: [],
};
