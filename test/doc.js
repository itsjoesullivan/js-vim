var Vim = require('../index');
var vim = new Vim();

var Cursor = require('../lib/Cursor');

describe('Doc', function() {
	var doc;

	beforeEach(function() {

			doc = new Doc({
				text: 'hi'
			});
	});

	describe('doc', function() {
		it('has cursor', function() {
			('cursor' in doc).should.equal(true);
		});
	});

	describe('doc.text', function() {
		it('returns the text of the doc', function() {
			var doc = new vim.Doc();
			doc.text("Hello");
			var text = doc.text();
			text.should.equal("Hello");
		});

		it('Sets the value if handed a string', function() {
			var doc = new vim.Doc();
			doc.text("Hello");
			var text = doc.text();
			text.should.equal("Hello");
		});
		it('Handed an array of two numbers. returns the contents bounded by those lines', function() {
			var doc = new vim.Doc();
			doc.text("Line 1\nLine 2\nLine 3\nLine 4");
			var text = doc.text([1,3]);
			text.should.equal("Line 2\nLine 3")
		});
	});


	describe('doc.insert', function() {

		it('exists', function() {
			('insert' in doc).should.equal(true);
			
		});

		it('can insert a character', function() {
			doc.insert('a');
			doc._text.should.equal('ahi');
		});

		it('given multiple characters they are each inserted.', function() {
			doc.insert('ab ');
			doc.text().should.equal('ab hi');
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
			threw.should.equal(true);

		});

		it('fires change event on text change', function() {
			var fired = false;
			doc.on('change:text', function() {
				fired = true;
			});
			doc.set({text: 'hello'});
			fired.should.equal(true);
		})

		it('can remove a character', function() {
			doc.remove(range);
			doc._text.should.equal('i');
		});


		it('can remove more than one character', function() {
			doc = new Doc({text:'oh hello there'});
			range[0].char = 3;
			range[1].char = 9;
			doc.remove(range)
			doc._text.should.equal('oh there');
		});

		it('can remove across lines', function() {
			doc = new Doc({text: 'line one\nand another'});
			range[0].char = 5;
			range[1] = { line: 1, char: 4 };
			doc.remove(range);
			doc._text.should.equal('line another');
		});

		it('can delete a line', function() {
			doc = new Doc({text: 'line one\nline two'});
			range[0] = { line: 0, char: 0 };
			range[1] = { line: 0, char: doc._lines[1].length+1 };
			doc.remove(range);
			doc._lines.length.should.equal(1);
			doc._text.should.equal('line two');
		});

		it('can remove, delete a line, and remove', function() {
			doc = new Doc({text: 'one\ntwo\nthree'});
			range[0] = { line: 0, char: 1 };
			range[1] = { line: 2, char: 2 };
			doc.remove(range);
			doc._text.should.equal('oree');
		});

	});

	describe('doc.find', function() {
        var doc;
        beforeEach(function() {
            doc = new Doc();
        });
		it('finds things', function() {
			doc = new Doc({text:' hi'});
			var res = doc.find(/(hi)/g);
			res.line.should.equal(0);
			res.char.should.equal(1);
		});

        it('works backwards', function() {
            doc.text('asdf');    
            doc.cursor.col(3);
            var found = doc.find(/(a)/g, {backwards: true});
            found.char.should.equal(0);
        });

        it('handles ^ backwards', function() {
            doc.text('a a a a');
            doc.cursor.col(4);
            var found = doc.find(/(^a)/g, { backwards:true});
            found.char.should.equal(0);
        });


	});

	describe('doc.checkString', function() {

		var doc;
		beforeEach(function() {
			doc = new vim.Doc();
		})

		it('exists', function() {
			('checkString' in doc).should.equal(true);
		});

		it('returns -1 when no match', function() {
			(doc.checkString(/(h)/g,'abcd')).should.equal(-1);
		});

		it('returns 0 when found at zero', function() {
			(doc.checkString(/(h)/g,'h')).should.equal(0);
		});

		it('returns 1 when found at 1', function() {
			(doc.checkString(/(h)/g,' h')).should.equal(1);
		});

		it('returns null when present in line but not after offset', function() {
			(doc.checkString(/(h)/g,'hello',1)).should.equal(-1);
		});

		it('returns correct line when present in line before and after the offset', function() {
			(doc.checkString(/(h)/g,'hello there',1)).should.equal(7);
		});

		it('returns correct line when present in line before and after the offset', function() {
			(doc.checkString(/(h)/g,'hello there',1)).should.equal(7);
		});

		it('correctly does not treat the beginning of the offset string as the beginning of the line', function() {
			(doc.checkString(/^ello/g,'hello there',1)).should.equal(-1);
		});

		describe('doc.checkString backwards', function() {

			it('can work backwards', function() {
				(doc.checkString(/(a)/g,'a b',1,true)).should.equal(0);
			});

			it('ignores the a match that is after the offset', function() {
				(doc.checkString(/(a)/g,'b a',1,true)).should.equal(-1)
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
			(text).should.equal('qwer');
		})

		it('includes a carriage return if it is multiline', function() {
			var range = [{line: 0, char: 0}, { line:1, char: 2}];
			var text = doc.getRange(range);
			(text).should.equal('qwer\nas');
		})

	});

   describe('doc.addMark', function() {
       it('adds a mark', function() {
           doc = new Doc({text: 'asdf'});
           doc.addMark({
               line: 0, col: 1, mark: 'a'
           });
           doc._lines[0].marks[0].col.should.equal(1);
       });
   });

});
