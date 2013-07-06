describe('delete', function() {


	var Vim = require('../index');
	var vim = new Vim();

	var textA = 'qwer\nasdf\nzxcv';

	beforeEach(function() {
		var doc = new vim.Doc({text: textA});
		vim.curDoc = doc;
	});

	describe('x', function() {
		it('erases character it is on', function() {
			vim.exec('x');
			var firstLine = vim.text().split('\n')[0];
			firstLine.should.equal('wer');
			
		});
		it('erases two characters if selection is first two', function() {
			vim.exec('v');
			vim.exec('l');
			vim.exec('x');
			var firstLine = vim.text().split('\n')[0];
			firstLine.should.equal('er');
		});
		it('erases every char if $h used', function() {
			vim.exec('0');
			vim.exec('v');
			vim.exec('$');
			vim.exec('h');
			vim.exec('x');
			var firstLine = vim.text().split('\n')[0];
			firstLine.should.equal('');
		});
		it('erases entire line if 0$ used', function() {
			vim.exec('0');
			vim.exec('v');
			vim.exec('$');
			vim.exec('x');
			var firstLine = vim.text().split('\n')[0];
			firstLine.should.equal('asdf');
		});
		it('accepts {n}x format', function() {
			vim.exec('0');
			vim.exec('2x');
			var firstLine = vim.text().split('\n')[0];
			firstLine.should.equal('er');
		});
		it('can erase multiple lines', function() {
			vim.exec('0');
			vim.exec('v');
			vim.exec('$');
			vim.exec('x');
			vim.exec('v');
			vim.exec('$');
			vim.exec('x');
			var firstLine = vim.text().split('\n')[0];
			firstLine.should.equal('zxcv');
		});
	});
	describe('d', function() {
		it('erases two characters if selection is first two', function() {
			vim.exec('v');
			vim.exec('l');
			vim.exec('d');
			var firstLine = vim.text().split('\n')[0];
			firstLine.should.equal('er');
		});
		it('erases every char if $h used', function() {
			vim.exec('0');
			vim.exec('v');
			vim.exec('$');
			vim.exec('h');
			vim.exec('d');
			var firstLine = vim.text().split('\n')[0];
			firstLine.should.equal('');
		});
		it('erases entire line if 0$ used', function() {
			vim.exec('0');
			vim.exec('v');
			vim.exec('$');
			vim.exec('d');
			var firstLine = vim.text().split('\n')[0];
			firstLine.should.equal('asdf');
		});
		it('can erase multiple lines', function() {
			vim.exec('0');
			vim.exec('v');
			vim.exec('$');
			vim.exec('d');
			vim.exec('v');
			vim.exec('$');
			vim.exec('d');
			var firstLine = vim.text().split('\n')[0];
			firstLine.should.equal('zxcv');
		});
	});

	describe('dd', function() {
		it('erases an empty line', function() {
			vim.text('hello\n\nthere');
			vim.exec('j');
			vim.text().should.equal('hello\n\nthere');
			vim.exec('d');	
			vim.exec('d');	
			vim.text().should.equal('hello\nthere');
		});
	});

    describe('dG', function() {
        it('deletes til the end', function() {
            vim.text('asdf\nasdf\nasdf');
            vim.exec('0');
            vim.exec('dG');
            vim.text().should.equal('');
        });
    });


});
