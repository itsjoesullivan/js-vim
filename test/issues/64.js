var Vim = require('../../index');
var vim;
describe('#64: doc.selection(range) should set selection', function() {
    beforeEach(function() {
        vim = new Vim();
        vim.text('asdf\nfdsa');
    });
    it('sets selection', function() {
        var sel = vim.curDoc.selection();
        sel[1].char = 3;
        vim.curDoc.selection(sel);
        vim.curDoc.selection()[1].char.should.equal(3);
    });
});

