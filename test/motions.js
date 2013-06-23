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

});
