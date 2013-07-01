var Undo = module.exports = function() {
	this._history = [];
	this.position = 0;
};

/** Add a state
 *
 * N.B.: this.position can use some conceptual explanation.
 * At its root, position is the state that you are presently in.
 * Undo.add is not used when you have completed a change, but when you are about to initiate a change. Therefore it's appropriate that insert the state at your current position, then increment position into a state that is not defined in _history.
 */
Undo.prototype.add = function(ev) {
	this._history.splice(this.position);
	this._history.push(ev);
	this.position++;
};

/** Retrieve a state and move the current "position" to there
 */
Undo.prototype.get = function(index) {
	var state = this._history.slice(index,index+1)[0];	
	this.position = index;
	return state;
};

/** Retrieve the previous state
 */
Undo.prototype.last = function() {
	return this.get(this.position-1);
};

