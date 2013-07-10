var _ = require('underscore');
var mark = require('../mark');

module.exports = {

	/* Any time you receive multiple keys in one go */
	'/^((?!\b|esc)[\\w\\W][\\w\\W]+)$/': function(keys,vim) {
        for(var i = 0; i < keys.length; i++ ) {
            this.exec(keys.substring(i, i+1));
        }
	},

	'/^((?!\b|esc|}).)$/': function(keys,vim,match) {
		this.currentInsertedText = this.currentInsertedText.concat(keys);
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

    '/^\n$/': function(keys) {
		this.currentInsertedText = this.currentInsertedText.concat(keys);
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
		if(this.currentInsertedText.length) this.currentInsertedText = this.currentInsertedText.substring(0,this.currentInsertedText.length-1);
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
		//Handle text

		vim.mode('command');
		vim.exec('h');

		if(this.submode === 'block') {
			this.submode = '';
			var lastText = this.currentInsertedText;
			//For each line that was a part of that block selection
			var meaningfulSelection = this.lastSelection.slice(1);
			_(meaningfulSelection).each(function(range) {
				//Move to the beginning of the selection on that line
				this.curDoc.cursor.position(range[0]);
				this.exec('i');
				this.exec(lastText);
				this.exec('esc');
			},this);
			this.curDoc.cursor.position(this.lastSelection[0][0]);

		}

		this.register('.',this.currentInsertedText);
		this.currentInsertedText = this.currentInsertedText.substring(0,0);



	},


};
