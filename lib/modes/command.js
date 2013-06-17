var _ = require('../3rd/_');

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

		//See http://vimdoc.sourceforge.net/htmldoc/motion.html#operator
		if(operator === 'd' && motion === 'w') { motion = 'f '; }

		var position = this.curDoc.cursor.position();
		this.exec('v');
		this.exec(motion)
		this.exec(operator);		
		//vim.curDoc.cursor.set(position);	
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
		vim.exec('$');
		var doc = vim.curDoc;
		var point = doc.find(/([\S])( |$)/g,{backwards:true}); //backwards
		if(point) {
			doc.cursor.line(point.line);
			doc.cursor.char(point.char);
		}
	},

	'/^(b|B)/': function(keys,vim) {
		var doc = vim.curDoc;
		var point = doc.find(/(\S*)\s*(?=[\S]*)$/g,{ backwards: true });
		if(point) {
			doc.cursor.line(point.line);
			doc.cursor.char(point.char); //oh ho
		}
	},





	'/\\$/': function(keys,vim) {
		var curLine = vim.curDoc.line();

		/*vim.exec('/'); //search mode
		vim.exec('(.|\n)$'); //
		vim.exec('\n'); //go!
		vim.exec('/(.|\\n)$\n');*/

		var cursorPos = 0;
		if(curLine.length) {
			cursorPos = curLine.length-1 + (vim.curDoc.selecting ? 1 : 0);
		}


		vim.cursor().char(cursorPos);
	},

	/* go to beginning of line */
	'/^0/': function(keys,vim) {
		vim.cursor().char(0);
	},

	/* go to next word */
	'/^(w)$/': function(keys,vim) {
		var doc = vim.curDoc;

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
		var doc = vim.curDoc;
		var point = doc.find(/(?: |\^)(\S+)/g);
		if(point) { //there is a space, therefore a word
			doc.cursor.line(point.line);
			doc.cursor.char(point.char); 
		}

	},

	/* go to end of this word */
	'/^(e)$/': function(keys,vim) {
		var doc = vim.curDoc;
		var point = doc.find(/(\w)(?= |$)/g);
		if(point) { //there is a space, therefore a word
			doc.cursor.line(point.line);
			doc.cursor.char(point.char); //oh ho
		}
	},

	/* go to first non-whitespace character of this line */
	'/\\^/': function(keys,vim) {
		vim.exec('0');
		var doc = vim.curDoc;
		var point = doc.find(/(\S)/g);
		if(point) {
			doc.cursor.line(point.line);
			doc.cursor.char(point.char);
		}
	},




	/* Basic movement */

	'/^h$/': function(keys,vim) {
		var newChar = vim.cursor().char()-1;
		if(newChar < 0) return;
		vim.cursor().char(newChar);
	},

	'/^l$/': function(keys,vim) {
		var newChar = vim.cursor().char()+1;
		if(newChar >= vim.curDoc.line().length) return;
		vim.cursor().char(newChar);
	},

	'/^j$/': function(keys, vim) {
		var newLine = vim.cursor().line()+1;
		if(newLine >= vim.curDoc._lines.length) return;
		vim.cursor().line(newLine);
	},

	'/^k$/': function(keys, vim) {
		var newLine = vim.cursor().line()-1;
		if(newLine < 0) return;
		vim.cursor().line(newLine);
	},

	'/^([1-9]+[0-9]*)$/': function(keys, vim, res) {
		vim.keyBuffer += keys;
	},

	/* Go to line */
	'/^([1-9][0-9]*)G$': function(keys,vim,res) {

		//Zero indexed but referenced one-indexed
		var lineNumber = parseInt(res[1])-1;

		//Move line
		vim.curDoc.cursor.line(lineNumber);

		//Go to the beginning
		vim.exec('0');
	},

	/* go to first line */
	'/^gg$/': function(keys,vim,res) {
		vim.exec('1G');
	},

	/* go to last line */
	'/^G$/': function(keys,vim,res) {
		vim.exec('' + vim.curDoc._lines.length + 'G');
	},




	'^f(.)$': function(keys,vim,match) {  //convert to: f([\w])
		var lastSearch = this.curDoc.last('search');
		this.exec('/' + match[1] + '\n');
		this.curDoc.last('f','f' + match[1]);
		this.curDoc.last('search',lastSearch);
	},


	'^F(.)$': function(keys,vim,match) {  //convert to: f([\w])
		var lastSearch = this.curDoc.last('search');
		this.exec('?' + match[1] + '\n');
		this.curDoc.last('f','F' + match[1]);
		this.curDoc.last('search',lastSearch);
	},


	'^t(.)$': function(keys, vim, match) {  //convert to: f([\w])
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

		vim.curDoc.last('search',keys)

		vim.searchMode = match[1] === '/' ? 'forwards' : 'backwards';
		//var term = match[2].replace(/(\(|\))/,'\\$1');
		vim.searchBuffer = match[2];
		var pt = vim.curDoc.find(new RegExp('(' + vim.searchBuffer.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + ')','g'),{selection: true, backwards: vim.searchMode==='backwards'});
		if(pt) {
			vim.cursor().line(pt.line);
			vim.cursor().char(pt.char);
		}
	},

	/*'/^(\\/)/': function(keys,vim) {
		vim.searchMode = 'forward';
		vim.keyBuffer = '';
		vim.mode('search');
	},*/

	'/^n$/': function(keys, vim, res) {
		vim.exec(vim.curDoc.last('search'));
	},

	'/^N$/': function(keys, vim, res) {
		var last = vim.curDoc.last('search');
		if(!last) return;
		if(last.substring(0,1) === '?') {
			newLast = '/' + last.substring(1);
		} else {
			newLast = '?' + last.substring(1);
		}
		vim.exec(newLast);
		vim.curDoc.last('search',last)
	},


	
//MODES
	
	'/(esc)/': function(keys, vim) {
		vim.keyBuffer = ''
	},

//Insert mode
	'/^(i|s|S)/': function(keys,vim) {
		//vim.exec('h');
		if(!vim.curDoc._lines.length) { vim.curDoc._lines.push(''); }
		vim.mode('insert');
	},

	'/^(A)/': function(keys,vim) {
		vim.exec('$');
		vim.exec('a');
	},

	'/^(I)/': function(keys,vim) {
		vim.exec('0');
		vim.exec('i');
	},

	'/^v$/': function(keys,vim) {
		vim.mode('visual');
	},
	/* join */
	'/^J$/': function(keys,vim) {
		vim.exec('j');
		vim.exec('0');
		vim.exec('v');
		vim.exec('$');
		vim.exec('d');

		//Doing this rather than go to greater measures to delete the line.
		var copied = vim.register(0);
		copied = copied.substring(0,copied.length-1);
		vim.register(0,copied);

		vim.exec('k');
		vim.exec('$');
		var position = vim.curDoc.cursor.char();
		vim.exec('a');
		vim.exec(' ');
		vim.exec('esc');
		vim.exec('p');	
//		vim.curDoc.cursor.char(position);
		vim.curDoc.selection('reset');
		vim.exec('0');
		vim.exec(position+1 + 'l');
	},

	'/^o$/': function(keys,vim) {
		vim.exec('$');
		vim.exec('i');
		vim.exec('\n');
	},

	'/^O$/': function(keys,vim) {
		vim.exec('k');
		vim.exec('i');
		vim.exec('\n');
	},
	'/^a$/': function(keys,vim) {
		vim.exec('i');
		var doc = vim.curDoc;
		doc.cursor.char(doc.cursor.char()+1);
	},

	'/^([1-9]+[0-9]*)?(yy|cc|dd)$/': function(keys, vim, match) { //number
		var start = this.curDoc.cursor.position();

		vim.exec('0');
		vim.exec('v');
		var ct = 1;
		var to = parseInt(match[1]);
		if(!to) to = 1;
		while(ct < to) {
			ct++;
			vim.exec('j');
		}
		vim.exec('$');


		var text = vim.curDoc.getRange(vim.curDoc.selection());
		if(text.substring(text.length-1) === '\n') text = text.substring(0,text.length-1);
		vim.curDoc.yanking = false;

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
		vim.curDoc.yanking = false;

	},


	/* Set current register */
	'/^"([a-z])$/': function(keys, vim, match) {
		this.currentRegister = match[1];
	},


	/* paste after cursor */
	'/^(p|P)/': function(keys,vim,match) {
		var P = match[1] === 'P';
		var reg = this.register(0);

		//Don't execute nothing
		if(!reg || !reg.length) return;

		//Execute arrays as a sequence of commands
		if(_(reg).isArray()) {
			while(reg.length) {
				vim.exec(reg.shift());
			}
			vim.exec('esc');
		} else {
			//Otherwise treat as text
			vim.exec(P ? 'i' : 'a');
			vim.exec(reg);
			vim.exec('esc');
		}

	},

	'/^(P)/': function(keys,vim,res) {
		vim.exec('i');
		vim.exec(vim.register(0));
		vim.exec('esc');
	},


	/* Begin recording into specified registry */
	'/^q([a-z]?)$/': function(keys,vim,res) {
		if(this.recording) {
			this.register(this.recordingRegister,this.recordingBuffer);
			this.recording = false;
		} else if(res[1]) {
			vim.recording = true;
			vim.recordingRegister = res[1]
			vim.recordingBuffer = [];
			vim.preRecordText = vim.curDoc.text();
		} else {
			this.keyBuffer = 'q';
		}
		//grab the doc in a diff
		//vim.mode('recording');
	},


	/* End the recording if currently recording */
	/*'/^q$/': function(keys,vim) {
		if(vim.recording) {
			vim.recording = false;
			vim.curDoc.text(vim.preRecordText);
		}
	},*/

	/* Execute the command as stored in the register */
	'/^@([a-z])$/': function(keys,vim,res) {
		var commands = vim.register(res[1]);
		this.curDoc.last('macro',res[1]);
		if(typeof commands === 'string') {
			vim.exec(commands)
		} else {
			while(commands.length) {
				vim.exec(commands.shift());
			}
		}
	},

	'/^@@$/': function() {
		var last = this.curDoc.last('macro');
		if(last) {
			vim.exec('@' + last);
		}
	},

	/*'/([0-9]+)([hHjJkKlLwWbBeE(){}]|yy|dd|\[\[|\]\]|)/': function(keys,vim,result) {
		var ct = result[1];
		var command = result[2];
		while(ct--) vim.exec(command);
	}*/

/* REPLACE */

	'/^r(.)$/': function(keys, vim, match) {
		this.exec('x');
		this.exec('i');
		this.exec(match[1]);
		this.exec('esc');
	},

/* SHORTCUTS */

	'/^x$/': function(keys, vim, res) {
		vim.exec('v');
		vim.exec('d');
	},
	'/^X$/': function(keys, vim, res) {
		vim.exec('h');
		vim.exec('x');
	},
	'/^D$/': function(keys, vim, res) {
		vim.exec('d');
		vim.exec('$');
	},
	'/^C$/': function(keys, vim, res) {
		vim.exec('c');
		vim.exec('$');
	},
	'/^s$/': function(keys, vim, res) {
		vim.exec('c');
		vim.exec('l');
	},
	'/^S$/': function(keys, vim, res) {
		vim.exec('c');
		vim.exec('c');
	},

	'/^u$/': function(keys, vim, res) {
		this.curDoc.undo.apply(this)
	}

}
