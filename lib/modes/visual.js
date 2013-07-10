var _ = require('underscore');


/*

	Visual mode is just text selection on top of command mode. Each keypress, simply maintain your range.

*/

//TODO absorb these elsewhere... Won't work with multiple vim instances
var rangeStart,
		originalCursorPosition = false;
module.exports = {

    /* Keys that pass through visual mode. Motion, mostly.  */
	'/^((?![1-9])(?!esc|x|d|y|i|a|J|c|>).*[^1-9]+.*)/': function(keys,vim, res) {
        //Remember we're in the process of selecting
		this.curDoc.selecting = true;

		// "I" in visual block 
		if(this.submode === 'block' && (keys === 'I' || keys === 'A')) {
			this.submodeVerb = keys;
			this.submode === '';
			//Move to command mode
			if(keys === 'A') {
				var pos = this.curDoc.selection()[0][1];
				pos.char--;
				pos.col--;
			}
			this.exec('esc');
			//Move to insert mode
			if(keys === 'A') {
				this.curDoc.cursor.position(pos);
				this.exec('a');
			} else {
				this.exec('i');
			}
			//Ensure still block submode
			this.submode = 'block';
			return;
		}


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
        range[0].col = range[0].char;
        range[0].mark = '<';
        range[1].col = range[1].char;
        range[1].mark = '>';


        this.curDoc.addMark(range[0]);
        this.curDoc.addMark(range[1]);

		//Visual
		if(this.submode === 'Visual') {
			range[0].char = 0;
			var line = this.curDoc.line(range[1].line);
			range[1].char = this.curDoc.line(range[1].line).length;
		}


		range[1].char++;

		// Block mode
		if(this.submode === 'block') {
			//Starting line
			var curLine = range[0].line;
			var lastLine = range[1].line;
			// The first col of the selection
			var firstCol = Math.min(range[0].char,range[1].char);
			// The last
			var lastCol = Math.max(range[0].char,range[1].char);
			//Redefine range as an array
			blockRange = [];
			while(curLine <= range[1].line) {
				// If the range begins after the end of the line, skip it for now.
				// TODO:handle $ edge case
				if(firstCol >= this.curDoc._lines[curLine].length) {
					curLine++;
					continue;
				};
				var lastLineCol = Math.min(this.curDoc._lines[curLine].length,lastCol);

				blockRange.push([
					{
						line: curLine,
						char: firstCol,
						col: firstCol
					},
					{
						line: curLine,
						char: lastLineCol,
						col: lastLineCol
					}
				]);
				curLine++;
			}
			if(blockRange.length === 1) blockRange = blockRange[0];
			range = blockRange;
		}


		this.curDoc.selection(range);

		//Assuming we can, move back to visual mode after executing.
		//If we can't, must trust the mode to return us.
		if(this.modeName === 'command') this.mode('visual');

	},

	/* OPERATORS


	*/

	'/^c$/': function() {
		if(this.submode === 'block') {
			var newSelection = JSON.parse(JSON.stringify(this.curDoc.selection()));
			_(newSelection).each(function(subRange,i) {
				var newEnd = subRange[1];
				newEnd.char++;
				newEnd.col++;
				newSelection[i][1] = newEnd;
			});
			this.exec('d');
			this.exec('<C-v>');
			this.curDoc.selection(newSelection);
			this.exec('I');
			return;
		}
		this.exec('d');
		this.exec('i');
	},

    /* delete */
	'/^d$/': function() {
        var sel = this.curDoc.selection();
		this.exec('y');
        this.exec('v');
        this.curDoc.selection(sel);


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
        this.curDoc.cursor.position(this.curDoc.selection()[0]);
        this.curDoc.selection('reset');
        this.exec('esc');
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
			's': ['(',')'],
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
		// Grab the last selection. Shitty to be cloning like this, but TODO fix.
		this.lastSelection = JSON.parse(JSON.stringify(this.curDoc.selection()));
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

