var Doc = require('../../lib/Doc');
var doc;
describe('Doc.remove', function() {
    beforeEach(function() {
        doc = new Doc();
    });
    it('exists', function() {
        (typeof doc.remove).should.equal('function');
    });
	it('removes a range of text', function() {
		doc.text('asdf');
		doc.remove([
			{line: 0, char: 0},
			{line: 0, char: 1}
		]);
		doc.text().should.equal('sdf');
	});
	it('removes a special block range of text, essentially an array of ranges', function() {
		doc.text('asdf');
		doc.remove([
			[
				{ line: 0, char: 0 },
				{ line: 0, char: 1 }
			]
		]);
		doc.text().should.equal('sdf');
	});
	it('removing a character beyond the end of the line is the same as removing a carriage return', function() {
		doc.text('asdf\nfdsa');
		doc.remove([
		{
			line: 0,
			char: 0
		},
		{
			line: 0,
			char: 5
		}
		]);
		doc.text().should.equal('fdsa');
	});
});
