var vim = require('./lib/Vim');

if(typeof window !== 'undefined') {
  window.vim = vim;
} else {
  module.exports = vim;
}

