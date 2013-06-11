describe('yank', function() {

	var vim = require('../index');

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

	describe('0v$y', function() {
		it('stores the contents of the line in the register', function() {
			vim.exec('0');
			vim.exec('v');
			vim.exec('$');
			vim.exec('y');
			var reg = vim.register(0);
			expect(reg).equal('asdf\n');
		});
	});

	describe('0vj$y', function() {
		it('stores the contents of the two lines in the register', function() {
			vim.exec('0');
			vim.exec('v');
			vim.exec('j');
			vim.exec('$');
			vim.exec('y');
			var reg = vim.register(0);
			expect(reg).equal('asdf\nzxcv\n');
		});
	});

	describe('yy', function() {
		it('grabs the entire line including an \\n before', function() {
			vim.exec('yy');
			var reg = vim.register(0);
			expect(reg).equal('\nasdf\n')
		});
	});


});