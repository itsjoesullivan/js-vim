module.exports = {

	/* Any time you receive multiple keys in one go */
	'/^((?!backspace|esc)[\\w\\W][\\w\\W]+)$/': function(keys,vim) {
		var commands = keys.split('');
		while(commands.length) {
			vim.exec(commands.shift());
		}
	},

	'/^((?!backspace|\n|esc).)$/': function(keys,vim) {
		vim.insert(keys);
	},

	'/(backspace)/': function(keys, vim) {
		
		var atZero = !vim.curDoc.cursor.char()
		vim.exec('esc');
		//If at beginning
		if(atZero && vim.curDoc.cursor.line()) {
			vim.exec('k');
			vim.exec('J');
	    vim.exec('x');
		} else {
	    vim.exec('x');
	    //TODO make this work for removing lines

	  }
	  vim.exec('i');
	},
	'/^\n$/': function(keys, vim) {
		var doc = vim.curDoc;
		//TODO move this into doc.insert and treat as a normal key
		//shift down to the next line
		vim.cursor().line(vim.cursor().line()+1);

		//If it doesn't exist, create it
		if(doc._lines.length <= vim.cursor().line()) {
			doc._lines.push('');
		} else { //If it *does*, splice in an empty line to shift the rest of the text down
			doc._lines.splice(vim.cursor().line(),0,'');
		}

		//Go home
		vim.cursor().char(0);

		//
		doc.set({text: doc._lines.join('\n')});
	},
	'/^esc/': function(keys,vim) {
		vim.mode('command');
		vim.exec('h');
	},


};