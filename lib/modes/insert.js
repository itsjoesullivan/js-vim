module.exports = {

	/* Any time you receive multiple keys in one go */
	'/^((?!\b|esc)[\\w\\W][\\w\\W]+)$/': function(keys,vim) {
		var commands = keys.split('');
		while(commands.length) {
			vim.exec(commands.shift());
		}
	},

	'/^((?!\b|esc).)$/': function(keys,vim,match) {
		vim.insert(keys);
	},

    '/^\n$/': function() {
        var indent = this.curDoc._lines[this.curDoc.cursor.line()].match(/{\s*(?:\/\/.*|\/\*.*\*\/\s*)?$/);
        var ct = 0;
        if(indent) {
            var cursorChar = this.curDoc.cursor.char();
            this.exec('esc');
            this.exec('^');
            ct = this.curDoc.cursor.char() + 4;
            this.curDoc.cursor.char(cursorChar);
        }
        this.insert('\n');
        this.exec('i');
        while(ct--) {
            this.exec(' ');
        }
    },

	'/^(\b)$/': function(keys, vim) {
		var atZero = !vim.curDoc.cursor.char()
		vim.exec('esc');

		//Only backspace if there's somewhere to go.
		if(atZero &! vim.curDoc.cursor.line()) return ;

		//Do a join if at the beginning (i.e., deleting a carriage return)		
		if(atZero && vim.curDoc.cursor.line()) {
			vim.exec('k');
			vim.exec('J');
	    vim.exec('x');
		} else {
		//Otherwise just erase the character. This works because "esc" from insert decrements the cursor.
	    vim.exec('x');
	  }
	  vim.exec('i');
	},
	'/^esc/': function(keys,vim) {
		vim.mode('command');
		vim.exec('h');
	},


};
