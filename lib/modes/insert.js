module.exports = {

	'/^((?!backspace|\n|esc|\t).*)/': function(keys,vim) {
		vim.insert(keys);
	},

	'/(backspace)/': function(keys, vim) {
		vim.exec('esc');
		//vim.exec('h');
    vim.exec('x'); //not really.
    vim.exec('a');
	},
	'/\n/': function(keys, vim) {
		var doc = vim.curDoc;

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
	'/^\t$/': function(keys,vim) {
		vim.exec(' ');
		vim.exec(' ');
		vim.exec(' ');
		vim.exec(' ');

	}

};