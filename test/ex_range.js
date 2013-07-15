var parseRange = require('../lib/modes/ex').parseRange;
var doc = {
	_lines: { length: 20 },
	cursor: {
		line: function() { return 10; }
	}
};

describe('parseRange', function() {
	it('exists', function() {
		(typeof parseRange).should.equal('function');
	});
	it('accepts % as all', function() {
		var range = parseRange('%',doc);
		range[0].should.equal(0);
		range[1].should.equal(19);
	});
	it('accepts empty string as current', function() {
		var range = parseRange('',doc);
		range[0].should.equal(10);
		range[1].should.equal(10);
	});
	it('accepts . as current', function() {
		var range = parseRange('.',doc);
		range[0].should.equal(10);
		range[1].should.equal(10);
	});
	it('accepts number as that line number', function() {
		var range = parseRange('12',doc);
		range[0].should.equal(11);
		range[1].should.equal(11);
	});
	it('accepts $ as last', function() {
		var range = parseRange('$',doc);
		range[0].should.equal(19);
		range[1].should.equal(19);
	});
	it('handles commas basically', function() {
		var range = parseRange('1,1',doc);
		range[0].should.equal(0);
		range[1].should.equal(0);
	});
	it('handles 1,$', function() {
		var range = parseRange('1,$',doc);
		range[0].should.equal(0);
		range[1].should.equal(19);
	});
	it('handles .,.+1', function() {
		var range = parseRange('.,.+1',doc);
		range[0].should.equal(10);
		range[1].should.equal(11);
	});
	it('handles .-1,.+7', function() {
		var range = parseRange('.-1,.+7',doc);
		range[0].should.equal(9);
		range[1].should.equal(17);
	});

		

});
