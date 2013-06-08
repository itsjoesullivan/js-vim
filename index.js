var vim = require('./lib/Vim');

if(typeof window !== 'undefined') {
  window.vim = vim;
  var view = require('./view.js')(vim);
} else {
  module.exports = vim;
}

