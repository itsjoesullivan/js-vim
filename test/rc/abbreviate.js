var Vim = require('../../index');
var vim;
describe('abbreviate', function() {
	beforeEach(function() {
		vim = new Vim();
	});
	it('has an rc object', function() {
		('abbreviations' in vim.rc).should.equal(true);
	});
	it('fills out abbreviations on space', function() {
		vim.rc.abbreviations.funtion = 'function'
		vim.exec('i');
		vim.exec('funtion');
		vim.exec(' ');
		vim.text().should.equal('function ');
	});
	it('fills out abbreviation on enter', function() {
		vim.rc.abbreviations.funtion = 'function'
		vim.exec('i');
		vim.exec('funtion');
		vim.exec('\n');
		vim.text().should.equal('function\n');
	});
	it('fills out abbreviation on enter', function() {
		vim.rc.abbreviations.funtion = 'function'
		vim.exec('i');
		vim.exec('funtion');
		vim.exec('esc');
		vim.text().should.equal('function');
	});
});
