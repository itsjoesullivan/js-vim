var Vim = require('../../index');
var vim;
describe('y in visual mode should end up in command mode', function() {
	beforeEach(function() {
		vim = new Vim();
	});
	it('does', function() {
		vim.text('asdf');
		vim.exec('v');
		vim.exec('$');
		vim.exec('y');
		vim.modeName.should.equal('command');
	});
});
