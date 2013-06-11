module.exports = {
	'/^(i|s|S)/': function(keys,vim) {
		//vim.exec('h');
		if(!vim.curDoc._lines.length) { vim.curDoc._lines.push(''); }
		vim.mode('insert');
	},

	'/^v$/': function(keys,vim) {
		vim.mode('visual');
	},

	'/^(\\/)/': function(keys,vim) {
		vim.mode('search');
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

	'/([0-9]+)(h|j|k|l|w|W|b|B|x)/': function(keys,vim,res) {
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

	'/^0/': function(keys,vim) {
		vim.cursor().char(0);
	},

	'/^(w|W)/': function(keys,vim) {
		var doc = vim.curDoc;
		var point = doc.find(/(?: |^)(\w+)/g);
		if(point) { //there is a space, therefore a word
			doc.cursor.line(point.line);
			doc.cursor.char(point.char); //oh ho
		}
	},


	'/\\^/': function(keys,vim) {
		vim.exec('0');
		var doc = vim.curDoc;
		var point = doc.find(/(\S)/g);
		if(point) {
			doc.cursor.line(point.line);
			doc.cursor.char(point.char);
		}
	},

	'/^a/': function(keys,vim) {
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
		var point = doc.find(/(.*) /,true);
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

		//Move to the beginning of the range
		if(range[0].line >= doc._lines.length) {
			doc.cursor.line(doc._lines.length-1)
		} else {
			doc.cursor.line(range[0].line);
		}
		doc.cursor.char(range[0].char);


		//If nothing replaced that bit, move to the left
		if(doc.line().length <= doc.cursor.char() && doc.cursor.char() > 0) {
			//doc.cursor.char(doc.cursor.char()-1);
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

	'/^n/': function(keys, vim, res) {
		if('searchBuffer' in vim && vim.searchBuffer.length) {
			var pt = vim.curDoc.find(new RegExp('(' + vim.searchBuffer + ')','g'),{selection: true});
			vim.cursor().line(pt.line);
			vim.cursor().char(pt.char);
		}
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

	/* paste after cursor */
	'/^(p)/': function(keys,vim,res) {
		vim.exec('a');
		vim.exec(vim.register(0));
		vim.exec('esc');
	},

	'/^(P)/': function(keys,vim,res) {
		vim.exec('i');
		vim.exec(vim.register(0));
		vim.exec('esc');
	},

	'/^yy/': function(keys,vim,res) {

		vim.exec('v');
		vim.exec('0');
		vim.exec('$');
		var text = vim.curDoc.getRange(vim.curDoc.selection());
		vim.register(0,'\n' + text);

	},

	/*'/([0-9]+)([hHjJkKlLwWbBeE(){}]|yy|dd|\[\[|\]\]|)/': function(keys,vim,result) {
		var ct = result[1];
		var command = result[2];
		while(ct--) vim.exec(command);
	}*/
}