vim.exec('escape');

describe('insert', function() {
    it('inserts text', function() {
        vim.exec(['i','a']);
        expect(vim.get('doc').toText() === 'a');
        vim.exec('delete');)
    }
});