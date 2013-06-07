var Cursor = require('./Cursor');



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

//Getter / setter
Doc.prototype.text = function(text) {
	if(text) this._text = text;
	return this._text;
};

//Retrieve the line at num; default to cursor if no num
Doc.prototype.line = function(num) {
	if(typeof num !== 'number') num = this.cursor.line();
	if(this._lines.length <= num) throw "Line out of range of document";
	return this._lines[num];
};

//Input text
Doc.prototype.insert = function(text) {

	if(typeof text !== 'string') throw "Only strings can be inserted into a doc";

	var curLine = this.line();
	curLine = curLine.substring(0,this.cursor.char()) + text + curLine.substring(this.cursor.char(),curLine.length);
	this._lines[this.cursor.line()] = curLine;
	this.cursor.char(this.cursor.char()+1);
	this._text = this._lines.join('\n');
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

	//check if joining after
	var join = range[1].char >= this._lines[range[1].line].length ? true : false;

	//grab end of other line if exists
	var last = this._lines[range[1].line].substring(range[1].char);

	//delete all lines in between if exist
	if(range[1].line > range[0].line) this._lines.splice(range[0].line+1,(range[1].line-range[0].line));

	//if the second range goes over and no first half, remove current line
	if(join && !first.length) {
		this._lines.splice(range[0].line,1)
	} else { //otherwise join first and second half and set as line.
		this._lines[range[0].line] = first + last;
	}

	this._text = this._lines.join('\n');

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