module.exports = {
	'/^(i|s|S)/': function(keys,vim) {
		//vim.exec('h');
		if(!vim.curDoc._lines.length) { vim.curDoc._lines.push(''); }
		vim.mode('insert');
	},

	'/^(A)/': function(keys,vim) {
		vim.exec('$');
		vim.exec('a');
	},

	'/^v$/': function(keys,vim) {
		vim.mode('visual');
	},

	'/([0-9]*)(\\/|\\?)(.+)\\n/': function(keys,vim,match) {

		var ct = match[1] === '' ? 1 : parseInt(match[1]);
		vim.searchMode = match[2] === '/' ? 'forwards' : 'backwards';
		vim.mode('search');	
		var term = match[3].replace(/(\(|\))/,'\\$1');
		console.log('term is:',term);

		vim.exec(match[3]);
		vim.exec('\n');
		ct--;
		while(ct--) {
			vim.exec('n');
		}
	},

	/*'/^(\\/)/': function(keys,vim) {
		vim.searchMode = 'forward';
		vim.keyBuffer = '';
		vim.mode('search');
	},*/

	'/^(\\?)/': function(keys,vim) {
		vim.searchMode = 'backwards';
		vim.keyBuffer = '';
		vim.mode('search');
	},

	'/^n/': function(keys, vim, res) {
		var backwards = vim.searchMode === 'backwards';
		if('searchBuffer' in vim && vim.searchBuffer.length) {
			var pt = vim.curDoc.find(new RegExp('(' + vim.searchBuffer.replace(/(\(|\))/,'\\$1') + ')','g'),{selection: true, backwards: backwards});
			vim.cursor().line(pt.line);
			vim.cursor().char(pt.char);
		}
	},

	'/^N$/': function(keys, vim, res) {
		var originalMode = vim.searchMode;

		vim.searchMode = originalMode === 'backwards' ? 'forwards' : 'backwards';
		vim.exec('n');
		vim.searchMode = originalMode;

	},

	/* join */
	'/^J$/': function(keys,vim) {
		vim.exec('j');
		vim.exec('0');
		vim.exec('v');
		vim.exec('$');
		vim.exec('x');

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
	},

	'/(?:^|\\D)([1-9]+[0-9]*)n$/': function(keys,vim,res) {
		if(vim.curDoc.yanking) vim.exec('v');
		var ct = parseInt(res[1]);
		while(ct > 0) {
			vim.exec('n');
			ct--
		}
		if(vim.curDoc.yanking) vim.exec('y');
	},


	/* Basic movement */

	'/^h/': function(keys,vim) {
		var newChar = vim.cursor().char()-1;
		if(newChar < 0) return;
		vim.cursor().char(newChar);
	},

	'/^l/': function(keys,vim) {
		var newChar = vim.cursor().char()+1;
		if(newChar >= vim.curDoc.line().length) return;
		vim.cursor().char(newChar);
	},

	'/(^|\\D)j/': function(keys, vim) {
		var newLine = vim.cursor().line()+1;
		if(newLine >= vim.curDoc._lines.length) return;
		vim.cursor().line(newLine);
	},

	'/^k/': function(keys, vim) {
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

	'/([1-9]+[0-9]*)(h|j|k|l|w|W|b|B|x|e)/': function(keys,vim,res) {
		//if yanking, go to visual mode

		//perform motion
		var ct = parseInt(res[1]);
		var command = res[2];
		while(ct--) {
			vim.exec(command);
		}

		//perform yank
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

		//The big/small word rule seems to be: treat switching between alphanumeric/special characters as a space

		//go to end because we arent actually testing for a space here
		//vim.exec('e');

		//var point = doc.find(/(?:\w+|[^A-z^\s])(\w+|[^A-z^\s])/g);
		var point = doc.find(/(?:(?:[\w ])([^A-z^\s])|(?:[^A-z])(\w))/g);
		
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
			doc.cursor.char(point.char); //oh ho
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

	'/^a$/': function(keys,vim) {
		vim.exec('i');
		var doc = vim.curDoc;
		doc.cursor.char(doc.cursor.char()+1);
	},

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

	/*
		Remove selected text
	*/
	'/^x/': function(keys,vim) {

		var doc = vim.curDoc;

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

		//If nothing replaced that bit, move to the left
		if(doc.line(doc.cursor.line()).length <= doc.cursor.char() && doc.cursor.char() > 0) {
		}
	},

	'/^([1-9]+[0-9]*)dd/': function(keys, vim,res) { //number
		//vim.exec('yy');
		vim.exec('0');
		vim.exec('v');
		var ct = 1;
		var to = parseInt(res[1]);
		while(ct < to) {
			ct++;
			vim.exec('j');
		}
		//while(ct-- > 0) 
		vim.exec('$');

		var range = vim.curDoc.selection();
		if(range[1].char === 1) { //if this is an empty line, treat it differently 
															// because dd and x behave differently here.
			vim.curDoc.remove(vim.curDoc.selection()); //remove it
			vim.exec('esc');
		} else {
			vim.exec('x');
		}
	},

	//Delete this line and copy it.
	'/^dd/': function(keys,vim) {

		vim.exec('1dd');
		//vim.exec('yy');
		/*vim.exec('0');
		vim.exec('v');
		vim.exec('$');

		var range = vim.curDoc.selection();
		if(range[1].char === 1) { //if this is an empty line, treat it differently 
															// because dd and x behave differently here.
			vim.curDoc.remove(vim.curDoc.selection()); //remove it
			vim.exec('esc');
		} else {
			vim.exec('x');
		}*/
		
		

	},



	'/(?:^|\\D)f(.)/': function(keys, vim, res) {
		var character = res[1];
		vim.exec('1f' + character);
	},

	'/(?:^|\\D)([1-9]+[0-9]*)f(.)/': function(keys, vim, res) {
		var ct = parseInt(res[1]);
		var character = res[2];
		vim.exec('/');
		vim.exec(character);
		vim.exec('\n');
		ct--;
		while(ct > 0) {
			vim.exec('n');
			ct--
		}
	},

	'/(?:^|\\D)([1-9]+[0-9]*)t(.)/': function(keys, vim, res) {
		var ct = parseInt(res[1]);
		var character = res[2];
		vim.exec('l');
		vim.exec('' + ct + 'f' + character);
		vim.exec('h');
		
	},

	'/(?:^|\\D)t(.)/': function(keys, vim, res) {
		var character = res[1];
		vim.exec('1t' + character);
	},

	/* paste after cursor */
	'/^(p)/': function(keys,vim,res) {
		var reg = vim.register(0);
		if(!reg) return;

		//If a command string
		if(reg.command) return vim.exec(reg);

		//Otherwise treat as text
		vim.exec('a');
		vim.exec(vim.register(0));
		vim.exec('esc');
	},

	'/^(P)/': function(keys,vim,res) {
		vim.exec('i');
		vim.exec(vim.register(0));
		vim.exec('esc');
	},

	'/^(y)$/': function(keys, vim, res) {
		if(vim.curDoc.yanking) return vim.exec('yy');
		vim.exec('v');
		vim.curDoc.yanking = true;
	},

	'/^(d)$/': function(keys, vim, res) {
		if(vim.curDoc.deleting) return vim.exec('dd');
		vim.curDoc.deleting = true;
		vim.exec('y');
	},

	'/^(c)$/': function(keys, vim, res) {
		if(vim.curDoc.changing) return vim.exec('cc');
		vim.curDoc.changing = true;
		vim.exec('d');
	},


	'/^yy$/': function(keys,vim,res) {

		vim.exec('v');
		vim.exec('0');
		vim.exec('$');
		var text = vim.curDoc.getRange(vim.curDoc.selection());
		var command = 'o' + text;
		command.command = true;	//Indicate that this is a command, not a string of text.	
		vim.register(0,command);
		vim.curDoc.yanking = false;

	},

	/* Begin recording into specified registry */
	'/^q([a-z])$/': function(keys,vim,res) {
		//grab the doc in a diff
		vim.recording = true;
		vim.recordRegister = res[1];
		vim.preRecordText = vim.curDoc.text();
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
		vim.exec(commands);
	},

	/*'/([0-9]+)([hHjJkKlLwWbBeE(){}]|yy|dd|\[\[|\]\]|)/': function(keys,vim,result) {
		var ct = result[1];
		var command = result[2];
		while(ct--) vim.exec(command);
	}*/
}
