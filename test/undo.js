describe('doc.undo', function() {
	var expect = require('chai').expect;
	var vim = require('../index');
	var doc = vim.curDoc;

	beforeEach(function() {
		vim.new();
		doc = vim.curDoc;
	});

	it('exists', function() {
		expect('undo' in doc).equal(true);
	});

	it('turns back to last change when called with no args', function() {
		vim.exec('i');
		vim.exec('asdf');
		vim.exec('esc');
		var text = vim.text();
		console.log(text);
		vim.exec('a');
		vim.exec('yo');
		vim.exec('esc');
		var text2 = vim.text();
		doc.undo.apply(vim);
		var curText = vim.text();
		expect(curText).equal('asdf');
	});
	it('u command works', function() {
		vim.exec('i');
		vim.exec('asdf');
		vim.exec('esc');
		var text = vim.text();
		vim.exec('a');
		vim.exec('yo');
		vim.exec('esc');
		var text2 = vim.text();
		vim.exec('u');
		var curText = vim.text();
		expect(curText).equal('asdf');
	});



})
