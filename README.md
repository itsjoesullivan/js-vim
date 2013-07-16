#js-vim

![Build status](https://api.travis-ci.org/itsjoesullivan/js-vim.png)

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

##License

The MIT License (MIT)

Copyright (c) 2013 Joe Sullivan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
