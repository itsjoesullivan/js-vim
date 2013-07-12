var Vim = require('../index.js');
var vim;
describe('vim', function() {
	beforeEach(function() {
		vim = new Vim();
	});
	it('exists', function() {
		(vim instanceof Vim).should.equal(true);
	});
	describe('.curChar', function() {
		it('exists', function() {
			vim.exec('i');
			vim.exec('asdf');
			(typeof vim.curChar).should.equal('string');
		});
	});
	describe('.curWord', function() {
		it('exists', function() {
			(typeof vim.curWord).should.equal('string');
		});
		it('handles asdf', function() {
			vim.exec('i');
			vim.exec('asdf');
			vim.exec('esc');
			(typeof vim.curWord).should.equal('string');
			vim.curWord.should.equal('asdf');
		});
		it('handles asdf fdsa', function() {
			vim.exec('i');
			vim.exec('asdf fdsa');
			vim.exec('esc');
			(typeof vim.curWord).should.equal('string');
			vim.curWord.should.equal('fdsa');
		});
		it('handles asdf q[w]er fdsa', function() {
			vim.exec('i');
			vim.exec('asdf fdsa');
			vim.exec('esc');
			vim.exec('b');
			vim.exec('i');
			vim.exec('qwer ');
			vim.exec('esc');
			vim.exec('b');
			vim.exec('l');
			(typeof vim.curWord).should.equal('string');
			vim.curWord.should.equal('qwer');
		});
		it('handles asdf [q]wer fdsa', function() {
			vim.exec('i');
			vim.exec('asdf fdsa');
			vim.exec('esc');
			vim.exec('b');
			vim.exec('i');
			vim.exec('qwer ');
			vim.exec('esc');
			vim.exec('b');
			(typeof vim.curWord).should.equal('string');
			vim.curWord.should.equal('qwer');
		});
		it('handles words in insert mode', function() {
			vim.exec('i');
			vim.exec('asdf');
			vim.curWord.should.equal('asdf');
		});
	});
});
