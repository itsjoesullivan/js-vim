var Vim = require('../../index');
var vim;
describe('#67: ve should select to the end of the word', function() {
    beforeEach(function() {
        vim = new Vim();
        vim.text('asdf\nfdsa');
    });
    it('if space at end of line', function() {
        vim.text('asdf fdsa qwer ');
        vim.exec('2w');
        vim.exec('ye');
        vim.register(0).should.equal('qwer');
    });

    it('if second word of three', function() {
        vim.text('asdf fdsa qwer');
        vim.exec('w');
        vim.exec('ye');
        vim.register(0).should.equal('fdsa');
    });

    it('if only word on line', function() {
        vim.text('asdf');
        vim.exec('ye');
        vim.register(0).should.equal('asdf');
    });
});

