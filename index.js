var vim = require('./lib/Vim');

if(typeof window !== 'undefined') {
  window.vim = vim;
  var view = require('./view.js')(vim);
} else {
  module.exports = vim;
}

var vim = {

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
		var keys = require('./lib/keys');
		keys(function() {
			vim.exec.apply(vim,arguments);
		});

		//Create view
		var view = require('./lib/browserView');
		view.init(this.editor);

	},
	initNode: function() {},

};