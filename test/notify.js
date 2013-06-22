var Vim = require('../index');
var vim = new Vim();

describe('vim.notify', function() {
	it('exists', function() {
		(typeof vim.notify).should.equal('function');
	});
	it('sets vim.view.status', function() {
		vim.notify('heeello');
		vim.view.status.should.equal('heeello');
	});
})
