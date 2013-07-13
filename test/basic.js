describe('basic', function() {

	var Vim = require('../index');
	var vim = new Vim();

	var expect = require('chai').expect;	


	beforeEach(function() {
		vim.new();
	});

	describe('o', function() {
		beforeEach(function() {
			vim = new Vim();
		});
		it('goes to next line', function() {
			vim.exec('i');
			vim.exec('a');
			vim.exec('esc');
			vim.exec('o');
			vim.curDoc.cursor.line().should.equal(1)
		});
		it('enters insert mode', function() {
			vim.exec('i');
			vim.exec('a');
			vim.exec('esc');
			vim.exec('o');
			vim.modeName.should.equal('insert');
		});
		it('does not carry anything else over', function() {
			vim.exec('i');
			vim.exec('a');
			vim.exec('b');
			vim.exec('esc');
			vim.exec('0');
			vim.exec('o');
			vim.exec('c');
			vim.text().should.equal('ab\nc');
		});
	});

	describe('dd', function() {
		it('removes the line', function() {
			vim.exec('i');
			vim.exec('asdf');
			vim.exec('esc');
			vim.exec('o')
			vim.exec('asdf');
			vim.exec('esc');
			vim.exec('o')
			vim.exec('asdf');
			vim.exec('esc');
			vim.exec('k');
			vim.exec('dd');
			vim.text().should.equal('asdf\nasdf');
		});
		it('removes an empty line', function() {
			vim.exec('i');
			vim.exec('a');
			vim.exec('esc');
			vim.exec('o');
			vim.exec('\n');
			vim.exec('b')	
			vim.exec('esc');
			vim.exec('k');
			vim.exec('dd');
			vim.text().should.equal('a\nb');
		});
		it('goes to the next line even if the next is empty', function() {
			vim.text('asdf\n\n\nfdsa');
			vim.exec('o');
			vim.curDoc.cursor.line().should.equal(1);
		});
		it('out of smartindent, goes to the next line even if the current is empty', function() {
			vim.text('asdf\n\n\nfdsa');
			vim.rc.smartindent = false;
			vim.exec('j');
			vim.exec('o');
			vim.curDoc.cursor.line().should.equal(2);
		});
		it('in smartindent, goes to the next line even if the current is empty', function() {
			vim.text('asdf\n\n\nfdsa');
			vim.rc.smartindent = true;
			vim.exec('j');
			vim.exec('o');
			vim.curDoc.cursor.line().should.equal(2);
		});
	});

});
