describe('cursor', function() {

	var Vim = require('../index');
	var vim = new Vim();



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
			vim.curDoc.cursor.char().should.equal(4);
		});
		it('remembers the furthest character it wants to be on', function() {
			vim.exec('3G');
			vim.exec('$');
			vim.exec('k');
			vim.exec('j');
			vim.curDoc.cursor.char().should.equal(9);
		});
	});

	describe('position', function() {
		it('returns an object with line, char', function() {
			var pos = vim.curDoc.cursor.position();
			('line' in pos).should.equal(true);
			('char' in pos).should.equal(true);
		});
	});
});
