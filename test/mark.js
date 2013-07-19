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
      ('a' in vim.curDoc._marks).should.equal(true);
      vim.curDoc._marks['a'].col.should.equal(0);
      vim.curDoc._marks['a'].line.should.equal(0);
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
      ('a' in vim.curDoc._marks).should.equal(true);
      vim.curDoc._marks['a'].col.should.equal(0);
      vim.curDoc._marks['a'].line.should.equal(0);
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
        var mk;
        for(var i in marks) {
            if(marks[i].mark === 'a') mk = marks[i];
        }
        mk.col.should.equal(7);
    });
    it('handles deletions in the line prior to the actual mark', function() {
        vim.text('asdf\nasdf')
        vim.exec('j');
        vim.exec('$');
        vim.exec('ma');
        vim.exec('0');
        vim.exec('x');
        vim.exec('`a');
        vim.curDoc.cursor.char().should.equal(2);
    });
    it('handles a join', function() {
        vim.text('asdf\nasdf');
        vim.exec('G');
        vim.exec('ma');
        vim.exec('k')
        vim.exec('J');
        vim.exec('`a');
        vim.curDoc.cursor.char().should.equal(5);
    });
    it('handles moving the mark to a new line', function() {
        vim.text('asdf\nasdf')
        vim.exec('j');
        vim.exec('$');
       vim.exec('ma');
        vim.exec('0');
        vim.exec('i');
        vim.exec('\b');
        vim.exec('esc');
        vim.exec('0');
        vim.exec('`a');
        vim.curDoc.cursor.char().should.equal(7);
    });

    it('\'[a-z] moves to that line', function() {
        vim.text('qwer\nasdf\nzxcv');
        vim.exec('gg');
        vim.exec('ma');
        vim.exec('G');
        vim.curDoc.cursor.line().should.equal(2);
        vim.exec("'a");
        vim.curDoc.cursor.line().should.equal(0);
        vim.curDoc.cursor.char().should.equal(0);
    });
    it('\'[a-z] moves to the beginning of that line', function() {
        vim.text('qwer\nasdf\nzxcv');
        vim.exec('gg');
        vim.exec('ma');
        vim.exec('G');
		vim.exec('$');
        vim.curDoc.cursor.line().should.equal(2);
        vim.exec("'a");
        vim.curDoc.cursor.line().should.equal(0);
        vim.curDoc.cursor.char().should.equal(0);
    });
    it('\'[a-z] moves to that line and character', function() {
        vim.text('qwer\nasdf\nzxcv');
        vim.exec('gg');
        vim.exec('$');
        vim.exec('ma');
        vim.exec('G');
        vim.curDoc.cursor.line().should.equal(2);
        vim.exec("`a");
        vim.curDoc.cursor.line().should.equal(0);
        vim.curDoc.cursor.char().should.equal(3);
    });
    it('is replaced by another mark of same name', function() {
        vim.text('asdf');
        vim.exec('ma');
        vim.exec('$');
        vim.exec('ma');
        vim.exec('0');
        vim.exec('`a')
        vim.curDoc.cursor.char().should.equal(3);
    });

});

describe('special marks', function() {
    beforeEach(function() {
        vim = new Vim();
    });
    it('. returns last edit position', function() {
        vim.text('asdf\nfdsa');
        vim.exec('x');
        vim.exec('j');
        vim.exec('`.');
        vim.curDoc.cursor.line().should.equal(0);
    });
});
