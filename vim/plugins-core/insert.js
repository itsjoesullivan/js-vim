var insertObj = {
    'insert': {
        'backspace': function() {
            if(cursor.char) {
                return vim.exec(['escape','h','x','i']);
            } else if(cursor.line) {
                var thisLine = vim.get('doc').get('lines').at(cursor.line),
			remainder = thisLine.toText();
                thisLine.delete();
                vim.exec(['escape','k','$','i']);
		if(remainder.length) {
	                vim.exec(remainder.split(''));
		}
            }
        },
        '\[^\\b\]': function(key,keyCode) {
            vim.get('doc').add(key,keyCode);
        }
    },
	on: {
		'insert': function() {
			vim.notify('-- INSERT --');
		}
	}
}

vim.extend(insertObj);
