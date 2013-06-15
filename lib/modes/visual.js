/*

	Visual mode is just text selection on top of command mode. Each keypress, simply maintain your range.

*/

var rangeStart,
		originalCursorPosition = false;
module.exports = {

	'/^((?!esc|x|d|y|i|a|J|c|>).*[^1-9]+.*)/': function(keys,vim, res) {
		vim.curDoc.selecting = true;

		if(!originalCursorPosition) {
			originalCursorPosition = vim.curDoc.cursor.position();
		}

		vim.lastMode = 'visual';

		if(!rangeStart) {
			rangeStart = {
				line: vim.cursor().line(),
				char: vim.cursor().char()
			};
		}

		//execute the command in command mode
		vim.mode('command'); //dont use 'esc' as that is defined below to cancel the visual session
		vim.exec(keys);

		//Establish new cursor as range end / start
		var end = {
			line: vim.cursor().line(),
			char: vim.cursor().char()
		};

		var range = [rangeStart,end];


		//Reverse if not correct order. But rangeStart remains where it was.
		if(end.line < rangeStart.line || (end.line === rangeStart.line && end.char < rangeStart.char)) {
			range = [range[1],range[0]];
		}

		range[1].char++;

		vim.curDoc.selection(range);

		//Assuming we can, move back to visual mode after executing.
		//If we can't, must trust the mode to return us.
		if(vim.modeName === 'command') vim.mode('visual');

	},

	/* OPERATORS

	c d y ~ g~ gu gU ! = gg g? > < zf g@

	*/

	'/^c$/': function() {
		this.exec('d');
		this.exec('i');
	},

	'/^d$/': function() {
		this.exec('y');

		var doc = this.curDoc;

		//Grab the selection
		var range = doc.selection();

		//Don't kill the line
		if(range[0].line === range[1].line &! doc.line(range[0].line).length) return;

		doc.remove(range);
		doc.selection('reset');

		//Move to the beginning of the range
		if(range[0].line >= doc._lines.length) {
			doc.cursor.line(doc._lines.length-1)
		} else {
			doc.cursor.line(range[0].line);
		}
		doc.cursor.char(range[0].char);
		this.exec('esc');

	},

	'/^y$/': function() {
		var selection = this.curDoc.getRange(this.curDoc.selection());
		this.register(0,selection);
	},

	/* swap case */
	'/^~$/': function() {
	},


	/* swap case */
	'/^g~$/': function() {
	},

	/* make lowercase */
	'/^gu$/': function() {
	},

	/* make uppercase */
	'/^gU$/': function() {
	},

	/* filter through an external program */
	'/^!$/': function() {
	},


	/* filter through 'equalprg' */
	'/^=$/': function() {
	},

	/* text formatting */
	'/^gq$/': function() {
	},

	/* ROT13 encoding */
	'/^g?$/': function() {
	},

	/* shift right */
	'/^>$/': function() {
		var selection = this.curDoc.selection();
		var ct = selection[1].line - selection[0].line + 1;
		this.curDoc.cursor.line(selection[0].line)
		while(ct > 0) {
			this.exec('0');
			this.mode('insert');
			this.exec('\t')
			this.mode('visual')
			this.exec('j');
			ct--
		}
		this.exec('esc');
		this.exec('^');
	},

	/* shift left */
	'/^<$/': function() {

	},

	/* define a fold */
	'/^zf$/': function() {

	},

	/* call function set with the 'operatorfunc' option */
	'/^g@$/': function() {

	},


	// WEIRD
	'/^(a|i)(w|W|s|S|p|\\]|\\[|\\(|\\)|b|>|<|t|\\{|\\}|"|\'|`)$/': function(keys, vim, match) {
		console.log(match);

	},




	'/^esc/': function(keys,vim) {
		rangeStart = false;
		vim.curDoc.selection('reset');
		vim.curDoc.selecting = false;
		vim.curDoc.cursor.line(originalCursorPosition.line);
		vim.curDoc.cursor.char(originalCursorPosition.char);
		originalCursorPosition = false;
	},

/*	'/^(a|i)(.)/': function(keys, vim, res) {
		var inclusive = res[1] === 'a' ? true : false;
		var character = res[2];
		var flipMap = {
			'(':')',
			'{':'}',
			'[':']'
		};
		var	flipCharacter = (character in flipMap) ? flipMap[character] : character;
		vim.exec('esc');
		vim.exec('?')
		vim.exec(character + '\n');
		if(!inclusive) vim.exec('l');
		vim.exec('v');
		vim.exec('/')
		vim.exec(flipCharacter + '\n');
		if(!inclusive) vim.exec('h');

	},*/




	'/^(J)$/': function(keys, vim) {
		var range = vim.curDoc.selection();
		var ct = range[1].line - range[0].line || 1; //do first join ANYWAYS

		//Move to the beginning
		vim.curDoc.cursor.line(range[0].line);
		vim.exec('esc');
		while(ct--) {
			vim.exec('J');
		}
	}
};

