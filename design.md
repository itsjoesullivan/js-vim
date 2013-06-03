##Explanation for the overall design

This is a slight elaboration of README for the sake of communicating the core of the design.

This project views vim's extensibility as arising from the interchangeability of various key commands:

	'2dd' -->		'dd', 'dd'

  'dd' -->		'0','v','$','x','backspace'

So, if we define a few core commands:

  v: begin selection
  0: move to beginning of line
  $: move to end of line
  x: delete selection

Then define a few other commands:

	'dd': ['0','v','$','x','backspace']
	'2dd': ['dd','dd']

We start to get some of that extensibility.

If we implement commands as key/value pairs where keys are regular expressions and values are functions:

	/([0-9]+)dd/: function(result) { //result is /([0-9]+)dd/.exec(keyBuffer)
		vim.exec(['0','v']);
		var ct = parseInt(result[1]); //the captured number
		while(ct--) {
			vim.exec('j');
		}
		vim.exec(['$','x','backspace']);
	}

We can be clever:

	/dd/: function(result) {
		vim.exec('1dd');
	};

Commands depend on mode, so they are declared like:

	vim.addMode({
		'insert': {
	    '(.*)': function(res) {
	    	vim.insert(res[0]);
	    }
	  }
	});

	vim.addMode({
		'command': {
	    'j': function(res) {
	    	vim.cursor.line--;
	    },
	    ...
	  }
	});

