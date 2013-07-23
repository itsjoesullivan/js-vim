
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
			vim.view.color = false;
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
			expect(text.split('\n').length).equal(view.lines);
		});
		it('Runs a gutter with 7 characters by default', function() {
			vim.exec('i');
			vim.view.color = false
			vim.exec('asdf');
			var text = view.getText();
			var line = text.split('\n')[0]
			expect(line).equal('    1 asdf ')
		});
	});
	describe('getArray', function() {
		it('returns an array of view.lines length', function() {
			var text = view.getArray();
			expect(text.length).equal(view.lines);
		});
	});
	describe('visibleLines', function() {
/*		it('returns a range of line # visible', function() {
			vim = new Vim();
			vim.view.lines = 3;
			var ct = 0;
			while(ct++ < 100) { vim.exec('i'); vim.exec('asdf'); vim.exec('esc'); vim.exec('j'); } 
		});
*/
	});

	describe('diffLine', function() {
		it('returns an empty array if identical', function() {
			var diffs = view.diffLine('asdf','asdf');
			expect(diffs.length).equal(0);
		});

		it('returns an array with length > 0 if not', function() {
			var diffs = view.diffLine('asdf','asdf ');
			expect(diffs.length).equal(1);
		});
		it('an individual diff has contents that equal what the new characters should be', function() {
			var diffs = view.diffLine('asdf',' sdf');
			expect(diffs[0].content).equal(' ');
		});
		it('There can be multiple diffs within one line', function() {
			var diffs = view.diffLine('asdf',' s f');
			expect(diffs.length).equal(2)
		});
	});



});
