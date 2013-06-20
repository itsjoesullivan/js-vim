
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

	return '' + this.getArray().join('\n');

};

View.prototype.getArray = function() {
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
			lines.unshift(this.renderLine(textArray[i],i+1));
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
	return lines;

};
/** Return the difference between current and arg ref 

	Making a decision here, let's let it collapse to "oh, this character changed..."
		Because that's going to be the cheapest way for terminal to handle small changes

*/
View.prototype.getPatch = function(ref) {
	this.renderText();
	//diff
	var patch = [];
	//current text
	var text = this.text;
	if(!ref) throw "No reference to diff!";
	/* Why doing this so slowly? Well, the point is:
		1) This is meant for diffing the current screen, so ~50 lines... not too expensive
		2) A comprehensive diff will be useful to a display where changes are expensive (imagine... kindle)	
	*/
	//We need to definitely account for every refLine
	var refLines = ref.split('\n');
	var textLines = text.split('\n');
	_(refLines).each(function(line,i) {
		//Get the general line changes
		var diff = this.diffLine(line,textLines[i]);
		_(diff).each(function(change) {
			//Add the line number
			change.line = i;
			//Push to the patch
			patch.push(change);
		});
	}.bind(this));

	return patch;
	
};

View.prototype.diffLine = function(line1,line2) {
	var diffs = []
	//No changes
	if(line1 === line2) return [];
	//Clear the line
	if(!line2 || !line2.length) return [ { from: 0, to: line1.length-1, content: '' } ];
	//Write the line
	if(!line1 || !line1.length) return [ { from: 0, to: line2.length-1, content: line2 } ];	

	var len = Math.max(line1.length,line2.length);
	var diff = false;	
	for(var i = 0; i < len; i++) {
		//If the same
		if(line1[i] === line2[i]) {
			//And a diff had been started
			if(diff) {
				//The diff is over, man
				diff.to = i;
				diffs.push(diff);
				diff = false;
			}
			//Otherwise, proceed.

		}	else { //There is a difference
			//And it's not the first one
			if(diff) {
				//Just add the different character
				diff.content += line2[i] ? line2[i] : '';
			} else { //But if it's the beginning of a diff
				//Start it off.
				diff = {
					from: i,
					content: line2[i] ? line2[i] : ''
				};
			}
		}
	}
	//What if the last line is different?
	if(diff) {
		diff.to = i;
		diffs.push(diff);
	}

	return diffs;
};

View.prototype.renderText = function() {
	//Grab the text. Dumb... should be transferring arrays, or just referencing directly
	this.text = this.vim.text();
};


/** Render an individual line. Expect a 1-indexed line # and.. who knows.

*/

View.prototype.renderLine = function(text,index,misc) {
	//Create gutter
	var gutter = '     ' + index + ' ';
	while(gutter.length > 7) {
		gutter = gutter.substring(1);	
	}
	return gutter + text;
};


