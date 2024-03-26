const path = require('path');

module.exports = {
  mode: 'development',
  entry: './index.js', // This is the entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};
