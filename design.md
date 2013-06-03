##Explanation for the overall design

This is a slight elaboration of README for the sake of communicating the core of the design.

This project views vim's extensibility as arising from the interchangeability of various key commands:

```javascript
	'2dd' -->		'dd', 'dd'

	'dd' -->		'0','v','$','x','backspace'
```

So, if we define a few core commands:

```javascript
  v: begin selection
  0: move to beginning of line
  $: move to end of line
  x: delete selection
```

Then define a few other commands:

```
	'dd': ['0','v','$','x','backspace']
	'2dd': ['dd','dd']
```

We start to get some of that extensibility.

If we implement commands as key/value pairs where keys are regular expressions and values are functions:

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

Any key combination can take advantage of the others, but they can do whatever they want. Looking down the road a bit:

```javascript
	// /src/modes/github.js

	//imagine this exists, which it kind of does.
	var git = new Github({username: cred.username, password: cred.password});
	var repo = git.getRepo('itsjoesullivan/vim');

	vim.fileSystem.addDirectory('itsjoesullivan/van',repo.ls()); //maybe we could add a filesystem here

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
