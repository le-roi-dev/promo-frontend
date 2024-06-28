/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
    screens: {
      'mysm': '640px',
      'sm': '640px',
      'mymd': '768px',
      'md': '768px',
      'mylg': '1024px',
      'lg': '1024px',
      'myxl': '1280px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1500px',
      'my2xl': '1536px',
      '4xl': '1700px',
      // => @media (min-width: 1280px) { ... }
    },
  },
  plugins: [],
})