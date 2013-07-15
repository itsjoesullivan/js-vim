var Vim = require('../index');
var vim = new Vim();

var Cursor = require('../lib/Cursor');

var expect = require('chai').expect;


describe('vim', function() {
	it('has Doc property', function() {
		expect('Doc' in vim).equal(true);
	});
});


describe('Cursor', function() {
	var cursor;

	beforeEach(function() {
		cursor = new Cursor();
	});

	it('exists', function() {
		expect(typeof Cursor).equal('function');
	});

	it('fires change event on line change', function() {
		var fired = false;
		cursor.on('change:line', function() {
			fired = true;
		});
		cursor.line(10);
		expect(fired).equal(true);
	});

	it('fires change event on char change', function() {
		var fired = false;
		cursor.on('change:char', function() {
			fired = true;
		});
		cursor.char(10);
		expect(fired).equal(true);
	});

	it('has _line and _char', function() {
		expect('_line' in cursor).equal(true);
		expect('_char' in cursor).equal(true);
	});

	describe('Cursor.line', function() {
		it('sets and gets line', function() {
			cursor.line(10);
			expect(cursor.line()).equal(10);
		});
	});

	describe('Cursor.char', function() {
		it('sets and gets char', function() {
			cursor.char(10);
			expect(cursor.char()).equal(10);
		});
	});

});



describe('vim.exec', function() {
	it('exists', function() {
		expect('exec' in vim).equal(true);
	})

	it('executes basic', function() {
		vim.exec('i');
		expect(vim.modeName).equal('insert');
	});
});

describe('modes', function() {

	beforeEach(function() {
		vim.mode('command');
		var doc = new Doc({text: "oh hello\nthere"});
		vim.docs.push(doc);
		vim.curDoc = doc;

	});

	describe('command', function() {

		describe('i', function() {
			it('moves to insert mode', function() {
				vim.exec('i');
				expect(vim.modeName).equal('insert');
			});
		});

		describe('s', function() {
			it('moves to insert mode', function() {
				vim.exec('s');
				expect(vim.modeName).equal('insert');
			})
		})

		describe('S', function() {
			it('moves to insert mode', function() {
				vim.exec('S');
				expect(vim.modeName).equal('insert');
			})
		})

		describe('h', function() {
			it('moves the cursor left', function() {
				vim.cursor().char(4);
				vim.exec('h');
				expect(vim.cursor().char()).equal(3);
			});

			it('stays at zero if already at zero', function() {
				vim.cursor().char(0);
				vim.exec('h');
				expect(vim.cursor().char()).equal(0);
			});
		});

		describe('l', function() {
			it('moves the cursor right', function() {
				vim.cursor().char(2);
				vim.exec('l');
				expect(vim.cursor().char()).equal(3);
			});

			it('stays at end of line if already there', function() {
				vim.cursor().char(7);
				vim.exec('l');
				expect(vim.cursor().char()).equal(7);
			});
		});

		describe('j', function() {
			it('moves the cursor down', function() {
				vim.cursor().line(0);
				vim.exec('j');
				expect(vim.cursor().line()).equal(1);
			});

			it('stays at last line if already there', function() {
				vim.cursor().line(1);
				vim.exec('j');
				expect(vim.cursor().line()).equal(1);
			});
		});

		describe('k', function() {
			it('moves the cursor up', function() {
				vim.cursor().line(1);
				vim.exec('k');
				expect(vim.cursor().line()).equal(0);
			});

			it('stays at zero if already there', function() {
				vim.cursor().line(0);
				vim.exec('k');
				expect(vim.cursor().line()).equal(0);
			});
		});

		describe('{n}(h|j|k|l)', function() {

			beforeEach(function() {
				vim.mode('command');
				var doc = new Doc({text: "oh hello\nthere\nthird\nfourth"});
				vim.docs.push(doc);
				vim.curDoc = doc;
				vim.cursor().line(0);
				vim.cursor().char(0);
			});

			it('does j multiple times', function() {
				expect(vim.cursor().line()).equal(0);
				vim.exec('2j');
				expect(vim.cursor().line()).equal(2);
			});

			it('does l multiple times', function() {
				vim.exec('2l');
				expect(vim.cursor().char()).equal(2);
			});
		});

		describe('$', function() {
			it('moves to the end of the line', function() {
				vim.new();
				vim.curDoc.text('hello');
				vim.exec('$');
				expect(vim.cursor().char()).equal(4);
			});
			
		});

		describe('w', function() {
			it('moves to the next word', function() {
				vim = new Vim();
				vim.curDoc.text('hello there thar');
				vim.exec('w');
				expect(vim.cursor().char()).equal(6);
			});

			it('moves thence to the third', function() {
				vim.new();
				vim.curDoc.text('hello there thar\nhey what');
				vim.exec('w');
				vim.exec('w');
				expect(vim.cursor().char()).equal(12);
			});

			it('moves to line two when necessary', function() {
				vim.new();
				vim.curDoc.text('hello there thar\nhey what');
				vim.exec('w');
				vim.exec('w');
				vim.exec('w');
				expect(vim.cursor().line()).equal(1);
				expect(vim.cursor().char()).equal(0);
			});
		});

		/*describe('W', function() {
			it('moves to the next word', function() {
				vim.new();
				vim.curDoc.text('hello there');
				vim.exec('W');
				expect(vim.cursor().char()).equal(6);
			});
		});*/

	

		describe('o', function() {
			it('creates a new line under current line and moves to insert mode', function() {
				vim.new();
				vim.curDoc.text('aloha');
				vim.exec('o');
				expect(vim.modeName).equal('insert');
			})
		});

		/*describe('b', function() {
			it('moves to the previous word', function() {
				vim.new();
				vim.curDoc.text('hello there');
				vim.cursor().char(8);
				vim.exec('b');
				expect(vim.cursor().char()).equal(0);
			});
		});*/

		/*describe('B', function() {
			it('moves to the previous word', function() {
				vim.new();
				vim.curDoc.text('hello there');
				vim.cursor().char(8);
				vim.exec('B');
				expect(vim.cursor().char()).equal(0);
			});
		});*/

		describe('x', function() {
			it('deletes the character', function() {
				vim.new();
				vim.curDoc.text('hello there');
				vim.cursor().char(4);
				vim.exec('x');
				expect(vim.text()).equal('hell there');
			});

			it('doesn\'t have a problem if the line is empty', function() {
				throw '';
			})
		});

		describe('^', function() {
			it('moves to the first non-blank character in the line', function() {
				vim.new();
				vim.curDoc.text(' hey');
				vim.exec('^');
				expect(vim.cursor().char()).equal(1);
			});
		})

		/*describe('g_', function() {
			it('moves to the last non-blank character in the line', function() {
				vim.new();
				vim.curDoc.text(' hey  ');
				vim.exec('g_');
				expect(vim.cursor().char()).equal(3);
			});
		})*/

	});

	describe('insert', function() {
		it('inserts text', function() {

			vim.exec('i');

			vim.exec('asdf');
			expect(vim.text()).equal('asdfoh hello\nthere');
		});
	});
});

describe('f{m}', function() {
	beforeEach(function() {
		vim.exec('esc');
		var doc = new Doc({text: 'hello\nthere\nabcdefo'});
		vim.curDoc = doc;
	});

	it('finds the next m', function() {
		vim.exec('fe');
		expect(vim.cursor().char()).equal(1);
	});

});

describe('{n}f{m}', function() {
	beforeEach(function() {
		vim.exec('esc');
		var doc = new Doc({text: 'hello\nthere\nabcdefo'});
		vim.curDoc = doc;
	});

	it('searches for the nth occurence of m', function() {
		vim.exec('3fe');
		expect(vim.cursor().char()).equal(4);
	});

});

describe('search', function() {
	beforeEach(function() {
		vim.exec('esc');
		var doc = new Doc({text: 'hello\nthere\nabcdefo'});
		vim.curDoc = doc;
		vim.exec('/');
	});


	it('looks for the phrase', function() {
		vim.exec('o\n');
		expect(vim.cursor().char()).equal(4);
	});

	it('moves to the next instance', function() {
		vim.exec('o\n');
		expect(vim.cursor().char()).equal(4);
		vim.exec('n');
		expect(vim.cursor().char()).equal(6);
	});
});

describe('mode:visual', function() {

	var doc;
	beforeEach(function(){ 
		vim.exec('esc');
		doc = new Doc({text: 'here\nthere\neverywhere'});
		vim.curDoc = doc;
	});

	it('is entered from command by pressing v', function() {
		vim.exec('v');
		expect(vim.modeName).equal('visual');
	});

	it('sets selection', function() {
		var sel = vim.curDoc.selection();
		expect(sel[0].line).equal(0);
		expect(sel[1].line).equal(0);
		vim.exec('v');
		vim.exec('j');
		var sel = vim.curDoc.selection();
		expect(sel[0].line).equal(0);
		expect(sel[1].line).equal(1);
	});


	it('accepts multiple motions without resetting', function() {

		vim.exec('v');
		vim.exec('j');
		var sel = vim.curDoc.selection();
		expect(sel[0].line).equal(0);
		expect(sel[1].line).equal(1);

		vim.exec('l');
		var sel = vim.curDoc.selection();
		expect(sel[1].char).equal(2);
		expect(sel[1].line).equal(1);
		
	});

	it('clears selection to cursor on esc', function() {

		vim.exec('v');
		vim.exec('j');
		var sel = vim.curDoc.selection();

		vim.exec('l');
		var sel = vim.curDoc.selection();

		vim.exec('esc');

		var sel = vim.curDoc.selection();
		
	});


	it('performs yank when y hit in visual mode', function() {
		vim.exec('v');
		vim.exec('$');
		vim.exec('y');
		expect(vim.register(0).indexOf('here')).equal(0);
	});


});

describe('yank', function() {

});


describe('motion, general', function() {
	var doc;
	beforeEach(function(){ 
		vim.exec('esc');
		var doc = new Doc();
		vim.curDoc = doc;
	});

	it('accepts return on empty file', function() {
		vim.exec('i');
		var err = false
		try {
			vim.exec('\n');
		} catch(e) {
			err = true;
		}
		
		expect(vim.curDoc._lines[0]).equal('');
		expect(vim.curDoc._lines[1]).equal('');
	});

});

