
var _ = require('underscore'),
	Event = require('./Event');

/*

	View handles the difference between what's stored in the file and what is visible on the screen.

	Individual implementations (cli, web) should listen to view

	Probably the optimal basis for view will be communication of diffs

*/
var View = module.exports = function(obj) {
	//Grab a handle
	this.vim = obj.vim;

	//Set dimensions, defaulting to 24 lines of 80 columns	
	this.lines = obj.lines || 24;
	this.cols = obj.cols || 80;

	this.vim.on('change', this.handleChange.bind(this));

	//The status message;
	this.status = '';

	//An array of the text
	this.lineArray = [];

	//The line that has focus. For now: line at bottom of screen
	this.focus = 0;

};

//Inherit 'on', 'trigger'
View.prototype = new Event();

/** Responds to vim changes

*/
View.prototype.handleChange = function() {
	this.refreshStatusLine();
	this.trigger('change');
};

/* The basic status line */
View.prototype.refreshStatusLine = function() {
	//Some modes just show the name
	if('insert,replace'.indexOf(this.vim.modeName) !== -1) {
		return this.status = '-- ' + this.vim.modeName.toUpperCase() + ' --'
	}
	var keys = this.vim.keyBuffer;
	var firstKey = keys.substring(0,1);
	if(firstKey === '/' || firstKey === '?' || firstKey ===':') {
		return this.status = this.vim.keyBuffer;
	}
	
};

View.prototype.getText = function() {
	this.renderText();
	var textArray = this.text.split('\n');
	var lines = [];

	//Lines of the screen left to account for
	var linesLeft = this.lines;

	//Add status first
	if(this.status.length) {
		lines.unshift(this.status);
		linesLeft--
	}

	
	var i = this.focus;
	while(linesLeft > 0) {
		//Add the nearest text-line
		if(typeof textArray[i] !== 'undefined') {
			lines.unshift(textArray[i]);
		} else {
			lines.splice(lines.length-1,0,'~');
		}
		//Shift ref to the text-line above that
		i--;

		//TODO incorporate wrapping lines
		// If wrap, linesLeft-- 
		//Record that we're one line shorter
		// linesLeft -= Math.ceil(this.lines[i]/this.cols);
		linesLeft--;
	}	

	return '' + lines.join('\n');

};

View.prototype.renderText = function() {
	//Grab the text. Dumb... should be transferring arrays, or just referencing directly
	this.text = this.vim.text();
};


