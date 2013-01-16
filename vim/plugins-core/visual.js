(function() {
	var start,
		end;
	var visual = {
		idle: {
			'v': function() {
				vim.set('mode','visual');
			}
		},
		on: {
			'visual': function() {
				vim.notify('-- VISUAL --');
				start = [cursor.line,cursor.char];
				console.log(start);
				end = [cursor.line,cursor.char];
			},
			'visual-resume': function() {
				end = [cursor.line,cursor.char];
			}
		},
		visual: {
			'\[hjkl\]': function(key) {
				console.log(key);
				vim.exec(['escape',key]);
				vim.set('mode','visual-resume');
				console.log([start,end]);
				cursor.highlight([start,end]);
			}
		}
	};
	vim.extend(visual);
}());
