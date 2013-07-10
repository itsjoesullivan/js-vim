var Vim = require('../index');
var vim;
describe('visual block', function() {
	beforeEach(function() {
		vim = new Vim();
	});
	it('<C-v> enters visual block mode', function() {
		vim.exec('<C-v>');
		vim.submode.should.equal('block');
	});
	it('I allows inserting text to all lines', function() {
		vim.text('asdf\nfdsa');
		vim.exec('l');
		vim.curDoc.cursor.char().should.equal(1);
		vim.exec('<C-v>');
		vim.exec('j');
		vim.exec('I');
		vim.exec('hello');
		vim.exec('esc');
		vim.text().should.equal('ahellosdf\nfhellodsa');
	});
});
