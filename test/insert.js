describe('insert', function() {

	var Vim = require('../index');
	var vim = new Vim();
	var expect = require('chai').expect;	


	beforeEach(function() {
		vim.new();
		vim.exec('esc');
	});

	describe('i', function() {
		it('gets us to insert mode', function() {
			vim.exec('i');
			expect(vim.modeName).equal('insert');
		});
	});
	describe('<char>', function() {
		it('adds that character', function() {
			vim.exec('i');
			vim.exec('z');
			expect(vim.text().indexOf('z')).equal(0);	
		});
	});
	describe('\\n', function() {
		it('creates a new line', function() {
			vim.exec('i');
			vim.exec('a');
			vim.exec('\n');

			expect(vim.curDoc._lines.length).equal(2);	
		});
	});
	describe('typing seems to work', function() {
		it('can handle five characters including a newline', function() {
			vim.exec('i');
			vim.exec('a');
			vim.exec('b');
			vim.exec('\n');
			vim.exec('c');
			vim.exec('d');
			var text = vim.text();
			expect(text).equal('ab\ncd');
		});

	});

});

