var Vim = require('../../index');
var vim;
describe('#66: cursor.col acts as setter / getter for column index', function() {
    beforeEach(function() {
        vim = new Vim();
        vim.text('asdf\nfdsa');
    });
    it('gets position', function() {
        var col = vim.curDoc.cursor.col();
        col.should.equal(0);
    });
    it('gets position', function() {
        vim.curDoc.cursor.col(2)
        vim.curDoc.cursor.col().should.equal(2);
    });
});

