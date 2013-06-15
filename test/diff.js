var vim = require('../index');
var expect = require('chai').expect;

describe('dmp', function() {
	it('exists', function() {
		expect('dmp' in vim).equal(true);
	});

	it('has diff_main', function() {
		var text1 = 'asdf';
		var text2 = 'asd';
		var diff = vim.dmp.diff_main(text1,text2);
		expect(diff[1][1]).equal('f');


	});

});
