(function() {
	var start,
	end;
	var visual = {
		idle: {
			'v': function() {
				vim.set('mode', 'visual');
			}
		},
		on: {
			'visual': function() {
				vim.notify('-- VISUAL --');
				if(!start) {
					start = [cursor.line, cursor.char];
				}
				if(!end) {
					end = [cursor.line, cursor.char];
				}
			},
			'visual-resume': function() {
				end = [cursor.line, cursor.char];
				vim.set('mode','visual');
			},
			'escape': function() {
				start = end = false;
			}
		},
		visual: {
			'\[hjkl0$\]': function(key) {
				vim.exec(['escape', key]);
				end = [cursor.line,cursor.char];
				vim.set('mode', 'visual');
				cursor.highlight([start, end]);
			},
			'y': function() {
				vim.exec('escape');
				vim.exec('yank');
			}
		},
	};
	vim.extend(visual);
}());
