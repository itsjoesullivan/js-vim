var Vim = require('../index');

var vim;
describe('undo', function() {
	beforeEach(function() {
		vim = new Vim();	
	});

	it('will delete a general insertion', function() {
		vim.exec('i');
		vim.exec('asdf\nqwer\nzxcv');
		vim.exec('esc');
		vim.exec('u');
		vim.text().should.equal('');
	});

	it('will erase two general insertions if triggered twice', function() {
		vim.exec('i');
		vim.exec('asdf');
		vim.exec('esc');
		vim.exec('qwer');
		vim.exec('esc');
		vim.exec('u');
		vim.exec('u');
		vim.text().should.equal('');
	});
	it('will reverse a single x deletion', function() {
		vim.exec('i');
		vim.exec('asdf');
		vim.exec('esc');
		vim.exec('x');
		vim.text().should.equal('asd');
		vim.exec('u');

	});
	it('will reverse 2x', function() {
		vim.exec('i');
		vim.exec('a');
		vim.exec('s');
		vim.exec('d');
		vim.exec('f');
		vim.exec('esc');
		vim.exec('a');
		vim.exec('hi');
		vim.exec('esc');
		vim.exec('0');
		vim.exec('2');
		vim.exec('x');
		vim.exec('esc');
		vim.exec('u');
		vim.exec('C-r');
		vim.text().should.equal('asdfhi');
	});

//dw broken right now
/*	it('will reverse 2dw', function() {
		vim.exec('i');
		vim.exec('asdf fdsa qwer');
		vim.exec('esc');
		vim.exec('0');
		vim.exec('2dw');
		vim.text().should.equal('qwer');
		vim.exec('u');
		vim.text().should.equal('asdf fdsa qwer');
	});
*/

	it('moves cursor to where it was at beginning of undone write', function() {
		vim.exec('i');
		vim.exec('asdf');
		vim.exec('esc');
		vim.exec('o');
		vim.exec('fdsa');
		vim.exec('esc');
		vim.exec('u');
		vim.curDoc.cursor.char().should.equal(3);
	});
	it('moves cursor to where it was at beginning of undone write', function() {
		vim.exec('i');
		vim.exec('asdf');
		vim.exec('esc');
		vim.exec('0');
		vim.exec('o');
		vim.exec('fdsa');
		vim.exec('esc');
		vim.exec('u');
		vim.curDoc.cursor.char().should.equal(0);
	});
 });


