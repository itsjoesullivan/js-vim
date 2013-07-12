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
	it('doesnt go if not all typed in same insert session', function() {
		vim.rc.abbreviations.funtion = 'function'
		vim.exec('i');
		vim.exec('funt');
		vim.exec('esc');
		vim.exec('a');
		vim.exec('ion');
		vim.exec('esc');
		vim.text().should.equal('funtion');
	});
});
describe(':abbreviate', function() {
	beforeEach(function() {
		vim = new Vim();
	});
	it('adds that abbreviation', function() {
		vim.exec(':abbreviate asdf fdsa\n');
		('asdf' in vim.rc.abbreviations).should.equal(true);
		vim.rc.abbreviations.asdf.should.equal('fdsa');
	});
	it('has :ab as an alias', function() {
		vim.exec(':ab asdf fdsa\n');
		('asdf' in vim.rc.abbreviations).should.equal(true);
		vim.rc.abbreviations.asdf.should.equal('fdsa');
	});
	it('handles multiple words in rhs', function() {
		vim.exec(':ab asdf fdsa qwer fdsa\n');
		('asdf' in vim.rc.abbreviations).should.equal(true);
		vim.rc.abbreviations.asdf.should.equal('fdsa qwer fdsa');
	});
});
