var vim = require('./lib/Vim');

if(typeof window !== 'undefined') {
  window.vim = vim;
  var mousetrap = require('./lib/3rd/mousetrap.js');
  mousetrap.addEvent(document,'keypress', function(e) {
  	var key = mousetrap.characterFromEvent(e);
  	console.log(key);
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
  module.exports = vim;
}

/*var vim = {

	init: function(obj) {
		this.editor = require('./lib/Vim');
		if(typeof window !== 'undefined') return this.initBrowser(obj);
	},
	initBrowser: function() {

		//establish el
		if(typeof obj === 'object') {
			if('el' in obj) {
				this.el = obj.el;
			} else {
				throw "no element defined"; //maybe unwanted--headless usage?
			}
		}

		//Listen for keystrokes
	
	console.log(moustrap);
	/*var keys = require('./lib/keys');
		keys(function() {
			vim.exec.apply(vim,arguments);
		});*/
	
		//Create view
		/*var view = require('./lib/browserView');
		view.init(this.editor);

	},
	initNode: function() {},

};
*/