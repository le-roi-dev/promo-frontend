module.exports = {
  syntax: 'postcss-scss',
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
    // otros plugins que podrías estar usando
  ]
}
