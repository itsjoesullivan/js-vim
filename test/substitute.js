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
	it('Only does the one line', function() {
		vim.text('foo\nfoo');
		vim.exec(':s/foo/bar/g\n');
		vim.text().should.equal('bar\nfoo');
	});
	it('Works globally', function() {
		vim.text('foo fie foe foo');
		vim.exec(':s/foo/bar/g\n');
		vim.text().should.equal('bar fie foe bar');
	});
	it(':s works with %', function() {
		vim.text('foo\nfoo');
		vim.exec(':%s/foo/bar/g\n');
		vim.text().should.equal('bar\nbar');
	});
	it('Substitute works with %', function() {
		vim.text('foo\nfoo');
		vim.exec(':%s/foo/bar/g\n');
		vim.text().should.equal('bar\nbar');
	});
	it('Works with simple range', function() {
		vim.text('foo\nfoo\nfoo');
		vim.exec(':2s/foo/bar/g\n');
		vim.text().should.equal('foo\nbar\nfoo');
	});
	it('Works with $ range', function() {
		vim.text('foo\nfoo\nfoo');
		vim.exec(':$s/foo/bar/g\n');
		vim.text().should.equal('foo\nfoo\nbar');
	});
	it('Works with N,$ range', function() {
		vim.text('foo\nfoo\nfoo\nfoo');
		vim.exec(':2,$s/foo/bar/g\n');
		vim.text().should.equal('foo\nbar\nbar\nbar');
	});
});
