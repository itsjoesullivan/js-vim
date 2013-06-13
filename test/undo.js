describe('undo', function() {
	var Undo = require('../lib/Undo');
console.log('undo',Undo);
	var undo;
	var expect = require('chai').expect;

	beforeEach(function() {
		undo = new Undo();
	});

	it('exists', function() {
		expect(typeof undo).equal('object');
	});

})
