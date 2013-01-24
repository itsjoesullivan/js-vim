var Cursor = Backbone.Model.extend({
	line: 0,
	char: 0,
	position: {
		line: 0,
		char: 0
	},
	initialize: function() {
		this.set('view', new CursorV({
			model: this
		}));
		this.on('change:line', function(m, v, o) {
			this.position.line = this.line = v;
			this.get('view').render();
		}, this);
		this.on('change:char', function(m, v, o) {
			this.position.char = this.char = v;
			this.get('view').render();
		}, this);

	},
	nextLine: function() {
		var lines = doc.get('lines').length;
		if (lines - 1 > cursor.line) {
			return cursor.set('line', cursor.line + 1);
		}
		if (lines > 1) {
			return cursor.set('line', 0);
		}
	},

	/* Expect
	 * 	[ [ startLine, startChar], [ endLine, endChar ] ]
	 */
	highlight: function(range) {
		if (vim.get('selection')) {
			this.unHighlight();
		}
		var startLine = range[0][0],
			startChar = range[0][1],
			endLine = range[1][0],
			endChar = range[1][1];
		var curLine = startLine;
		var chars = doc.get('lines').at(startLine).get('chars').rest(startChar);
		if (endLine === startLine) {
			chars = chars.slice(0, endChar - startChar + 1);
		} else {
			while (++curLine < endLine) {
				chars = chars.concat(doc.get('lines').at(curLine).get('chars').toArray());
			}
			chars = chars.concat(doc.get('lines').at(curLine).get('chars').first(endChar));
		}
		vim.set('selection', chars);
		chars.forEach(function(char) {
			$(char.get('el')).addClass('highlight');
		})
		$(_(chars).first().get('el')).addClass('first');
		$(_(chars).last().get('el')).addClass('last');

	},
	unHighlight: function() {
		if(vim.get('selection')) {
			vim.get('selection').forEach(function(char) {
				$(char.get('el')).removeClass('highlight');
				$(char.get('el')).removeClass('last');
				$(char.get('el')).removeClass('first');
			});
		}
		     }
});

var CursorV = Backbone.View.extend({
	el: json2html({
		'pre.cursor': ' '
	}),
	render: function() {
		var position = this.model.position;
		if (position.line < 0) {
			this.model.set('line', 0);
			return this.render();
		}
		if (position.char < 0) {
			this.model.set('char', 0);
			return this.render();
		}
		//move the cursor to the position that you're in by inserting it after the previous character on that line.
		if (!vim.get('doc').get('lines').length) {
			vim.set('mode', 'idle');
			return;
		}
		var line = doc.get('lines').at(position.line);

		if (line.get('chars').length < position.char) {
			this.model.set('char', line.get('chars').length);
		}
		if(!line.get('chars').length) {
			$(line.get('view').el).append(this.el);
		} else { //otherwise find the last char and 
			$(line.get('chars').at(position.char === 0 ? 0 : position.char - 1).get('el')).after(this.el);
		}

		//we fuck up the character we're on top of to keep the cursor relatively positioned. So, if we did, put it back.
		if (this.fixThisOne) {
			this.fixThisOne.style.display = 'inline';
		}

		//check if we're on top of a character. grab its value and display that, then hide it under fixThisOne, and switch the cursor colors.
		var onTopOf = doc.get('lines').at(position.line).get('chars').at(position.char);
		if (onTopOf) {
			this.el.style.color = '#333';
			this.el.innerHTML = onTopOf.get('val');
			this.fixThisOne = onTopOf.get('el');
			this.fixThisOne.style.display = 'none';
		} else {
			this.el.style.color = '#eee';
			this.el.innerHTML = ' ';
		}
		this.el.scrollIntoViewIfNeeded();
	}
});
