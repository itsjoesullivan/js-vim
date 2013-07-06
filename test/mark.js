var Vim = require('../index');
var vim;
describe('marks', function() {
    beforeEach(function() {
        vim = new Vim();
        vim.text('asdf\nqwer\nzxcv');
    });
    it('m[a-z] marks the bit.', function() {
        vim.exec('gg');
        vim.exec('0');
      vim.exec('ma');  
      ('a' in vim.marks).should.equal(true);
      vim.marks['a'].col.should.equal(0);
      vim.marks['a'].line.should.equal(0);
      vim.curDoc._lines[0].marks.length.should.equal(1);
    });

    it('deleting over a mark removes it', function() {
        vim.text('');
        vim.exec('i');
        vim.exec('hi');
        vim.exec('esc');
        vim.exec('0');
      vim.exec('ma');  
      vim.exec('x');
      ('a' in vim.marks).should.equal(true);
      vim.marks['a'].col.should.equal(0);
      vim.marks['a'].line.should.equal(0);
    });
    it('getting range doesnt change things', function() {
        vim.text('');
        vim.exec('i');
        vim.exec('a');
        vim.curDoc.addMark({mark: 'a', line: 0, col: 1 });
        vim.curDoc._lines[0].marks[0].col.should.equal(1);
        vim.curDoc.getRange([{ line: 0, char: 0 }, { line: 0, char: 1 }]);
        vim.curDoc._lines[0].marks[0].col.should.equal(1);
    });
    it('typing before a mark moves it forward', function() {
        vim.text('');
        vim.exec('i');
        vim.exec('asdf');
        vim.exec('esc');
        vim.exec('ma');
        vim.exec('0');
        vim.exec('i');
        vim.exec('q');
        vim.exec('w');
        vim.exec('e');
        vim.exec('r');
        var marks = vim.curDoc._lines[0].marks;
        marks.length.should.equal(1);
        marks[0].col.should.equal(7);
    });
    it('\'[a-z] moves to that mark', function() {
        vim.text('qwer\nasdf\nzxcv');
        vim.exec('gg');
        vim.exec('ma');
        vim.exec('G');
        vim.curDoc.cursor.line().should.equal(2);
        vim.exec("'a");
        vim.curDoc.cursor.line().should.equal(0);
    });

});
