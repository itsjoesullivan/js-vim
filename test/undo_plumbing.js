var Undo = require('../lib/Undo');

var undo;
describe('undo', function() {
	beforeEach(function() {
		undo = new Undo();
	});	

	it('exists', function() {
		(typeof undo).should.equal('object');
	});

	describe('_history', function() {
		it('is array', function() {
			('length' in undo._history).should.equal(true);
			('substring' in undo._history).should.equal(false);
		});
	});

	describe('position', function() {
		it('is zero', function() {
			undo.position.should.equal(0);
		});
	});

	describe('add', function() {
		it('increments position', function() {
			undo.add('asdf');
			undo.position.should.equal(1);
		});
		it('adds first argument to _history', function() {
			undo.add('asdf');
			undo._history[0].should.equal('asdf');
		});
	});

	describe('get', function() {
		it('retrieves a specific state and sets the position to that index', function() {
			undo.add('asdf');
			undo.add('qwer');
			undo.get(0).should.equal('asdf');
			undo.position.should.equal(0);
		});
	});

	describe('last', function() {
		it('retrieves the previous state', function() {
			undo.add('asdf');
			undo.add('qwer');
			undo.add('zxcv');
			undo.add('dfgh');
			undo.last().should.equal('dfgh');
			undo.position.should.equal(3);
		});
	});
	describe('next', function() {
		it('retrieves the next state', function() {
			undo.add('asdf');
			undo.add('qwer');
			undo.add('zxcv');
			undo.add('dfgh');
			undo.last();
			undo.last();
			undo.next().should.equal('dfgh');
		});
	});
			

});
