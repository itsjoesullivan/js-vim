var Vim = require('../index');
var vim;
describe('smartindent', function() {
    beforeEach(function() {
        vim = new Vim();
    });
    it('does nothing if prevline does not end with {', function() {
        vim.text('hello');
        vim.exec('o');
        vim.curDoc.cursor.char().should.equal(0);
    });
    it('does something if prevline does end with a {', function() {
        vim.exec('i');
        vim.exec('var x = function() {\n');
        vim.exec('esc');
        vim.curDoc.cursor.char().should.equal(3);
    });
    it('only indents if that is the end of the line', function() {
        vim.exec('i');
        vim.exec('var x = function() {}\n');
        vim.exec('esc');
        vim.curDoc.cursor.char().should.equal(0);
    });
    it('indents if theres a comment afterwards in // form', function() {
        vim.exec('i');
        vim.exec('var x = function() { // awesome\n');
        vim.exec('esc');
        vim.curDoc.cursor.char().should.equal(3);
    });
    it('indents if theres a complete comment afterwards in /* */ form', function() {
        vim.exec('i');
        vim.exec('var x = function() { /* awesome */\n');
        vim.exec('esc');
        vim.curDoc.cursor.char().should.equal(3);
    });
    it('indents twice', function() {
        vim.exec('i');
        vim.exec('var x = function() { \n var y = function() {\nvar z;'); 
        vim.exec('esc');
        vim.exec('^');
        vim.curDoc.cursor.char().should.equal(9);
    });
});
