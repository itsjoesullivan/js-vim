var Doc = require('../../lib/Doc');
var doc;
describe('Doc.find', function() {
    beforeEach(function() {
        doc = new Doc();
    });
    it('exists', function() {
        (typeof doc.find).should.equal('function');
    });
    it('returns an object with line and char', function() {
        doc.text('asdf');
        var pos = doc.find(/(s)/g);
        ('line' in pos).should.equal(true);
        ('char' in pos).should.equal(true);
    });
    it('retrieves the nearest match to the first capture of the passed regular expression', function() {
        doc.text('asdf');
        doc.find(/(s)/g).char.should.equal(1);
    });
    it('works backwards', function() {
        doc.text('asdf');
        doc.cursor.line(0);
        doc.cursor.char(3);
        var pos = doc.find(/(s)/g, { backwards: true });
        pos.char.should.equal(1);
        pos.line.should.equal(0);
    });
    it('works over lines', function() {
        doc.text('aaa\nasdf');
        var pos = doc.find(/(s)/g)
        pos.char.should.equal(1);
        pos.line.should.equal(1);
    });
    it('works backwards over lines', function() {
        console.log('this');
        doc.text('asdf\naaa');
        doc.cursor.line(1);
        var pos = doc.find(/(s)/g, { backwards: true } )
        console.log(pos);
        pos.char.should.equal(1);
        pos.line.should.equal(0);
    });
});
