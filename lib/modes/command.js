var _ = require('underscore');

module.exports = {

	'/^{count}{motion}$/': function(count, motion) {
		while(count--) {
			this.exec(motion);
		}
	},


/*	'/^{operator}{operator}$/': function(op1,op2) {
		this.exec(op1 + op2);
	},*/

	'/^{count}{operator}{count}{motion}$/': function(ct1, operator, ct2, motion) {
		var count = ct1 * ct2;
		this.exec(operator + count + motion);
	},

	'/^{operator}{motion}$/': function(operator, motion) {
		this.exec(operator + '1' + motion);

	},

	/*

		Oh boy, this is the big one.

	*/
	'/^{operator}{count}{motion}$/': function(operator, count, motion) {
			this.addUndoState();

		var visualMode = 'v';

		//Certain ops assume you're in visual line mode
		if(['j','k','-','+'].indexOf(motion) > -1) {
			visualMode = 'V';
		}
			

		//See http://vimdoc.sourceforge.net/htmldoc/motion.html#operator
		if(operator === 'd' && motion === 'w') { motion = 'f '; }

		var position = this.curDoc.cursor.position();
		this.exec(visualMode);
		this.exec(motion)
		this.exec(operator);		
	},


	// Text object selection
		'/^(y|d|c)(i|a)(w|W|s|S|p|\\]|\\[|\\(|\\)|b|>|<|t|\\{|\\}|"|\'|`)$/': function(keys, vim, match) {
			this.exec('v');
			this.exec(match[2] + match[3]);
			this.exec(match[1]);
		},



	/**


	MOTIONS: (t|T|f|F)(\S)


	*/



	'/\g_/': function(keys,vim) {
		this.exec('$');
		var doc = this.curDoc;
		var point = doc.find(/([\S])( |$)/g,{backwards:true}); //backwards
		if(point) {
			doc.cursor.line(point.line);
			doc.cursor.char(point.char);
		}
	},

	'/^(b|B)/': function(keys,vim) {
		var doc = this.curDoc;
		var point = doc.find(/(\S*)\s*(?=[\S]*)$/g,{ backwards: true });
		if(point) {
			doc.cursor.line(point.line);
			doc.cursor.char(point.char); //oh ho
		}
	},





	'/\\$/': function(keys,vim) {
		var curLine = this.curDoc.line();

		/*this.exec('/'); //search mode
		this.exec('(.|\n)$'); //
		this.exec('\n'); //go!
		this.exec('/(.|\\n)$\n');*/

		var cursorPos = 0;
		if(curLine.length) {
			cursorPos = curLine.length-1 + (this.curDoc.selecting ? 1 : 0);
		}


		this.cursor().char(cursorPos);
	},

	/* go to beginning of line */
	'/^0/': function(keys,vim) {
		this.cursor().char(0);
	},

	/* go to next word */
	'/^(w)$/': function(keys,vim) {
		var doc = this.curDoc;

		var point;
		if(this.curChar.match(/\w/)) {
			point = doc.find(/(?:(?: |^)([\S])|([^\w\s]))/g);
		} else {
			point = doc.find(/(?:(?: |^)([\S])|([\w^\S]))/g);
		}

	 if(point) { //there is a space, therefore a word
			doc.cursor.line(point.line);
			doc.cursor.char(point.char); //oh ho
		}

	},

	/* go to next WORD */
	'/^(W)$/': function(keys,vim) {
		var doc = this.curDoc;
		var point = doc.find(/(?: |^)(\S+)/g);
		if(point) { //there is a space, therefore a word
			doc.cursor.line(point.line);
			doc.cursor.char(point.char); 
		}

	},

	/* go to end of this word */
	'/^(e)$/': function(keys,vim) {
		var doc = this.curDoc;
		var point = doc.find(/(\w)(?= |$)/g);
		if(point) { //there is a space, therefore a word
			doc.cursor.line(point.line);
			doc.cursor.char(point.char); //oh ho
		}
	},

	/* go to first non-whitespace character of this line */
	'/\\^/': function(keys,vim) {
		this.exec('0');
		var doc = this.curDoc;
        if (this.curChar.match(/(\S)/g) === null) {
            // if the first character is whitespace, seek another
            var point = doc.find(/(\S)/g);
            if(point) {
                doc.cursor.line(point.line);
                doc.cursor.char(point.char);
            }
        }
	},




	/* Basic movement */

	'/^h$/': function(keys,vim) {
		var newChar = this.cursor().char()-1;
		if(newChar < 0) return;
		this.cursor().char(newChar);
	},

	'/^l$/': function(keys,vim) {
		var newChar = this.cursor().char()+1;
		if(newChar >= this.curDoc.line().length) return;
		this.cursor().char(newChar);
	},

	'/^j$/': function(keys, vim) {
		var newLine = this.cursor().line()+1;
		if(newLine >= this.curDoc._lines.length) return;
		this.cursor().line(newLine);
	},

	'/^k$/': function(keys, vim) {
		var newLine = this.cursor().line()-1;
		if(newLine < 0) return;
		this.cursor().line(newLine);
	},

	'/^([1-9]+[0-9]*)$/': function(keys, vim, res) {
		this.keyBuffer += keys;
	},

	/* Go to line */
	'/^([1-9][0-9]*)G$': function(keys,vim,res) {

		//Zero indexed but referenced one-indexed
		var lineNumber = parseInt(res[1])-1;

		//Move line
		this.curDoc.cursor.line(lineNumber);

		//Go to the beginning
		this.exec('0');
	},

	/* go to first line */
	'/^gg$/': function(keys,vim,res) {
		this.exec('1G');
	},

	/* go to last line */
	'/^G$/': function(keys,vim,res) {
		this.exec('' + this.curDoc._lines.length + 'G');
	},




	'/^f(.)$/': function(keys,vim,match) {  //convert to: f([\w])
		var lastSearch = this.curDoc.last('search');
		this.exec('/' + match[1] + '\n');
		this.curDoc.last('f','f' + match[1]);
		this.curDoc.last('search',lastSearch);
	},


	'/^F(.)$/': function(keys,vim,match) {  //convert to: f([\w])
		var lastSearch = this.curDoc.last('search');
		this.exec('?' + match[1] + '\n');
		this.curDoc.last('f','F' + match[1]);
		this.curDoc.last('search',lastSearch);
	},


	'/^t(.)$/': function(keys, vim, match) {  //convert to: f([\w])
		var lastSearch = this.curDoc.last('search');
		this.exec('l');
		this.exec('/' + match[1] + '\n');
		this.exec('h');
		this.curDoc.last('f','t' + match[1]);
		this.curDoc.last('search',lastSearch);
	},


	'^T(.)$': function(keys, vim, match) {  //convert to: f([\w])
		var lastSearch = this.curDoc.last('search');
		this.exec('h');
		this.exec('?' + match[1] + '\n');
		this.exec('l');
		this.curDoc.last('f','T' + match[1]);
		this.curDoc.last('search',lastSearch);
	},



	'/^;$/': function(vim) {
		this.exec(this.curDoc.last('f'));
	},

	'/^,$/': function(vim) {
		var last = this.curDoc.last('f');	
		var lastOp = last.substring(0,1);
		if(lastOp === lastOp.toLowerCase()) {
			lastOp = lastOp.toUpperCase()
		} else {
			lastOp = lastOp.toLowerCase();
		}
		this.exec(lastOp + last.substring(1));
		this.curDoc.last('f',last)
	},


	'/(\\/|\\?)(.+)\\n/': function(keys,vim,match) {

		this.curDoc.last('search',keys)

		this.searchMode = match[1] === '/' ? 'forwards' : 'backwards';
		//var term = match[2].replace(/(\(|\))/,'\\$1');
		this.searchBuffer = match[2];
		var pt = this.curDoc.find(new RegExp('(' + this.searchBuffer.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + ')','g'),{selection: true, backwards: vim.searchMode==='backwards'});
		if(pt) {
			this.cursor().line(pt.line);
			this.cursor().char(pt.char);
		}
	},

	/*'/^(\\/)/': function(keys,vim) {
		this.searchMode = 'forward';
		this.keyBuffer = '';
		this.mode('search');
	},*/

	'/^n$/': function(keys, vim, res) {
		this.exec(this.curDoc.last('search'));
	},

	'/^N$/': function(keys, vim, res) {
		var last = this.curDoc.last('search');
		if(!last) return;
		if(last.substring(0,1) === '?') {
			newLast = '/' + last.substring(1);
		} else {
			newLast = '?' + last.substring(1);
		}
		this.exec(newLast);
		this.curDoc.last('search',last)
	},


	
//MODES
	
	'/(esc)/': function(keys, vim) {
		this.keyBuffer = ''
	},

//Insert mode
	'/^(i|s|S)/': function(keys,vim) {
		if(this.execDepth === 1) {
			this.addUndoState();
		}
		//this.exec('h');
		if(!this.curDoc._lines.length) { this.curDoc._lines.push(''); }
		this.mode('insert');
	},

	'/^(A)/': function(keys,vim) {
		if(this.execDepth === 1) {
			this.addUndoState();
		}
		this.exec('$');
		this.exec('a');
	},

	'/^(I)/': function(keys,vim) {
		if(this.execDepth === 1) {
			this.addUndoState();
		}
		this.exec('0');
		this.exec('i');
	},

	'/^v$/': function(keys,vim) {
		this.mode('visual');
	},

	'/^V$/': function(keys,vim) {
		this.submode = 'Visual';
		this.mode('visual');
	},


	/* join */
	'/^J$/': function(keys,vim) {
		this.exec('j');
		this.exec('0');
		this.exec('v');
		this.exec('$');
		this.exec('d');

		//Doing this rather than go to greater measures to delete the line.
		var copied = this.register(0);
		copied = copied.substring(0,copied.length-1);
		this.register(0,copied);

		this.exec('k');
		this.exec('$');
		var position = this.curDoc.cursor.char();
		this.exec('a');
		this.exec(' ');
		this.exec('esc');
		this.exec('p');	
//		this.curDoc.cursor.char(position);
		this.curDoc.selection('reset');
		this.exec('0');
		this.exec(position+1 + 'l');
	},

	'/^o$/': function(keys,vim) {
		if(this.execDepth === 1) {
			this.addUndoState();
		}
		this.exec('A');
		this.exec('\n');
	},

	'/^O$/': function(keys,vim) {
		if(this.execDepth === 1) {
			this.addUndoState();
		}
			this.exec('0');
			this.exec('i');
			this.exec('\n');
			this.exec('esc');
			this.exec('k');
			this.exec('i');
	},
	'/^a$/': function(keys,vim) {
		if(this.execDepth === 1) {
			this.addUndoState();
		}
		this.exec('i');
		var doc = this.curDoc;
		doc.cursor.char(doc.cursor.char()+1);
	},

	'/^([1-9]+[0-9]*)?(yy|cc|dd)$/': function(keys, vim, match) { //number
		if(this.execDepth === 1) {
			this.addUndoState();
		}
		var start = this.curDoc.cursor.position();

		this.exec('0');
		this.exec('v');
		var ct = 1;
		var to = parseInt(match[1]);
		if(!to) to = 1;
		while(ct < to) {
			ct++;
			this.exec('j');
		}
		this.exec('$');


		var text = this.curDoc.getRange(this.curDoc.selection());
		if(text.substring(text.length-1) === '\n') text = text.substring(0,text.length-1);
		this.curDoc.yanking = false;

		if(match[2] === 'cc' || match[2] === 'dd') {
			this.exec('d');
		}

		this.curDoc.cursor.line(start.line);
		this.curDoc.cursor.char(start.char);


		if(match[2] === 'cc') {
			this.exec('i');
		}
		var command = ['o',text,'esc'];
		if(to >= 2) {
			command.push(to-1 + 'k');
		}
		command.push('0');

		this.register(this.currentRegister,command);
		this.curDoc.yanking = false;

	},


	/* Set current register */
	'/^"([a-z%\.\-_\"#])$/': function(keys, vim, match) {
		this.currentRegister = match[1];
	},


	/* paste after cursor */
	'/^(p|P)/': function(keys,vim,match) {
		var P = match[1] === 'P';
		var reg = this.register(this.currentRegister || 0);

		//Don't execute nothing
		if(!reg || !reg.length) return;

		//Execute arrays as a sequence of commands
		if(_(reg).isArray()) {
			while(reg.length) {
				this.exec(reg.shift());
			}
			this.exec('esc');
		} else {
			//Otherwise treat as text
			this.exec(P ? 'i' : 'a');
			this.exec(reg);
			this.exec('esc');
		}

	},

	'/^(P)/': function(keys,vim,res) {
		this.exec('i');
		this.exec(this.register(0));
		this.exec('esc');
	},


	/* Begin recording into specified registry */
	'/^q([a-z]?)$/': function(keys,vim,res) {
		if(this.recording) {
			this.register(this.recordingRegister,this.recordingBuffer);
			this.recording = false;
		} else if(res[1]) {
			this.recording = true;
			this.recordingRegister = res[1]
			this.recordingBuffer = [];
			this.preRecordText = this.curDoc.text();
		} else {
			this.keyBuffer = 'q';
		}
		//grab the doc in a diff
		//this.mode('recording');
	},


	/* End the recording if currently recording */
	/*'/^q$/': function(keys,vim) {
		if(this.recording) {
			this.recording = false;
			this.curDoc.text(vim.preRecordText);
		}
	},*/

	/* Execute the command as stored in the register */
	'/^@([a-z])$/': function(keys,vim,res) {
		var commands = this.register(res[1]);
		this.curDoc.last('macro',res[1]);
		if(typeof commands === 'string') {
			this.exec(commands)
		} else {
			while(commands.length) {
				this.exec(commands.shift());
			}
		}
	},

	'/^@@$/': function() {
		var last = this.curDoc.last('macro');
		if(last) {
			this.exec('@' + last);
		}
	},

	/*'/([0-9]+)([hHjJkKlLwWbBeE(){}]|yy|dd|\[\[|\]\]|)/': function(keys,vim,result) {
		var ct = result[1];
		var command = result[2];
		while(ct--) this.exec(command);
	}*/

/* REPLACE */

	'/^r(.)$/': function(keys, vim, match) {
		this.exec('x');
		this.exec('i');
		this.exec(match[1]);
		this.exec('esc');
	},

/* SHORTCUTS */


	/* Commands that can be stupidly executed N times, instead of a smarter visual selection */
	'/^([1-9]+[0-9]*)(x|X)$/': function(keys, vim, match) {
		if(this.execDepth === 1) {
			this.addUndoState();
		}
		var ct = parseInt(match[1]);
		while(ct--) {
			vim.exec(match[2]);
		}
	},

	'/^x$/': function(keys, vim, res) {
		if(this.execDepth === 1) {
			this.addUndoState();
		}
		//Using x, don't delete a line if it's empty.
		var range = this.curDoc.selection();
		if(range[0].line === range[1].line &! this.curDoc.line(range[0].line).length)  {
			return;
		}
		//Grab a hold of something
		this.exec('v');

		
		//Otherwise treat as d
		this.exec('d');
	},
	'/^X$/': function(keys, vim, res) {
		if(this.execDepth === 1) {
			this.addUndoState();
		}
		this.exec('h');
		this.exec('x');
	},
	'/^D$/': function(keys, vim, res) {
		if(this.execDepth === 1) {
			this.addUndoState();
		}
		this.exec('d');
		this.exec('$');
	},
	'/^C$/': function(keys, vim, res) {
		if(this.execDepth === 1) {
			this.addUndoState();
		}
		this.exec('c');
		this.exec('$');
	},
	'/^s$/': function(keys, vim, res) {
		if(this.execDepth === 1) {
			this.addUndoState();
		}
		this.exec('c');
		this.exec('l');
	},
	'/^S$/': function(keys, vim, res) {
		if(this.execDepth === 1) {
			this.addUndoState();
		}
		this.exec('c');
		this.exec('c');
	},

	'/^u$/': function(keys, vim, res) {
		if(this.execDepth === 1) {
			if(this.addUndoState()) {
				//quick undo to get back to current state just recorded.	
				this.curDoc.undo.last();
			}
		}
		var state = this.curDoc.undo.last();
		if(!state) return;
		this.curDoc.text(state.text);
		this.curDoc.cursor.char(state.cursor.char);
		this.curDoc.cursor.line(state.cursor.line);
	},

	'/<C-r>/': function(keys, vim, res) {
		var state = this.curDoc.undo.next();
		if(!state) return;
		this.curDoc.text(state.text);
		this.curDoc.cursor.char(state.cursor.char);
		this.curDoc.cursor.line(state.cursor.line);
	}


}
