var Cursor = require('./Cursor');

var Event = require('./Event');

Doc = function(obj) {

	this.cursor = new Cursor();

	this._text = '';
	this._lines = [];

	if(typeof obj === 'object') {
		if('text' in obj) {
			this._text = obj.text;
		}
	}

	this._selection = [];

	if(this._text.length) this._lines = this._text.split('\n');
};

Doc.prototype = new Event();

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
	}
	return this._text;
};

//Retrieve the line at num; default to cursor if no num
Doc.prototype.line = function(num) {
	console.log(num);
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

	var curLine = this.line();
	curLine = curLine.substring(0,this.cursor.char()) + text + curLine.substring(this.cursor.char(),curLine.length);
	this._lines[this.cursor.line()] = curLine;

	//Increment
	this.cursor.char(this.cursor.char()+text.length);

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
		&& range[1].char >= this.line(range[1].line).length; //and range extends beyond the characters (into presumed \n)

	//delete all lines in between if exist
	if(range[1].line > range[0].line) this._lines.splice(range[0].line+1,(range[1].line-range[0].line));

	//if the second range goes over and no first half AND not the same line, remove current line
	if(join && !first.length /*&& range[0].line !== range[1].line*/) {
		this._lines.splice(range[0].line,1)
	} else if(deleteLastLine) {
		this._lines.splice(range[1].line,1)
	} else { //otherwise join first and second half and set as line.
		this._lines[range[0].line] = first + last;
	}

	this.set({text: this._lines.join('\n')});
};

/* Finds the next instance of that exp, returning a range */

//FIXME somehow finding things inside the cursor.
Doc.prototype.find = function(exp,backwards) {

	//check the rest of this line
	var rest;
	if(backwards) {
		var rest = this.line().substring(0,this.cursor.char()-1);
	} else {
		var rest = this.line().substring(this.cursor.char());
	}
	
	var curIndex = checkString(exp,rest,backwards);

	if(curIndex > -1) {
		return {line: this.cursor.line(), char: ( backwards ? 0 : this.cursor.char() ) + curIndex };
	}

	//now check the rest. Decrement if this is a backwards search.
	var lineIndex = this.cursor.line() + (backwards ? -1 : 1);
	while(lineIndex < this._lines.length && lineIndex >= 0) {

		var foundAt = checkString(exp,this._lines[lineIndex]);
		if(foundAt > -1) return { line: lineIndex, char: foundAt };

		lineIndex += (backwards ? -1 : 1);
	}

	return false;

};

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

/** Check a string for a regular expression, indicating where in the string the match begins. -1 for false
*/
function checkString(exp,str,backwards) {
	var test = exp.exec(str);
	if(test) {
		result = test[1];
		if(backwards) {
			return str.lastIndexOf(result);
		} else {
			return str.indexOf(result);
		}
	}
	return -1;
}

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