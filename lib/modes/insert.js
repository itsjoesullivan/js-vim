module.exports = {

	/* Any time you receive multiple keys in one go */
	'/^((?!\b|esc)[\\w\\W][\\w\\W]+)$/': function(keys,vim) {
		var commands = keys.split('');
		while(commands.length) {
			this.exec(commands.shift());
		}
	},

	'/^((?!\b|esc|}).)$/': function(keys,vim,match) {
		vim.insert(keys);
	},

    '/^}$/': function() {
        if(this.curDoc._lines[this.curDoc.cursor.line()].match(/^\s*$/)) {
            this.exec('esc');
            this.exec('X');
            this.exec('X');
            this.exec('X');
            this.exec('X');
            this.exec('a');
        }
        this.insert('}');

    },

    '/^\n$/': function() {
        var indent = this.curDoc._lines[this.curDoc.cursor.line()].match(/{\s*(?:\/\/.*|\/\*.*\*\/\s*)?$/);
        curChar = this.curDoc.cursor.char();
        this.exec('esc');
        this.exec('^');
        var ct = this.curDoc.cursor.char();
        this.curDoc.cursor.char(curChar);


        if(indent) {
            ct += 4;
        }
        this.insert('\n');
        this.exec('i');
        while(ct-- > 0) {
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
