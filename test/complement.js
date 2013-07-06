var Vim = require('../index');
var vim;
describe('%', function() {
    beforeEach(function() {
        vim = new Vim();
    });
    it('works in obvious case', function() {
        vim.text('{     }    ');
        vim.curDoc.cursor.line(0);
        vim.curDoc.cursor.char(0);
        vim.exec('%');
        vim.curDoc.cursor.char().should.equal(6);
    });
    it('finds matching bracket', function() {
        vim.text('{ { } }    ');
        vim.curDoc.cursor.line(0);
        vim.curDoc.cursor.char(0);
        vim.exec('%');
        vim.curDoc.cursor.char().should.equal(6);
    });

    it('finds deep nested', function() {
        vim.text('{   { {} {} {} } }');
        vim.curDoc.cursor.char(4);
        vim.exec('%');
        vim.curDoc.cursor.char().should.equal(15);
    });
    it('works for }', function() {
        vim.text('{   { {} {} {} } }');
        vim.curDoc.cursor.char(15);
        vim.exec('%');
        vim.curDoc.cursor.char().should.equal(4);
    });
    it('works for (', function() {
        vim.text('(   ( () () () ) )');
        vim.curDoc.cursor.char(4);
        vim.exec('%');
        vim.curDoc.cursor.char().should.equal(15);
    });

    it('works for )', function() {
        vim.text('(   ( () () () ) )');
        vim.curDoc.cursor.char(15);
        vim.exec('%');
        vim.curDoc.cursor.char().should.equal(4);
    });
    it('doesnt barf on nothing', function() {
        vim.text('(   ( () () () ) )');
        vim.curDoc.cursor.char(1);
        vim.exec('%');
        vim.curDoc.cursor.char().should.equal(1);
    });
    it('doesnt barf on unclosed', function() {
        vim.text('(   ( () () () )');
        vim.curDoc.cursor.char(0);
        vim.exec('%');
        vim.curDoc.cursor.char().should.equal(0);
    });
});
