var autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [ autoprefixer({ overrideBrowserslist: ['> 1%', 'Safari >= 5'] }) ]
}