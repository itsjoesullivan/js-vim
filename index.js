var Vim = require('./lib/Vim');


	
	var vim = new Vim();	
if(typeof window !== 'undefined') {
	window.vim = vim;

	//Keys
	var mousetrap = require('./lib/3rd/mousetrap.js');
 	 mousetrap.addEvent(document,'keypress', function(e) {
 	 	var key = mousetrap.characterFromEvent(e);
    if(key === 'tab' || key === 'backspace') {
      e.preventDefault();
    }
  	vim.exec(key);
  })
  mousetrap.addEvent(document,'keydown', function(e) { 
  	var key = mousetrap.characterFromEvent(e)
    console.log(key);
  	if(key === 'enter') key = '\n';
		if(key === 'backspace') {
			e.preventDefault();
			key = '\b';
		}
    if(key === 'tab') {
      console.log('got here');
      e.preventDefault();
      key = '\t';
    } 
	console.log('key:' + key);
  	if('esc,backspace,return,\n,\t,\b'.split(',').indexOf(key) !== -1) {
  		e.preventDefault();
  		vim.exec(key);
  	} 
	})	

	//Instanciate view
  var view = require('./lib/browserView.js')(vim);
}
	if(typeof window === 'undefined') {
		var view = require('./lib/terminalView.js')(vim);
	}

module.exports = vim;
