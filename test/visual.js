describe('visual', function() {

	var Vim = require('../index');
	var vim = new Vim();
	var expect = require('chai').expect
	var doc;

	beforeEach(function() {
		doc = new Doc({text:'asdf\nzxcv\nqwer\nfourth'});
		vim.curDoc = doc;
		vim.exec('esc');
		vim.exec('gg');
		vim.exec('0');
		vim.exec('j');
		vim.exec('v');
		vim.exec('j');
	});

	describe('operators', function() {
		it('starts in visual', function() {
			expect(vim.modeName).equal('visual');
		});

		describe('y', function() {
			it('stores the selection in register 0', function() {
				vim.exec('y');
				expect(vim.register(0).toString()).equal('zxcv\nq');
			});
		});

		describe('d', function() {
			it('deletes the selection', function() {
				vim.exec('d');
				expect(vim.curDoc.text()).equal('asdf\nwer\nfourth');
			});
		});

		describe('c', function() {
			it('ends up in insert mode', function() {
				vim.exec('c');
				expect(vim.modeName).equal('insert');
			});
		});

		describe('>', function() {
			it('indents all the selected lines', function() {
				vim.exec('>');
			});
		});


		it('selects text correctly when moving backwards', function() {
			vim.exec('esc');
			vim.exec('$');
			vim.exec('v');
			vim.exec('0');
			var range = vim.curDoc.selection();
			expect(range[0].char).equal(0);
		});





	});
/*
	describe('x', function() {
		it('erases the word', function() {
			vim.exec('v');
			vim.exec('$');
			vim.exec('h');
			vim.exec('x');
			var line = vim.text().split('\n')[0];
			expect(line).equal('');
		});

		it('saves the deletion in register', function() {
			vim.exec('v');
			vim.exec('$');
			vim.exec('h');
			vim.exec('x');
			var line = vim.text().split('\n')[0];
			expect(vim.register(0)).equal('asdf aloha what');
		});

		it('selects text correctly when moving backwards', function() {
			vim.exec('$');
			vim.exec('v');
			vim.exec('0');
			var range = vim.curDoc.selection();
			expect(range[0].char).equal(0);
			var text = vim.curDoc.getRange(range);
			expect(text).equal('asdf aloha what');
		});

	});
*/

});
