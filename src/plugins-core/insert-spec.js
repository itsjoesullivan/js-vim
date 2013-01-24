vim.exec('escape');

describe('insert', function() {
    it('inserts text', function() {
        vim.exec(['i','a']);
        expect(vim.get('doc').toText() === 'a');
        vim.exec('delete');)
    }
    describe('backspace', function() {
	it('erases a character when there\'s one directly behind it', function() {
		vim.exec('escape');
		vim.exec(['i','a']);
		var char = vim.get('doc').get('lines').at(cursor.line).get('char').at(cursor.char-1);
		console.log(char);
	});
    });

});
