##Explanation for the overall design

This is a slight elaboration of README for the sake of communicating the core of the design.

This project views vim's extensibility as arising from the interchangeability of various key commands:

```
	'2dd' -->		'dd', 'dd'

	'dd' -->		'0','v','$','x','del'
```

So, if we define a few core commands:

```
  v: begin selection
  0: move to beginning of line
  $: move to end of line
  x: delete selection
```

Then define a few other commands:

```
	'dd': ['0','v','$','x','del']
	'2dd': ['dd','dd']
```

We start to get some of that extensibility.

###In code

If we implement commands as key/value pairs, where keys are regular expressions and values are functions:

```javascript
	/([0-9]+)dd/: function(result) { //result is /([0-9]+)dd/.exec(keyBuffer)
		vim.exec(['0','v']);
		var ct = parseInt(result[1]); //the captured number
		while(ct--) {
			vim.exec('j');
		}
		vim.exec(['$','x','backspace']);
	}
```

We can be clever:

```javascript
	/dd/: function(result) {
		vim.exec('1dd');
	};
```

###Command definition API

Commands depend on mode, so they are declared like:

```javascript
	vim.addMode({
		'insert': {
			'(.*)': function(res) {
				vim.insert(res[0]);
			}
		}
	});

	vim.addMode({
		'command': {
			'i': function() {
				vim.mode = 'insert';
			},
			'j': function(res) {
				vim.cursor.line--;
			},
	    ...
	  }
	});
```

###Useful functionality

Any key combination can take advantage of the others, but they can do whatever they want. Looking down the road a bit:

```javascript
	// /src/modes/github.js

	//imagine this exists, which it kind of does.
	var git = new Github({username: cred.username, password: cred.password});
	var repo = git.getRepo('itsjoesullivan/vim');

	vim.fileSystem.addDirectory('itsjoesullivan/vim',repo.ls()); //maybe we could add a filesystem here

	/*
		now:
			vim.exec(':cd itsjoesullivan/vim'); //imagine this exists
			vim.exec(':e index.html'); //opens file at https://github.com/itsjoesullivan/vim/index.html
	*/

	vim.addMode({
		'github': {
			/gh push/: function(res) {
				repo.push(); //imagining we've connected to github, the document came from there, whatever.
			},
			/gh add (.*)/: function(res) {
				repo.add(res[1]); //let git handle "index.*" vs "index.html"
			},
			/gh commit (.*)/: function(res) {
				repo.commit(res[1]); //similar.
			}
		}
	});
```

###Testing

Testing of key operations is very straightforward:

```javascript
describe('command::x', function() {
	it('erases current character', function() {
		vim.doc.set('hello\nworld');
		vim.exec(['gg','x']);
		expect(vim.doc.get()).equal('ello\nworld');
	});
});
```

###Rendering

One reason that vim as a web app is cool is because, from a rendering perspective, it's very simple (it runs on old computers!), so it's a good way begin to create an "app" feel in the browser. However, for that reason, it deviates a lot from the DOM paradigm. For example, semantic html would put the entire application into a \<textarea>. Needless to say, that's not helpful. A Backbone-oriented MV system puts each character in its own view (\<span class='char'>h\</span>), which again is not terrifically helpful. A rendering framework that takes some of the manual rendering work out of, say, changing the 'function' keyword a certain color for the sake of syntax highlighting, would be welcome in this project.

###Other stuff

There are other dimensions to vim than text editing: syntax highlighting; formatting; plugins; ... . Those dimensions can largely be implemented alongside the above syntax. The above architecture says nothing about document structure, and it's possible to define such structure in a custom mode, though likely that's better defined at a lower level along with rendering logic. The main point is that the above design allows most development to occur at a relatively high level that's roughly the equivalent of key commands. Only a handful of operations (search, delete, insert, select, move, copy) need to operate on the application internals / document structure. 
