describe('change', function() {

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
	describe('x', function() {
		it('erases the word', function() {
			vim.exec('v');
			vim.exec('$');
			vim.exec('h');
			vim.exec('x');
			var line = vim.text().split('\n')[0];
			expect(line).equal('');
		});

		it('saves the deletion in register', function() {
			vim.exec('v');
			vim.exec('$');
			vim.exec('h');
			vim.exec('x');
			var line = vim.text().split('\n')[0];
			expect(vim.register(0)).equal('asdf aloha what');
		});

		it('selects text correctly when moving backwards', function() {
			vim.exec('$');
			vim.exec('v');
			vim.exec('0');
			var range = vim.curDoc.selection();
			expect(range[0].char).equal(0);
			var text = vim.curDoc.getRange(range);
			expect(text).equal('asdf aloha what');
		});

	});

});
