describe('cursor', function() {

	var Vim = require('../index');
	var vim = new Vim();

	var expect = require('chai').expect;	


	beforeEach(function() {
		doc = new Doc({text:'asdf\nzxcv\nqwerty    \nfourth'});
		vim.curDoc = doc;
		vim.exec('esc');
		vim.exec('gg');
		vim.exec('0');
	});

	describe('char', function() {
		it('does not return a character greater than the length of the line', function() {
			vim.exec('3G');
			vim.exec('$');
			vim.exec('k');
			expect(vim.curDoc.cursor.char()).equal(4);
		});
		it('remembers the furthest character it wants to be on', function() {
			vim.exec('3G');
			vim.exec('$');
			vim.exec('k');
			vim.exec('j');
			expect(vim.curDoc.cursor.char()).equal(9);
		});
	});

	describe('position', function() {
		it('returns an object with line, char', function() {
			var pos = vim.curDoc.cursor.position();
			expect('line' in pos).equal(true);
			expect('char' in pos).equal(true);
		});
	});
});
