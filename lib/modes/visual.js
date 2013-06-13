/*

	Visual mode is just text selection on top of command mode. Each keypress, simply maintain your range.

*/

var rangeStart,
		originalCursorPosition = false;
module.exports = {

	'/^((?!esc|x|d|y|i|a|J).*[^1-9]+.*)/': function(keys,vim, res) {
		vim.curDoc.selecting = true;

		if(!originalCursorPosition) {
			originalCursorPosition = vim.curDoc.cursor.position();
		}

		vim.lastMode = 'visual';

		if(!rangeStart) {
			rangeStart = {
				line: vim.cursor().line(),
				char: vim.cursor().char()
			};
		}

		//execute the command in command mode
		vim.mode('command'); //dont use 'esc' as that is defined below to cancel the visual session
		vim.exec(keys);

		//Establish new cursor as range end / start
		var end = {
			line: vim.cursor().line(),
			char: vim.cursor().char()
		};

		var range = [rangeStart,end];


		//Reverse if not correct order. But rangeStart remains where it was.
		if(end.line < rangeStart.line || (end.line === rangeStart.line && end.char < rangeStart.char)) {
			range = [range[1],range[0]];
		}

		range[1].char++;

		vim.curDoc.selection(range);

		//Assuming we can, move back to visual mode after executing.
		//If we can't, must trust the mode to return us.
		if(vim.modeName === 'command') vim.exec('v');

	},

	'/^(esc)/': function(keys,vim) {
		console.log('eeescaping');
		rangeStart = false;
		vim.curDoc.selection('reset');
		vim.curDoc.selecting = false;
		vim.curDoc.cursor.line(originalCursorPosition.line);
		vim.curDoc.cursor.char(originalCursorPosition.char);
		originalCursorPosition = false;
	},

	'/^(a|i)(.)/': function(keys, vim, res) {
		var inclusive = res[1] === 'a' ? true : false;
		var character = res[2];
		var flipMap = {
			'(':')',
			'{':'}',
			'[':']'
		};
		var	flipCharacter = (character in flipMap) ? flipMap[character] : character;
		vim.exec('esc');
		vim.exec('?')
		vim.exec(character + '\n');
		if(!inclusive) vim.exec('l');
		vim.exec('v');
		vim.exec('/')
		vim.exec(flipCharacter + '\n');
		if(!inclusive) vim.exec('h');

	},

	'/^(x)/': function(keys,vim) {

		//Grab it
		vim.exec('y');

		//Switch to command to perform a normal delete
		vim.mode('command');

		//Perform normal delete
		vim.exec('x');

		//Must be in v mode
		vim.exec('v');

		//To clear range by exiting it
		vim.exec('esc');

	},

	'/^(d)/': function(keys,vim) {
		vim.exec('x');
	},

	'/^(y)/': function(keys,vim) {
		console.log('yaaaank');
		var range = vim.curDoc.selection();
		var val = vim.curDoc.getRange(range);
		vim.register(0,val);
		vim.curDoc.stored = true;
	},

	'/^(J)$/': function(keys, vim) {
		var range = vim.curDoc.selection();
		var ct = range[1].line - range[0].line || 1; //do first join ANYWAYS

		//Move to the beginning
		vim.curDoc.cursor.line(range[0].line);
		vim.exec('esc');
		while(ct--) {
			vim.exec('J');
		}
	}
};

