var Vim = require('../index');
var vim;
describe('Vim.toJSON()', function() {
	beforeEach(function() {
		vim = new Vim();	
	});
	it('returns an object', function() {
		(typeof vim.toJSON()).should.equal('object');
	});
	it('has mode as text', function() {
		(typeof vim.toJSON().mode).should.equal('string');
	});
	it('has text as text', function() {
		(typeof vim.toJSON().text).should.equal('string');
	});
	it('returns docs text', function() {
		vim.text('asdf fdsa');
		vim.toJSON().text.should.equal('asdf fdsa');
	});
	it('has a cursor', function() {
		var curse = vim.toJSON().cursor;
		curse.line.should.equal(0);
		curse.col.should.equal(0);
	});
	it('has a selection', function() {
		var selection = vim.toJSON().selection;
		selection[0].line.should.equal(0);
		selection[1].line.should.equal(0);
	});
});
