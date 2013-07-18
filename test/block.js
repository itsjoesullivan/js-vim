var Vim = require('../index');
var vim;
describe('visual block', function() {
	beforeEach(function() {
		vim = new Vim();
	});
	it('<Ctrl-v> enters visual block mode', function() {
		vim.exec('<Ctrl-v>');
		vim.submode.should.equal('block');
	});
	it('I allows inserting text to all lines', function() {
		vim.text('asdf\nfdsa');
		vim.exec('l');
		vim.curDoc.cursor.char().should.equal(1);
		vim.exec('<Ctrl-v>');
		vim.exec('j');
		vim.exec('I');
		vim.exec('hello');
		vim.exec('esc');
		vim.text().should.equal('ahellosdf\nfhellodsa');
	});
	it('I does not affect blocks it is not covering', function() {
		vim.text('000000\n00\n000000');
		vim.exec('3l');
		vim.exec('<Ctrl-v>');
		vim.exec('j')
		vim.exec('j')
		vim.exec('I');
		vim.exec('x');
		vim.exec('esc');
		vim.text().should.equal('000x000\n00\n000x000');
	});
	it('a carriage return inside an I insertion negates the visual block effect', function() {
		vim.text('000\n000\n000');
		vim.exec('<Ctrl-v>');
		vim.exec('j');
		vim.exec('j');
		vim.exec('I')
		vim.exec('a\nb');
		vim.exec('esc');
		vim.text().should.equal('a\nb000\n000\n000');
	});
	it('A adds text to the end', function() {
		vim.text('000\n000');
		vim.exec('l');
		vim.exec('<Ctrl-v>');
		vim.exec('j');
		vim.exec('A');
		vim.exec('q');
		vim.exec('esc');
		vim.text().should.equal('00q0\n00q0');
	});
	it('d removes selected text', function() {
		vim.text('asdf\nfdsa');
		vim.exec('<Ctrl-v>');
		vim.exec('l');
		vim.exec('j');
		vim.exec('d');
		vim.text().should.equal('df\nsa');
	});
	it('c changes text then enters I mode', function() {
		vim.text('asdf\nfdsa');
		vim.exec('<Ctrl-v>');
		vim.exec('l');
		vim.exec('j');
		vim.exec('c');
		vim.exec('yo');
		vim.exec('esc');
		vim.text().should.equal('yodf\nyosa');
	});
	it('c handles text of various lengths', function() {
		vim.text('asdf\nf');
		vim.exec('$');
		vim.exec("<Ctrl-v>");
		vim.exec('j');
		vim.exec('c');
	});
	it('$ selects the entirety of each line', function() {
		vim.text('asdf\nasd\nas\na');
		vim.exec('<Ctrl-v>');
		vim.exec('j');
		vim.exec('j');
		vim.exec('j');
		vim.exec('$');
	});
	it("correctly highlights text when moving left", function() {
		vim.text('asdf\nfdsa\nqwer');
		vim.exec('$');
		vim.exec('<Ctrl-v>');
		vim.exec('j');
		vim.exec('h');
		var text = vim.view.getText().substring(6,11);
		var x = text.substring(3,4);
	});
});
