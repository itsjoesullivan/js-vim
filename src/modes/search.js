(function() {
	var searchString = '';
var search = {
	'on': {
		'search':function() {
			if(!doc.get('lines').length) {
				vim.notify('No text to search');
				vim.set('mode','idle');
				return;
			}
			searchString = '/';
			vim.notify(searchString);
		}
	},
	'idle': {
		'/': function() {
			vim.set('mode', 'search');
		}
	},
	'search-results': {
		//find character
		'n': function() {
			var found = -1;
			while(found === -1) {
				cursor.nextLine();
				var text = doc.get('lines').at(cursor.line).toText();
				found = text.indexOf(searchString.substring(1));
			}
				if(found > -1) {
					cursor.set('char',found);
					cursor.highlight([ [cursor.line, cursor.char],[cursor.line, cursor.char+searchString.substring(1).length ] ]);
				}
		},
		'escape': function() {
			vim.set('mode','idle');
		}
	},
	'search': {
		'\[\\w\]': function(val) {
			searchString += val;
			vim.notify(searchString);
		},
		'\r': function() {
			vim.set('mode','search-results');
			vim.exec('n');
		}
	}
};

vim.extend(search);
}());
