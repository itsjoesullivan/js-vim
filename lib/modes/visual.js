/*

	Visual mode is just text selection on top of command mode. Each keypress, simply maintain your range.

*/

var rangeStart,
		originalCursorPosition = false;
module.exports = {

	'/^((?![1-9])(?!esc|x|d|y|i|a|J|c|>).*[^1-9]+.*)/': function(keys,vim, res) {
		this.curDoc.selecting = true;

		if(!originalCursorPosition) {
			originalCursorPosition = this.curDoc.cursor.position();
		}

		this.lastMode = 'visual';

		if(!rangeStart) {
			rangeStart = {
				line: this.cursor().line(),
				char: this.cursor().char()
			};
		}

		//execute the command in command mode
		this.mode('command'); //dont use 'esc' as that is defined below to cancel the visual session
		this.exec(keys);

		//Establish new cursor as range end / start
		var end = {
			line: this.cursor().line(),
			char: this.cursor().char()
		};

		var range = [rangeStart,end];


		//Reverse if not correct order. But rangeStart remains where it was.
		if(end.line < rangeStart.line || (end.line === rangeStart.line && end.char < rangeStart.char)) {
			range = [range[1],range[0]];
		}

		//Visual
		if(this.submode === 'Visual') {

			range[0].char = 0;
			var line = this.curDoc.line(range[1].line);
			range[1].char = this.curDoc.line(range[1].line).length;
		}

		range[1].char++;

		this.curDoc.selection(range);

		//Assuming we can, move back to visual mode after executing.
		//If we can't, must trust the mode to return us.
		if(this.modeName === 'command') this.mode('visual');

	},

	/* OPERATORS


	*/

	'/^c$/': function() {
		this.exec('d');
		this.exec('i');
	},

    /* delete */
	'/^d$/': function() {
		this.exec('y');

		var doc = this.curDoc;

		//Grab the selection
		var range = doc.selection();

		//Don't kill the line
		//if(range[0].line === range[1].line &! doc.line(range[0].line).length) return;

		doc.remove(range);
		doc.selection('reset');

		//Move to the beginning of the range
		if(range[0].line >= doc._lines.length) {
            var newLine = doc._lines.length-1;
            if(newLine < 0) newLine = 0;
			doc.cursor.line(newLine);
		} else {
			doc.cursor.line(range[0].line);
		}
		doc.cursor.char(range[0].char);
		this.exec('esc');

	},

    /* yank */
	'/^y$/': function() {
		var selection = this.curDoc.getRange(this.curDoc.selection());
		var index = this.currentRegister;
		this.register(index,selection);
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


	// Inner select
	'/^([1-9]+[0-9]*)?(a|i)(w|W|s|S|p|\\]|\\[|\\(|\\)|b|>|<|t|\\{|\\}|"|\'|`)$/': function(keys, vim, match) {
		var outer = match[2] === 'a';		
		var count = 1;
		if(match[1] && match[1].length) count = parseInt(match[1]);
		var boundaries = [];
		var boundaryMap = {
			'w': ['b','e'],
			'W': ['F ','f '],
			'"': ['F"','f"'],
			's': ['?. \n','f.'],
			'(': ['F(','f)']
		};

		if(match[3] in boundaryMap) {
			boundaries = boundaryMap[match[3]]
		} else {
			boundaries = [match[3],match[3]];
		}

		var moveIn = false
		if(boundaries[0].substring(0,1) === 'F' && match[2] === 'i') {
			boundaries[0] = 'T' + boundaries[0].substring(1);
			boundaries[1] = 't' + boundaries[1].substring(1);
		} else if(match[2] === 'i') { //fix this
			moveIn = true;
		}

		if(boundaries.length) {
			this.exec('esc');
			var i = 0;
			while(i++ < count) {
				this.exec(boundaryMap[match[3]][0])
			}
			if(moveIn) this.exec('l');
			this.exec('v');
			var i = 0;
			while(i++ < count) {
				this.exec(boundaryMap[match[3]][1])
			}

			if(moveIn) this.exec('h');
		}


	},

	'/^esc/': function(keys,vim) {
		rangeStart = false;
		this.curDoc.selection('reset');
		this.curDoc.selecting = false;
		this.curDoc.cursor.line(originalCursorPosition.line);
		this.curDoc.cursor.char(originalCursorPosition.char);
		originalCursorPosition = false;
		this.submode = false;
	},

	'/^(x)$/': function(keys, vim) {
		this.exec('d');
	},


	'/^(J)$/': function(keys, vim) {
		var range = this.curDoc.selection();
		var ct = range[1].line - range[0].line || 1; //do first join ANYWAYS

		//Move to the beginning
		this.curDoc.cursor.line(range[0].line);
		this.exec('esc');
		while(ct--) {
			this.exec('J');
		}
	}
};

