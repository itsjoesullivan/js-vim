describe('parser', function() {

	var Vim = require('../index');
	var vim = new Vim();

	var expect = function(assertion) {

	return {
		equal: function(obj) {
			if(assertion == obj) return true;
			throw "expected " + assertion + " to equal " + obj;
		}
	}

};

	var doc;

	beforeEach(function() {
		doc = new Doc({text:'asdf aloha what\nzxcv\nqwer'});
		vim.curDoc = doc;
	});

	describe('fa', function() {
		it('moves cursor ', function() {
			var currentChar = vim.curDoc.cursor.char();
			vim.exec('2l');
			var newChar = vim.curDoc.cursor.char();
			expect(newChar).equal(2)
		});
		it('performs search {motion} {count} times', function() {
			var currentChar = vim.curDoc.cursor.char();
			vim.exec('2/a\n');
			var newChar = vim.curDoc.cursor.char();
			expect(newChar).equal(9)
		});

	});

	describe('W', function() {
		it('moves to next Word', function() {
			vim.curDoc.text('hello there');
			vim.exec('W');
			vim.curDoc.cursor.char().should.equal(6);
		});
		it('checks for first word on the line', function() {
			vim.curDoc.text('hello\nthere');
			vim.exec('W');
			vim.curDoc.cursor.char().should.equal(0);
			vim.curDoc.cursor.line().should.equal(1);
		});
	});

	describe('^', function() {
        beforeEach(function() {
            vim = new Vim();
        });
		it('moves to the first non-whitespace character on a line', function() {
			vim.text('     hi');		
			vim.exec('^');
			vim.curChar.should.equal('h');
		});

		it('lands on the first character if the first character is not whitespace', function() {
			vim.text('hi');
			vim.exec('^');
			vim.curChar.should.equal('h');
		});

	});
	describe('g_', function() {
		it('moves to the last non-whitespace character on the line', function() {
			vim.text('asdf   ');
			vim.exec('g_');
			vim.curChar.should.equal('f');
		});
	});


    describe(')', function() {
        beforeEach(function() {
            vim = new Vim();
        });
        it('goes to beginning of next sentence', function() {
            vim.text('asdf. asdf. qwer.');
            vim.exec(')');
            vim.curDoc.cursor.char().should.equal(6);
            vim.exec(')');
            vim.curDoc.cursor.char().should.equal(12);
        });
    });
    describe('(', function() {
        beforeEach(function() {
            vim = new Vim();
        });
        it('goes to beginning of this sentence', function() {
            vim.text('asdf. xyz. qwer.');
            vim.exec('$');
            vim.exec('h');
            vim.exec('(');
            vim.curDoc.cursor.char().should.equal(11);
        });

        it('it goes to the previous sentence if at beginning of one', function() {
            vim.text('asdf. xyz. qwer.');
            vim.curDoc.cursor.char(11);
            vim.exec('(');
            vim.curDoc.cursor.char().should.equal(6);
        });
        it('goes to beginning of line if need be', function() {
            vim.text('hello\nasdf. xyz. qwer.');
            vim.curDoc.cursor.line(1);
            vim.curDoc.cursor.char(6);
            vim.exec('(');
            vim.curDoc.cursor.line().should.equal(1);
            vim.curDoc.cursor.char().should.equal(0);
        });
        it('handles sentences of multiple words', function() {
            vim.text('hello\nasdf asdf qwer. xyz zxcv qwer. qwer fdsa.');
            vim.curDoc.cursor.line(1);
            vim.curDoc.cursor.char(6);
            vim.exec('(');
            vim.curDoc.cursor.line().should.equal(1);
            vim.curDoc.cursor.char().should.equal(0);
            vim.exec('$');
            vim.exec('(');
            vim.curDoc.cursor.char().should.equal(31);
            vim.exec('(');
            vim.curDoc.cursor.char().should.equal(16);
        });
        it('handles ?', function() {
            vim.text('asdf? xyz? qwer?');
            vim.exec('$');
            vim.exec('h');
            vim.exec('(');
            vim.curDoc.cursor.char().should.equal(11);
        });
        it('handles !', function() {
            vim.text('asdf! xyz! qwer!');
            vim.exec('$');
            vim.exec('h');
            vim.exec('(');
            vim.curDoc.cursor.char().should.equal(11);
        });
    });
	/*
	describe('{n}|', function() {
		it('moves to that position', function() {
			vim.text('asdf');
			vim.exec('3|');
			vim.curDoc.cursor.char().should.equal(2);
		});
		it('is caught by d3|', function() {
			vim.text('asdf');
			vim.exec('d3|');
			vim.text().should.equal('df');
		});
	});
	*/
});
