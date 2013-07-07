var Vim = require('../../index');
var vim;
describe('#65: cursor.position should set position', function() {
    beforeEach(function() {
        vim = new Vim();
        vim.text('asdf\nfdsa');
    });
    it('sets position', function() {
        var pos = vim.curDoc.cursor.position();
        pos.line = 1;
        vim.curDoc.cursor.position(pos);
        vim.curDoc.cursor.line().should.equal(1);
    });
});

