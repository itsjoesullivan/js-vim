describe('change', function() {

	var Vim = require('../index');
	var vim = new Vim();

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
			line.should.equal('');
		});

		it('saves the deletion in register', function() {
			vim.exec('v');
			vim.exec('$');
			vim.exec('h');
			vim.exec('x');
			var line = vim.text().split('\n')[0];
			vim.register(0).should.equal('asdf aloha what');
		});
	});

});


