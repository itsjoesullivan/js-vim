describe('change', function() {

	var Vim = require('../index');
	var vim = new Vim();

	var expect = require('chai').expect
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
	});

});


