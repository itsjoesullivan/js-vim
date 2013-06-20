
var Vim = require('../index'),
	vim = new Vim(),
	expect = require('chai').expect;

var view;

describe('view', function() {
	beforeEach(function() {
		vim = new Vim();
		view = vim.view;
	});
	it('exists', function() {
		expect('view' in vim).equal(true);
	});
	it('has on and trigger methods', function() {
		expect('on' in vim.view).equal(true);
		expect('trigger' in vim.view).equal(true);
	});
	it('has on and trigger methods', function() {
		expect('on' in vim.view).equal(true);
		expect('trigger' in vim.view).equal(true);
	});

	it('defaults to 24 lines, 80 columns', function() {
		expect(view.lines).equal(24);
		expect(view.cols).equal(80);
	});

	it('triggers change on vim.change', function() {
		var changed = false;
		vim.view.on('change', function() {
			changed = true;
		});
		vim.trigger('change');
		expect(changed).equal(true);
	});

	describe('status', function() {
		it('reads "-- INSERT --" if in insert mode', function() {
			vim.exec('i');
			expect(view.status).equal('-- INSERT --');
		});
		it('reads "" if in command mode with an empty buffer', function() {
			vim.exec('l');
			expect(view.status).equal('');
		});
		it('reads ":" if : pressed', function() {
			vim.exec(':');
			expect(view.status).equal(':');
		});
		it('reads "/" if : pressed', function() {
			vim.exec('/');
			expect(view.status).equal('/');
		});
		it('reads "?" if : pressed', function() {
			vim.exec('?');
			expect(view.status).equal('?');
		});
	});

	describe('renderText', function() {
		it('sets view.text', function() {
			vim.text('asdf');
			view.text = '';
			view.renderText();
			expect(view.text).equal('asdf');
		});
	});

	describe('getText', function() {
		it('returns a string', function() {
			var text = view.getText();
			expect(typeof text).equal('string');
		});
		it('includes status if there is one', function() {
			vim.exec('i');
			var text = view.getText();
			expect(text.indexOf('INSERT') !== 0).equal(true);
		});
		it('returns a string with view.lines lines', function() {
			vim.exec('i');
			var text = view.getText();
			console.log(text);
			expect(text.split('\n').length).equal(view.lines);
		});

	});


});
