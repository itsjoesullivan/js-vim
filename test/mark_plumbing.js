var mark = require('../lib/mark');

describe('mark', function() {
    it('exists', function() {
        (typeof mark).should.equal('function');
    });
    it('returns a stringy thing', function() {
        var str = mark('asdf');
        (str instanceof String).should.equal(true);
    });
    it('passing it a mark will yield that mark back', function() {
        var str = mark('asdf',{ mark: 'a', col: 0 });
        str.marks[0].col.should.equal(0);
    });
    it('creating a substring will pass the mark correctly', function() {
        var str = mark('asdf', { mark: 'a', col: 0 });
        var y = str.substring(0,2);
        y.marks[0].col.should.equal(0);
    });
    it('creating a concat that will retain its own marks', function() {
        var str = mark('asdf', { mark: 'a', col: 0 });
        str = str.concat('hey');
        str.marks[0].col.should.equal(0);
    });
    it('creating a concat that will absorb other marks', function() {
        var str = mark('asdf', { mark: 'a', col: 0 });
        var str2 = mark('qwer', { mark: 'b', col: 3});
        str = str.concat(str2);
        str.marks.length.should.equal(2);
        str.marks[1].mark.should.equal('b');
        str.marks[1].col.should.equal(7);
    });
    it('works for three layers', function() {
        var str = mark('asdf');
        var str2 = mark('fdsa');
        var str3 = mark('qwer', { mark: 'a', col: 0 });
        str.concat(str2).concat(str3).marks.length.should.equal(1);
    });
    it('handles nonmarks', function() {
        mark('asdf', { mark : 'a', col: 0, line: 1 }).concat('\n').concat('qwer').toString().should.equal('asdf\nqwer');
    });
    it('handles substringing itself', function() {
        var str = mark('asdf', {mark: 'q', col: 3, line: 0 });
        var newStr = str.substring(0,3).concat(str.substring(3));
        newStr.marks.length.should.equal(1);
    });
    it('handles substring, new text, substring concat\'d', function() {
//        var str = mark('asdf', { mark: 
    });
    it('doesnt mind empty string starting things off', function() {
        var text = mark('');
        text = text.concat(mark('asdf',{mark: 'a',col: 2, line: 0 }))
        text.marks[0].col.should.equal(2);
    });
});
