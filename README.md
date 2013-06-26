#js-vim

A javascript implementation of the popular vi clone.

##Why bother?

We already edit a lot of code online. Bringing our editor of choice to the web makes that a more enjoyable process!

##Implementations

This repo contains the vim "model", which is currently implemented in [web-embeddable](https://github.com/itsjoesullivan/js-vim-embed/) and [terminal](https://github.com/itsjoesullivan/js-vim-node/) versions.

##Usage

What makes this project palatable is an extensible API:

```javascript
vim.addCommand({
	mode: 'command',
	match: 'o',
	fn: function() {
		//The lowercase 'o' command can be represented using these commands
		this.exec(['$','a','\n']);
	}
});
```

Aside from simplifying the process of defining current vim commands, it makes extending vim a cinch:

```javascript
//Open a file from dropbox
vim.addCommand({
	mode: 'command',
	match: /:o (.*)\n/,
	fn: function(path) {
		dropboxClient.readFile(path, function(err,data) {
			if(err) return this.notify("Error reading file");
			var doc = new this.Doc({
				text: data,
				path: path
			});
			this.add(doc);
		});
	}
});

//Save a file to dropbox
vim.addCommand({
	mode: 'command',
	match: /:w(?: (.*))?\n/,
	fn: function(path) {
		var doc = this.curDoc,
			path = path || doc.path;
		dropboxClient.writeFile(path, doc.text(), function(err) {
			if(err) return this.notify(err);
			this.notify('"' + path + '" written.');		
		});
	}
});
```

