/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        calcBg: "#121212",
        calcPanel: "#1e1e1e",
        calcAccent: "#ff8c00"
      }
    },
  },
  plugins: [],
}
