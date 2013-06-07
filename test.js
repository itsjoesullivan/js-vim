var vim = require('./index');

var Cursor = require('./lib/Cursor');

var expect = function(assertion) {

	return {
		equal: function(obj) {
			if(assertion == obj) return true;
			throw "expected " + assertion + " to equal " + obj;
		}
	}
};

describe('vim', function() {

	it('has Doc property', function() {
		expect('Doc' in vim).equal(true);
	});

});

describe('Doc', function() {
	var doc;

	beforeEach(function() {
			doc = new Doc({
				text: 'hi'
			});
	});

	describe('doc', function() {
		it('has cursor', function() {
			expect('cursor' in doc).equal(true);
		});
	});

	describe('doc.insert', function() {

		it('exists', function() {
			expect('insert' in doc).equal(true);
		});

		it('can insert a character', function() {
			doc.insert('a');
			expect(doc._text).equal('ahi');
		});

		it('given multiple characters they are each inserted.', function() {
			doc.insert('ab ');
			expect(doc._text).equal('ab hi');
		});
	});

	describe('doc.remove', function() {

		var range = [];

		beforeEach(function() {
			range[0] = { line: 0, char: 0};
			range[1] = { line: 0, char: 1};
		});

		it('throws on bad range', function() {
			var threw = false;
			try {
				doc.remove();
			} catch(e) {
				threw = true;
			}
			expect(threw).equal(true);

		});

		it('fires change event on text change', function() {
			var fired = false;
			doc.on('change:text', function() {
				fired = true;
			});
			doc.set({text: 'hello'});
			expect(fired).equal(true);
		})

		it('can remove a character', function() {
			doc.remove(range);
			expect(doc._text).equal('i');
		});


		it('can remove more than one character', function() {
			doc = new Doc({text:'oh hello there'});
			range[0].char = 3;
			range[1].char = 9;
			doc.remove(range)
			expect(doc._text).equal('oh there');
		});

		it('can remove across lines', function() {
			doc = new Doc({text: 'line one\nand another'});
			range[0].char = 5;
			range[1] = { line: 1, char: 4 };
			doc.remove(range);
			expect(doc._text).equal('line another');
		});

		it('can delete a line', function() {
			doc = new Doc({text: 'line one\nline two'});
			range[0] = { line: 1, char: 0 };
			range[1] = { line: 1, char: doc._lines[1].length };
			doc.remove(range);
			expect(doc._lines.length).equal(1);
			expect(doc._text).equal('line one');
		});

		it('can remove, delete a line, and remove', function() {
			doc = new Doc({text: 'one\ntwo\nthree'});
			range[0] = { line: 0, char: 1 };
			range[1] = { line: 2, char: 2 };
			doc.remove(range);
			expect(doc._text).equal('oree');
		});

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