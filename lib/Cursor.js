var Event = require('./Event');

var Cursor = function(obj) {

	this._line = 0;
	this._char = 0;

	if(typeof obj === 'object') {
		if('line' in obj) this._line = obj.line;
		if('char' in obj) this._char = obj.char;
	}

	//Whether the cursor has changed since last set
	this.moved = false;

	this.on('change', function() {
		this.moved = true;
	});
};


Cursor.prototype = new Event();

Cursor.prototype.line = function(num) {
	if(typeof num === 'number' && this._line !== num) {
		this._line = num;
		this.trigger('change:line',num);
		this.trigger('change');
	} 
	
	return this._line;
};

Cursor.prototype.char = function(num) {
	if(typeof num === 'number' && this._char !== num) {
		this._char = num;
		this.trigger('change:char',num);
		this.trigger('change');
	} 

	//Just say we are on the last character if it's not available.
	if('doc' in this) {
		if(this.doc.line().length < this._char) {
			return this.doc.line().length;
		}
	}
	return this._char;
};

Cursor.prototype.position = function() {
	return { line: this.line(), char: this.char() };
}

module.exports = Cursor;
