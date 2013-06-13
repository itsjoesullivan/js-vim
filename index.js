var vim = require('./lib/Vim');

if(typeof window !== 'undefined') {
  window.vim = vim;
  var mousetrap = require('./lib/3rd/mousetrap.js');
  mousetrap.addEvent(document,'keypress', function(e) {
  	var key = mousetrap.characterFromEvent(e);
  	vim.exec(key);
  })
  mousetrap.addEvent(document,'keydown', function(e) { 
  	var key = mousetrap.characterFromEvent(e)
  	if(key === 'enter') key = '\n';
  	if('esc,backspace,return,\n'.split(',').indexOf(key) !== -1) {
  		e.preventDefault();
  		vim.exec(key);
  	} 
  	
  });
  var view = require('./lib/browserView.js')(vim);
} else {
	var view = require('./lib/terminalView.js')(vim);
  module.exports = vim;
}
