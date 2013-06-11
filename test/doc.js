var vim = require('../index');

var Cursor = require('../lib/Cursor');

var expect = function(assertion) {

	return {
		equal: function(obj) {
			if(assertion == obj) return true;
			throw "expected " + assertion + " to equal " + obj;
		}
	}
};

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
			expect(doc.text()).equal('ab hi');
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
			range[0] = { line: 0, char: 0 };
			range[1] = { line: 0, char: doc._lines[1].length+1 };
			doc.remove(range);
			expect(doc._lines.length).equal(1);
			expect(doc._text).equal('line two');
		});

		it('can remove, delete a line, and remove', function() {
			doc = new Doc({text: 'one\ntwo\nthree'});
			range[0] = { line: 0, char: 1 };
			range[1] = { line: 2, char: 2 };
			doc.remove(range);
			expect(doc._text).equal('oree');
		});

	});

	describe('doc.find', function() {
		it('finds things', function() {
			doc = new Doc({text:' hi'});
			var res = doc.find(/(hi)/g);
			expect(res.line).equal(0);
			expect(res.char).equal(1);
		})


	});

	describe('doc.checkString', function() {

		var doc;
		beforeEach(function() {
			doc = new vim.Doc();
		})

		it('exists', function() {
			expect('checkString' in doc).equal(true);
		});

		it('returns -1 when no match', function() {
			expect(doc.checkString(/(h)/g,'abcd')).equal(-1);
		});

		it('returns 0 when found at zero', function() {
			expect(doc.checkString(/(h)/g,'h')).equal(0);
		});

		it('returns 1 when found at 1', function() {
			expect(doc.checkString(/(h)/g,' h')).equal(1);
		});

		it('returns null when present in line but not after offset', function() {
			expect(doc.checkString(/(h)/g,'hello',1)).equal(-1);
		});

		it('returns correct line when present in line before and after the offset', function() {
			expect(doc.checkString(/(h)/g,'hello there',1)).equal(7);
		});

		it('returns correct line when present in line before and after the offset', function() {
			expect(doc.checkString(/(h)/g,'hello there',1)).equal(7);
		});

		it('correctly does not treat the beginning of the offset string as the beginning of the line', function() {
			expect(doc.checkString(/^ello/g,'hello there',1)).equal(-1);
		});

		describe('doc.checkString backwards', function() {

			it('can work backwards', function() {
				expect(doc.checkString(/(a)/g,'a b',1,true)).equal(0);
			});

			it('ignores the a match that is after the offset', function() {
				expect(doc.checkString(/(a)/g,'b a',1,true)).equal(-1)
			});


		})


		



	});

	describe('doc.getRange', function() {
		var doc;
		beforeEach(function() {
			doc = new Doc({text: 'qwer\nasdf\nzxcv'});
		});

		it('returns a string value for the range if it is one line', function() {
			var range = [{line: 0, char: 0}, { line:0, char: 4}];
			var text = doc.getRange(range);
			expect(text).equal('qwer');
		})

		it('includes a carriage return if it is multiline', function() {
			var range = [{line: 0, char: 0}, { line:1, char: 2}];
			var text = doc.getRange(range);
			expect(text).equal('qwer\nas');
		})

	})

});