var Vim = require('../index');
var vim;
describe('~', function() {
	beforeEach(function() {
		vim = new Vim();
	});
	it('switches the case', function() {
		vim.text('a');
		vim.exec('~');
		vim.text().should.equal('A');
	});
});
