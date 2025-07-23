/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./assets/js/**/*.js",
    "./assets/css/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        "forest-green": "#2D6A4F",
        "light-cream": "#F7F5E6",
        "warm-yellow": "#F2C94C",
        "darker-yellow": "#D4AC2B",
        "light-beige": "#E9E4D4",
      },
    },
  },
  plugins: [],
}

