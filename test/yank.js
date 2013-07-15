describe('yank', function() {

	var Vim = require('../index');
	var vim = new Vim();

	var expect = require('chai').expect
	var doc;

	beforeEach(function() {
        vim = new Vim();
		doc = new Doc({text:'asdf\nzxcv\nqwer'});
		vim.curDoc = doc;
	});

    it('returns to the beginning of the selection after selecting.', function() {
       vim.exec('v'); 
       vim.exec('$');
       vim.exec('y');
       vim.curDoc.cursor.col().should.equal(0);
    });

    it('clears selection', function() {
       vim.exec('v'); 
       vim.exec('$');
       vim.exec('y');
       vim.curDoc.selection()[0].char.should.equal(0);
       vim.curDoc.selection()[1].char.should.equal(1);
    });

	describe('0v$y', function() {
		it('stores the contents of the line in the register', function() {
			vim.exec('0');
			vim.exec('v');
			vim.exec('$');
			vim.exec('y');
			var reg = vim.register(0);
			(reg).should.equal('asdf\n');
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
			(reg).should.equal('asdf\nzxcv\n');
		});
	});

	describe('yy', function() {
		it('grabs an array', function() {
			vim.exec('yy');
			var reg = vim.register(0);
			reg[0].should.equal('o');
		});
	});


});
