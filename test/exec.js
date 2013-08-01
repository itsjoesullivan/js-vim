var Vim = require('../index.js');
var vim;
describe('vim.exec', function() {
	beforeEach(function() {
		vim = new Vim();
	});
	it('with no args does not throw', function() {
		(vim.exec() === undefined).should.equal(true);
	});
});
