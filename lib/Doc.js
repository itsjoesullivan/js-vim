var Cursor = require('./Cursor');

var Event = require('./Event');

Doc = function(obj) {

	this.cursor = new Cursor();
	this.cursor.doc = this;
	this.cursor.on('change', function() {
		this.trigger('change:cursor');
	}.bind(this));

	this._text = '';
	this._lines = [];
	this._undo = [];

	this.selecting = false; //The document behaves differently when navigating vs. selecting
	this.yanking = false; //'yanking' sub-mode
	if(typeof obj === 'object') {
		if('text' in obj) {
			this._text = obj.text;
		}
	}

	this._selection = [];

	if(this._text.length) this._lines = this._text.split('\n');
};

Doc.prototype = new Event();
var _lasts = [];

/** Repeating commands need to look up the parameters for the command that happened! Store it here.

*/
Doc.prototype.last = function(k,v) {
	if(v) { return _lasts[k] = v; }
  return _lasts[k];
};

var Undo = function() {
	this._undos = [];
};
Undo.prototype.add = function(patch) {
	this._undos.unshift(patch);
};
Undo.prototype.get = function() {
	return this._undos[0];
};

Undo.prototype.apply = function(vim) {
	var lastChange = this._undos.shift();	
	var curText = vim.curDoc.text(); 
	var oldText = vim.dmp.patch_apply(lastChange, curText)[0];
	vim.curDoc.text(oldText)
};

Doc.prototype.undo = new Undo();



Doc.prototype.set = function(k,v) {
	var obj;
	if(v && typeof k === 'string') {
		obj = {};
		obj[k] = v;
		return this.set(obj);
	}
	obj = k;
	for(var i in obj) {
		if(obj.hasOwnProperty(i)) {
			this['_' + i] = obj[i];
			this.trigger('change:' + i,obj[i]);
		}
	}
};

//Getter / setter
Doc.prototype.text = function(text) {
	if(text) {
		this._text = text;
		this._lines = this._text.split('\n');
		this.trigger('change:text');
	}
	return this._text;
};

Doc.prototype.getRange = function(range) {

	var text = '';

	//if same line, just do as one
	if(range[0].line === range[1].line) {
		text = this.line(range[0].line).substring(range[0].char,range[1].char);
	} else {

		//else start by grabbing rest of this line
		text += this.line(range[0].line).substring(range[0].char);

		//if more lines, add each with an \n before
		var middleLineCount = range[1].line - range[0].line;
		var ct = 1;
		while(ct < middleLineCount) {
			text += '\n' + this.line(range[0].line + ct);
			ct++;
		}

		//add the first bit of the last line
		var lastLine = this.line(range[1].line);
		text += '\n' + lastLine.substring(0,range[1].char);

	}

	//If it extends beyond the actual text add a return
	if(range[1].char > this.line(range[1].line).length) {
		text += '\n';
	}

	return text;

};

//Retrieve the line at num; default to cursor if no num
Doc.prototype.line = function(num) {
	if(typeof num !== 'number') num = this.cursor.line();
	if(this._lines.length <= num) {
		if(this.cursor.line() === 0) {
			this._lines.push('');
		} else {
			throw "Line out of range of document";
		}
	}
	return this._lines[num];
};

//Input text
Doc.prototype.insert = function(text) {



	if(typeof text !== 'string') throw "Only strings can be inserted into a doc";

	if(text.length > 1) {
		var chars = text.split('');
		while(chars.length) this.insert(chars.shift());
		return;
	}

	var curLine = this.line();
	curLine = curLine.substring(0,this.cursor.char()) + text + curLine.substring(this.cursor.char(),curLine.length);
	if(text === '\n') {
		var curLineIndex = this.cursor.line();
		var lines = curLine.split('\n');
		this._lines[curLineIndex] = lines[0];
		this._lines.splice(curLineIndex+1,0,lines[1]);
		this.cursor.line(curLineIndex+1);
		this.cursor.char(0);
	} else {
		this._lines[this.cursor.line()] = curLine;
		this.cursor.char(this.cursor.char()+text.length);
	}


	this.set({text: this._lines.join('\n')});
};

/** Remove removes a range of characters like:

	[
		//from
		{
			char: number,
			line: number
		},
		//to
		{
			char: number,
			line: number
		}
	]

*/
Doc.prototype.remove = function(range) {
	//if invalid
	if(!isRange(range)) throw 'Not a valid range.';

	//grab first half of line if exists
	var first = this._lines[range[0].line].substring(0,range[0].char);

	//check if joining after, determined by whether there's anything left of the line.
	var join = range[1].char >= this._lines[range[1].line].length ? true : false;

	//grab end of other line if exists
	var last = this._lines[range[1].line].substring(range[1].char);

	//if the last line is entirely selected, remove it.

	//if the entire 
	var deleteLastLine = (!range[0].char //range opens at first character of a line
		|| range[0].line < range[1].line) //or range opens above the line it ends on
		&& range[1].char > this.line(range[1].line).length; //and range extends beyond the characters (into presumed \n)

	//delete all lines in between if exist
	if(range[1].line > range[0].line) this._lines.splice(range[0].line+1,(range[1].line-range[0].line));

	//if the second range goes over and no first half AND not the same line, remove current line
	if(join && !first.length && range[0].line !== range[1].line) {
		this._lines.splice(range[0].line,1)
	} else if(deleteLastLine) {
		this._lines.splice(range[1].line,1)
	} else { //otherwise join first and second half and set as line.
		this._lines[range[0].line] = first + last;
	}

	this.set({text: this._lines.join('\n')});
};

/* Finds the next instance of that exp, returning a range */

Doc.prototype.find = function(exp,opts) {
	opts = opts || {},
		carriage = '',
		backwards = false;

	if(this.selecting) {
		carriage = '\n';
	}

	if('backwards' in opts && opts.backwards) {
		backwards = true;
	}

	//check the rest of this line
	var rest;
	var thisLine = this.line() + carriage;


	var curIndex = checkString(exp,thisLine,this.cursor.char() + (backwards ? -1 : 1 ),backwards);


	if(curIndex > -1) {
		return {line: this.cursor.line(), char: curIndex };
	}

	//now check the rest. Decrement if this is a backwards search.
	var lineIndex = this.cursor.line() + (backwards ? -1 : 1);
	while(lineIndex < this._lines.length && lineIndex >= 0) {
		var foundAt = checkString(exp,this._lines[lineIndex] + carriage);
		if(foundAt > -1) return { line: lineIndex, char: foundAt };
		lineIndex += (backwards ? -1 : 1);
	}

	//return the last character if not found.
	return backwards ? this.firstPosition() : this.lastPosition();
	//return false;
};

Doc.prototype.lastPosition = function() {
	return {
		line: this._lines.length-1,
		char: this._lines[this._lines.length-1].length-1
	};
};

Doc.prototype.firstPosition = function() {
	return {
		line: 0,
		char: 0
	}
};


/** Check a string for a regular expression, indicating where in the string the match begins. -1 for false
*/
function checkString(exp,str,offset,backwards) {

	//Because of the lastIndex use the expression needs to be global
	if(!exp.global) throw "Regular expressions need to be global here";

	//Offset optional
	if(offset == null) offset = 0;

	//Don't search before the offset
	if(!backwards) exp.lastIndex = offset;

	if(backwards) str = str.substring(0,offset);

	var test = exp.exec(str);

	if(!test) return -1;



	result = !!test[1] ? test[1] : test[2];
	if(backwards) {
		return str.lastIndexOf(result);
	} else {
		return exp.lastIndex - result.length;
	}

}

//Expose for testing!
Doc.prototype.checkString = checkString;

var _selection = false;
Doc.prototype.selection = function(range) {
	//Reset if told
	if(range === 'reset') return _selection = false;

	if(range) { //Set
		_selection = range;
	} else if(!_selection) { //Set as cursor position if none
		var pos = this.cursor.position();
		var end = {
			line: pos.line,
			char: pos.char+1
		};
		return [pos,end];
	}
	return _selection; //get
};



function isRange(range) {
	if(!range) return false;
	if(! ('length' in range)) return false;

	if(! range.length === 2) return false;

	//basic structure
	if('char' in range[0] && 'line' in range[0] && 'char' in range[1] && 'line' in range[1]) {
		if(range[0].line > range[1].line) return false;
		if(range[0].line === range[1].line && range[0].char > range[1].char) return false;
	} else {
		return false;
	}

	return true;
};

module.exports = Doc;
