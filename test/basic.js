describe('basic', function() {

	var Vim = require('../index');
	var vim = new Vim();

	var expect = require('chai').expect;	


	beforeEach(function() {
		vim.new();
	});

	describe('o', function() {
		it('goes to next line', function() {
			vim.exec('i');
			vim.exec('a');
			vim.exec('esc');
			vim.exec('o');
			expect(vim.curDoc.cursor.line()).equal(1);
		});
		it('enters insert mode', function() {
			vim.exec('i');
			vim.exec('a');
			vim.exec('esc');
			vim.exec('o');
			expect(vim.modeName).equal('insert');
		});
		it('does not carry anything else over', function() {
			vim.exec('i');
			vim.exec('a');
			vim.exec('b');
			vim.exec('esc');
			vim.exec('0');
			vim.exec('o');
			vim.exec('c');
			var text = vim.text();
			expect(text).equal('ab\nc');	
		});
	});

});
