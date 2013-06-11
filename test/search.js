describe('search', function() {

	var vim = require('../index');

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


});