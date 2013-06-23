var Vim = require('../index');
var vim;
describe('issues', function() {
	beforeEach(function() {
		vim = new Vim();
	});
	describe('37', function() {
		it('"O" not working correctly.', function() {
			vim.text('asdf\nfdsa\nqwer');
			vim.exec('gg');
			vim.exec('j');
			vim.exec('O');
			vim.curDoc.cursor.line().should.equal(1);
			var text = vim.text();
			text.should.equal('asdf\n\nfdsa\nqwer')
		});
	});

});
