/* 

	One vim

	Multiple docs

	One status

	Some meta rendering per doc

*/


var Doc = require('./Doc');

var Event = require('./Event');

var _ = require('./3rd/_');

var Vim = function(obj) {

	this.docs = [];

	//Create initial document
	var doc = new Doc();
	doc.on('change:text', function() {
		this.trigger('change:text');
		this.trigger('change');
	}.bind(this));
	this.docs.push(doc);
	this.curDoc = doc;

	this.modes = {};

	this.keyBuffer = '';

	this.on('change:mode', function(mode) {

	});

	//Add modes
	this.addMode('insert',require('./modes/insert'));
	this.addMode('command',require('./modes/command'));
	this.addMode('search',require('./modes/search'));
	this.addMode('visual',require('./modes/visual'));

	//Default to command
	this.mode('command');


};

Vim.prototype = new Event();

Vim.prototype.new = function() {
	var doc = new Doc();
	doc.cursor.line(0);
	doc.cursor.char(0);
	this.docs.push(doc);
	this.curDoc = doc;
};

Vim.prototype.addMode = function(name,mode) {

	var modeArr = [];

	for(var i in mode) {
		if(mode.hasOwnProperty(i)) {
			var reg = new RegExp(i.substring(1,i.length-1));
			modeArr.push({
				command: reg,
				fn: mode[i]
			});
		}
	}

	this.modes[name] = modeArr;
};

Vim.prototype.mode = function(name) {
	if(name) {
		if(! (name in this.modes)) throw "Mode " + name + " does not exist";
		this._mode = this.modes[name];
		this.modeName = name;
		this.trigger('change:mode',this._mode);
		this.trigger('change');
	}

	return this._mode;
};

/* buffer */


var _registry = {};
var _numRegistry = [];

/** set/get buffers

*/
Vim.prototype.register = function(k,v) {
	var num = typeof k === 'number';
	if(v) {
		if(num) {
			_numRegistry.splice(k,0,v); //put where
			_numRegistry.splice(10); //only ten.
		} else {
			_registry[k] = v; //just set if not num TODO: check for '1' case
		}
	} else {
		
		var val = num ? _numRegistry[k] : _registry[k];

		//Send an empty string if it's an empty buffer.
		return val ? val : '';
	}
};

//Keep track of call stack depth so we know when a command set ends
var execDepth = 0;

/** Execute a given command by passing it through 
*/
Vim.prototype.exec = function(command) {

	this.keyBuffer += command;

	command = this.keyBuffer;

	//accept an array as the first argument.
	if(typeof command !== 'string' && command.length) {
		for(var i in command) {
			if(command.hasOwnProperty(i)) this.exec(command[i]);
		}
		return;
	}

	execDepth++;

	var startPos = this.curDoc.cursor.position();

	
	this.execDepth = execDepth;

	var mode = this.mode();

	var arg, regResult;

	var handlers = _(this.mode()).filter(function(mode) {
		var res = mode.command.exec(command)
		if(res) {
			regResult = res;
			arg = res[0];
			return true;
		}
	});

	if(handlers.length) {
		this.keyBuffer = '';
		handlers[0].fn(arg,this,regResult);
	}

	if(command === 'esc') {
		this.mode('command');
		this.keyBuffer = '';
	}

	if(this.recording) {
		var record = this.register(this.recordRegister);
		record += command;
		this.register(this.recordRegister,record);
	}

	//TODO: find a good place for this type of thing
	/*

		This stuff is for a set of commands that put the cart in front of the horse:

			ye			translates to 				v e y
			d2/foo	translates to 		v 2/foo d

		The reason the shorthand works is that there's only one motion command initiated by the user.
		So we hold on to flags (yanking, deleting, changing) and wait for a top-level (execDepth:1)
			command to move the cursor. Then re-write the command in the verbose syntax that
			the keybindings already understand.

	*/
	if(execDepth === 1) {
		this.trigger('exec',command)
		if(this.curDoc.cursor.moved) {
			if(this.curDoc.yanking) {
				//if yanking, select from 
				this.exec('v');
				this.exec(startPos.line +'G');
				this.exec(startPos.char + 'l');
				this.exec('y');
				if(this.curDoc.deleting) {
					this.exec('d');
					this.curDoc.deleting = false;
					if(this.curDoc.changing) {
						this.exec('a');
						this.curDoc.changing = false;
					}
				}
				this.exec('esc');
				this.curDoc.yanking = false;
			}
			this.curDoc.cursor.moved = false;
		}

		//If bubbling up and we've stored some info (i.e. visual mode done)
		if(this.curDoc.stored) {
			this.exec('esc');	
			this.curDoc.stored = false;
		}

		
	}

	execDepth--;

	

	//this.trigger('exec',command);

	

};

/* Shorthand fns */

Vim.prototype.insert = function() {
	return this.curDoc.insert.apply(this.curDoc,arguments);
};

Vim.prototype.remove = function() {
	return this.curDoc.remove.apply(this.curDoc,arguments);
};

Vim.prototype.text = function() {
	return this.curDoc.text.apply(this.curDoc,arguments);
}

Vim.prototype.cursor = function() {
	return this.curDoc.cursor;
}

//Expose Doc for testing
Vim.prototype.Doc = Doc;

module.exports = Vim;

