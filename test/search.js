describe('search', function() { var Vim = require('../index'); var vim = new Vim();
	var expect = require('chai').expect;

	var doc;

	beforeEach(function() {
		doc = new Doc({text:'asdf aloha what\nzxcv\nqwer'});
		vim.curDoc = doc;
	});

	describe('w', function() {
		it('can move cursor to the next word', function() {
			vim.exec('w');
			expect(doc.cursor.char()).equal(5)
		});
		it('catches words at beginning of line', function() {
			vim.exec('w');
			vim.exec('w');
			vim.exec('w');
			expect(doc.cursor.char()).equal(0)
			expect(doc.cursor.line()).equal(1)
		});
		it('distinguishes non-alpha characters as independent words', function() {
			vim = new Vim();
			vim.text('hello-there');
			vim.exec('w');
			expect(vim.curDoc.cursor.char()).equal(5);
		});

	});

	describe('b', function() {
		it('moves cursor to the previous word', function() {
			vim.exec('$');
			vim.exec('b');
			var currentChar = vim.cursor().char();
			expect(currentChar).equal(11);
		});
		it('moves cursor back two if called twice', function() {
			vim.exec('$');
			vim.exec('b');
			vim.exec('b');
			var currentChar = vim.cursor().char();
			expect(currentChar).equal(5);
		});
	})
	describe('/"a', function() {
		beforeEach(function() {
			vim = new Vim();
		});
		it('searches from the "a register', function() {
			vim.text('a b c');
			vim.register('a','b');
			vim.exec('/"a\n');
			vim.curWord.should.equal('b');
		});
	});
	describe('/\\n', function() {
		it('repeats last search', function() {
			vim.text('a a a a');
			vim.exec('/a\n');
			vim.exec('/\n');
			vim.curDoc.cursor.char().should.equal(4);
		});
	});
	describe('?\\n', function() {
		it('repeats last backwards search', function() {
			vim.text('a a a a');
			vim.exec('$');
			vim.exec('?a\n');
			vim.exec('?\n');
			vim.curDoc.cursor.char().should.equal(2);
		});
	});
});
