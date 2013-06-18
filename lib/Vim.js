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

//Special parser for vim commands TODO fix ref
var CommandParser = require('js-vim-command');
this.parser = new CommandParser();

//Diff util for undo, etc.
//API: https://code.google.com/p/google-diff-match-patch/wiki/API
var dmpmod = require('diff_match_patch');
this.dmp = new dmpmod.diff_match_patch();

	this.docs = [];
	this.currentRegister = 0;
	this._numRegistry = [];
	this._registry = {};

	//Create initial document
	var doc = new Doc();
	doc.on('change:cursor', function() {
		this.trigger('change', {type: 'cursor'});
	}.bind(this));
	doc.on('change:text', function() {
		this.trigger('change:text');
		this.trigger('change', {type: 'text'});
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
		this.trigger('change', {type: 'mode'});
	}

	return this._mode;
};

/* buffer */



/** set/get buffers

*/
Vim.prototype.register = function(k,v) {
	var num = typeof k === 'number';
	if(v) {
		//Clone if array
		if(_(v).isArray()) v = v.slice(0);
	
		if(num) {
			this._numRegistry.splice(k,0,v); //put where
			this._numRegistry.splice(10); //only ten.
		} else {
			this._registry[k] = v; //just set if not num TODO: check for '1' case
			this.register(0,v); //AND record into current register
		}
	} else {
		var val;
		if(num) {
			val = this._numRegistry[k];	
		} else {
			val = this._registry[k];
		}
		if(_(val).isArray()) val = val.slice(0);
		//Send an empty string if it's an empty buffer.
		return val ? val : '';
	}
};
/** Get a register, following logic that usage sets the default to 0

*/
Vim.prototype.useRegister = function() {
	var index = this.currentRegister || 0;
	this.currentRegister = 0; //Using sets to the default.
//	var val = this.register(index);
	var val = 'asdf';
	return val;
};

//Keep track of call stack depth so we know when a command set ends
var execDepth = 0;
var _text = '';

/** Execute a given command by passing it through 
*/
Vim.prototype.exec = function(newCommand) {

	//Grab what's left in the buffer
	this.keyBuffer += newCommand;
	command = this.keyBuffer;
	this.curChar = this.curDoc.getRange(this.curDoc.selection()).substring(0,1);

	//accept an array as the first argument.
	if(typeof command !== 'string') {
		for(var i in command) {
			if(command.hasOwnProperty(i)) this.exec(command[i]);
		}
		return;
	}

	//Increment the depth so we can identify top-level commands
	execDepth++;



	//If this is top-level command, store the value of text for diffing to store the undo
	//TODO: kill this
	if(execDepth === 1) {
		_text = this.text();	
	}

	//Keep a hold of what the position is
	var startPos = this.curDoc.cursor.position();
	
	//Store it here... why not
	this.execDepth = execDepth;

	//Hold mode
	var mode = this.mode();

	var arg, regResult;

	//See if it is a complete, parsed command
	var parsedCommand = this.parser.parse(command);

	//Don't catch single commands because they aren't very useful.
	if(parsedCommand && parsedCommand.description.lastIndexOf('{') === 0) parsedCommand = false; //Dont handle if just one
	// 'yy' should fall through
	if(parsedCommand.description === '{operator}{operator}') parsedCommand = false;
	// '{n}y' should fall through
	if(parsedCommand.description === '{count}{operator}') parsedCommand = false;
	// '{n}yy', too
	if(parsedCommand.description === '{count}{operator}{operator}') parsedCommand = false;

	var handlers = _(this.mode()).filter(function(mode) {
		var res;
		if(parsedCommand) {
			res = mode.command.exec(parsedCommand.description) 
			if(res) return true;
		} else {
			res = mode.command.exec(command);
		}
		if(res) {
			regResult = res;
			arg = res[0];
			return true;
		}
	});

	if(handlers.length) {

		if(this.recording && execDepth === 1 && command.indexOf('q') !== 0) {
			this.recordingBuffer.push(command);
		}

		this.keyBuffer = '';
		if(parsedCommand) {
			handlers[0].fn.apply(this,parsedCommand.value);
		} else {
			handlers[0].fn.bind(this)(arg,this,regResult);
		}
	}

	if(command === 'esc') {
		this.mode('command');
		this.keyBuffer = '';
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
		this.trigger('change:keyBuffer',command);
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
		var newText = this.text();
		if(_text !== newText) {
			this.curDoc.undo.add(this.dmp.patch_make(newText,_text))
		};

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

