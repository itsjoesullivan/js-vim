var Event = require('./Event');

var Cursor = function(obj) {

	this._line = 0;
	this._char = 0;

	if(typeof obj === 'object') {
		if('line' in obj) this._line = obj.line;
		if('char' in obj) this._char = obj.char;
	}
};

Cursor.prototype = new Event();

Cursor.prototype.line = function(num) {
	if(typeof num === 'number') this._line = num;
	this.trigger('change:line',num);
	return this._line;
};

Cursor.prototype.char = function(num) {
	if(typeof num === 'number') this._char = num;
	this.trigger('change:char',num);
	return this._char;
};

module.exports = Cursor;