var Vim = require('../index'),
	vim;

describe('substitute', function() {
	beforeEach(function() {
		vim = new Vim();
	});	
	it('substitutes one word at beginning of sentence', function() {
		vim.text('foo');
		vim.exec(':substitute/foo/bar\n');
		vim.text().should.equal('bar');
	});
	it('substitutes one word not at beginning of sentence', function() {
		vim.text(' foo');
		vim.exec(':substitute/foo/bar\n');
		vim.text().should.equal(' bar');
	});
	it('does not encroach into other words or characters', function() {
		vim.text(' foo ');
		vim.exec(':substitute/foo/bar\n');
		vim.text().should.equal(' bar ');
	});
	it('works with :s', function() {
		vim.text('foo');
		vim.exec(':s/foo/bar\n');
		vim.text().should.equal('bar');
	});
	it('Works locally', function() {
		vim.text('foo foo');
		vim.exec(':s/foo/bar\n');
		vim.text().should.equal('bar foo');
	});
	it('Handles extra slash', function() {
		vim.text('foo');
		vim.exec(':s/foo/bar/\n');
		vim.text().should.equal('bar');
	});
	it('Handles no match', function() {
		vim.text('fie');
		vim.exec(':s/foo/bar/\n');
		vim.text().should.equal('fie');
	});

	it('Works globally', function() {
		vim.text('foo fie foe foo');
		vim.exec(':s/foo/bar/g\n');
		vim.text().should.equal('bar fie foe bar');
	});


});
