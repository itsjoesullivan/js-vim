//Test to ensure that learn vim progressively is an effective tutorial for this implementation:
//http://yannesposito.com/Scratch/en/blog/Learn-Vim-Progressively/

var Vim = require('../index');
var vim = new Vim();

var expect = function(assertion) {

	return {
		equal: function(obj) {
			if(assertion == obj) return true;
			throw "expected " + assertion + " to equal " + obj;
		}
	}
};

describe('survive', function(){

	beforeEach(function() {
		var doc = new vim.Doc();
		vim.curDoc = doc;
	})

	it('i enters insert mode', function() {
			vim.exec('i');
			expect(vim.modeName).equal('insert');
	});

	it('x deletes current character', function() {
		vim.new();
		vim.exec('esc');
		vim.exec('i');
		vim.exec('h');
		var text = vim.curDoc.text();
		expect(vim.curDoc.text().indexOf('h')).equal(0);
		vim.exec('esc');
		vim.exec('x');
		//expect(vim.curDoc.text().indexOf('h')).equal(-1);
	});

	//wq

	it('dd delete and copy current line', function() {
		vim.new();
		vim.exec('esc');
		vim.exec('i');
		vim.exec('hello');
		vim.exec('\n');
		vim.exec('there');
		vim.exec('esc');
		vim.exec('dd');
		expect(vim.text()).equal('hello');
	});
});


describe('vi"', function() {
	it('changes the selection to what is inside the nearest two quotation marks', function() {
		vim.new();
		vim.exec('i');
		vim.exec('well "hello" there');
		vim.exec('esc');
		vim.exec('?ello\n');
		vim.curDoc.cursor.char(10);
		vim.exec('v');
		vim.exec('i');
		vim.exec('"');
		var range = vim.curDoc.getRange(vim.curDoc.selection());
		expect(range).equal('hello');
	})
});
