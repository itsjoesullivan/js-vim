var Vim = require('./lib/Vim');
	console.log('here',Vim);

	
	var vim = new Vim();	
	console.log('vim is:',vim)


	//Keys
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
	})	

	//Instanciate view
  var view = require('./lib/browserView.js')(vim);
	if(typeof window === 'undefined') {
		var view = require('./lib/terminalView.js')(vim);
	}

module.exports = vim;
