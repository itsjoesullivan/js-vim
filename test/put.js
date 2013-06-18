describe('paste', function() {

	var Vim = require('../index');
	var vim = new Vim();

	var expect = function(assertion) {

	return {
		equal: function(obj) {
			if(assertion == obj) return true;
			throw "expected " + assertion + " to equal " + obj;
		}
	}

};

	var doc;

	beforeEach(function() {
		doc = new Doc({text:'asdf\nzxcv\nqwer'});
		vim.curDoc = doc;
	})

	describe('p', function() {
		it('inserts the contents of the first register after the cursor', function() {
			vim.register(0,'hello');
			vim.exec('p');
			var text = vim.text();
			expect(text.indexOf('ahello')).equal(0);
			//expect(reg).equal('asdf');
		});
	});
	describe('P', function() {
		it('inserts the contents of the first register at the cursor', function() {
			vim.register(0,'hello');
			vim.exec('P');
			var text = vim.text();
			expect(text.indexOf('hello')).equal(0);
		});
	});
});
