(function() {
	var command = '';
var commandObj = {
    'idle': {
	    ':': function() {
		    vim.set('mode','command');
	    }
	},
    'command': {
        'backspace': function() {
        },
	'\r': function() {
		execCommand(command);
	},
        '\[^\\b\^\\r\]': function(key,keyCode) {
		command += key;
		vim.notify(command);
        }
    },
	on: {
		'command': function() {
			vim.notify(command);
			vim.exec(':');
		}
	}
};
var execCommand = function(commandString) {
	switch(commandString.substring(1)) {
		
		case 'w': 
			var text = doc.toText();
			localStorage['doc'] = text;
			vim.notify('doc ' + doc.get('lines').length + 'L, ' + text.length + 'C written.') 
				command = '';
	}
};

vim.extend(commandObj);
}());
