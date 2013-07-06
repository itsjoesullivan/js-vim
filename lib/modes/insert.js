module.exports = {

	/* Any time you receive multiple keys in one go */
	'/^((?!\b|esc)[\\w\\W][\\w\\W]+)$/': function(keys,vim) {
        for(var i = 0; i < keys.length; i++ ) {

            this.exec(keys.substring(i, i+1));
        }
	},

	'/^((?!\b|esc|}).)$/': function(keys,vim,match) {
		vim.insert(keys);
	},

    '/^}$/': function() {
        if(this.rc.smartindent && this.curDoc._lines[this.curDoc.cursor.line()].match(/^\s*$/)) {
            var ct = this.rc.tabstop;
            this.exec('esc');
            while(ct--) {
                this.exec('X');
            }
            this.exec('i');
        }
        this.insert('}');

    },

    '/^\n$/': function() {
        if(!this.rc.smartindent) {
            this.insert('\n');
        } else {
            var thisLine = this.curDoc._lines[this.curDoc.cursor.line()];
            var indent = thisLine.match(/{\s*(?:\/\/.*|\/\*.*\*\/\s*)?$/);
            curChar = this.curDoc.cursor.char();
            this.exec('esc');
            this.exec('^');
            
            //Assume you're indenting to the first non-blank char
            var ct = this.curDoc.cursor.char();
            //Unless it's all blank, then to zero.
            if(thisLine.match(/^\s*$/)) { ct = 0; }

            this.curDoc.cursor.char(curChar);
            this.insert('\n');

            if(indent) {
                ct += this.rc.tabstop;
            }
            this.exec('i');
            while(ct-- > 0) {
                this.exec(' ');
            }
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
