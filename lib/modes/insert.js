module.exports = {

	'/^((?!backspace|\n).*)/': function(keys,vim) {
		vim.insert(keys);
	},
	'/(backspace)/': function(keys, vim) {
		vim.exec('esc');
		vim.exec('h');
    vim.exec('x'); //not really.
    vim.exec('i');
	},
	'/\n/': function(keys, vim) {
		//new line
		var doc = vim.curDoc;
		vim.cursor().line(vim.cursor().line()+1);
		vim.cursor().char(0);
		doc._lines.splice(vim.cursor().line(),0,'');
		doc.set({text: doc._lines.join('\n')});
		console.log('new lne');
	}

};