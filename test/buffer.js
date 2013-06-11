describe('buffers', function() {

	var doc;
	beforeEach(function() {
		doc = vim.new({text: 'hello\nis it me\nyou\'re looking for?'});
		vim.curDoc = doc;
	});

	describe('vim.buffer', function() {
		it('exists', function() {
			expect('buffer' in vim);
		});

		it('returns an empty string for an empty buffer', function() {
			expect(vim.buffer(1)).equal('');
		});

		it('returns the buffer for a nonempty buffer', function() {
			vim.exec('yy');
			expect(vim.buffer(1)).equal('hello\n');
		});

		it('sets a buffer if given two args', function() {
			vim.buffer(1,'yo');
			expect(vim.buffer(1)).equal('yo');
		});

		it('sequential yanks shift the numerical buffers') //todo
	});

	/*describe('yy', function() {
		it('places the current line into the first buffer', function() {
			vim.exec('yy');
			expect(vim.buffer(1)).equal('hello\n');
		});
	});

	describe('"ayy', function() {
		it('places the first line into the "a" buffer', function() {
			vim.exec('"ayy');
			expect(vim.buffer('a')).equal('hello\n');
		});
	});

	describe('"ap', function() {
		it('puts the contents of buffer "a" after the cursor', function() {
			vim.buffer('a','aloha');
			vim.exec('"ap');
			var text = vim.text();
			var line = text.substring(0,text.indexOf('\n'));
			expect(line).equal('halohaello');
		});
	});*/

});