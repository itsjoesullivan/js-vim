/* undo manages your undos! */

/** constructor */
var Undo = module.exports = function() {
	this.history = [];
};


/* api

	fundamentally just want to be able to back the fuck up
	to do that, store some form of snapshot, being ready
	always to send a patch that will bring current form
	to desired history step.

	undo() --> yield a patch we can apply
	undo.getPatch() --> yield a patch we can apply
	undo.getText() --> yield 
	undo.getObj() --> yeild object w text + cursor

*/

/** Add a new step... i.e. a new snapshot

	obj like: {
		text: string,
		cursor: [num, num]
	}

*/
Undo.prototype.addStep = function(obj) {

	//if first, store text + cursor
	if(!this.history.length) return this.history.push(obj);

	//	

};





var dmpmod = require('diff_match_patch');

var dmp = new dmpmod.diff_match_patch();


