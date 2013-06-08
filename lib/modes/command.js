module.exports = {
	'/^(i|s|S)/': function(keys,vim) {
		//vim.exec('h');
		if(!vim.curDoc._lines.length) { vim.curDoc._lines.push(''); }
		vim.mode('insert');
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

	'/^j/': function(keys, vim) {
		var newLine = vim.cursor().line()+1;
		if(newLine >= vim.curDoc._lines.length) return;
		vim.cursor().line(newLine);
	},

	'/^k/': function(keys, vim) {
		var newLine = vim.cursor().line()-1;
		if(newLine < 0) return;
		vim.cursor().line(newLine);
	},

	'/([0-9]+)(h|j|k|l|w|W|b|B)/': function(keys,vim,res) {
		var ct = parseInt(res[1]);
		var command = res[2];
		while(ct--) {
			vim.exec(command);
		}
	},

	'/^o/': function(keys,vim) {
		vim.exec('$');
		vim.exec('i');
		vim.exec('\n');
	},

	'/\\$/': function(keys,vim) {
		var curLine = vim.curDoc.line();
		vim.cursor().char(curLine.length-1);
	},

	'/^(w|W)/': function(keys,vim) {
		var doc = vim.curDoc;
		var point = doc.find(/ (.*)/);
		if(point) { //there is a space, therefore a word
			doc.cursor.line(point.line);
			doc.cursor.char(point.char); //oh ho
		}
	},

	'/\\^/': function(keys,vim) {
		vim.exec('0');
		var doc = vim.curDoc;
		var point = doc.find(/(\S)/);
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
		var point = doc.find(/([\S])( |$)/,true); //backwards
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

	'/^x/': function(keys,vim) {
		var doc = vim.curDoc;

		//Grab the selection
		var range = doc.selection();

		//Don't kill the line
		if(range[0].line === range[1].line &! doc.line(range[0].line).length) return;

		doc.remove(range);

		//Move to the beginning of the range
		doc.cursor.char(range[0].char);
		doc.cursor.line(range[0].line);

		//If nothing replaced that bit, move to the left
		if(doc.line().length <= doc.cursor.char()) {
			doc.cursor.char(doc.cursor.char()-1);
		}




	},

	'/^n/': function(keys, vim) {
		if('searchBuffer' in vim && vim.searchBuffer.length) {
			var pt = vim.curDoc.find(new RegExp('(' + vim.searchBuffer + ')'));
			vim.cursor().line(pt.line);
			vim.cursor().char(pt.char);
		}
	},

	/*'/([0-9]+)([hHjJkKlLwWbBeE(){}]|yy|dd|\[\[|\]\]|)/': function(keys,vim,result) {
		var ct = result[1];
		var command = result[2];
		while(ct--) vim.exec(command);
	}*/
}