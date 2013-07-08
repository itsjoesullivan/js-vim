var Vim = require('../index'),
    vim;

describe('macro', function() {
    beforeEach(function() {
        vim = new Vim();
    });
    describe('q', function() {
        it('records the keystrokes into the register', function() {
            vim.text('asdf');
            vim.exec('qa');
            vim.exec('dw');
            vim.exec('q');
            vim.register('a')[0].should.equal('dw');
        });
    });

    describe('@', function() {
        it('plays back the recorded keystrokes', function() {
            vim.text('asdf');
            vim.exec('qa');
            vim.exec('dw');
            vim.exec('q');
            vim.text('asdf');
            vim.exec('@a');
            vim.text().should.equal('');
        });
        describe('@@', function() {
            vim = new Vim();
            vim.text('asdf');
            vim.exec('qa');
            vim.exec('dw');
            vim.exec('q');
            vim.text('asdf');
            vim.exec('@a');
            vim.text('asdf');
            vim.exec('@@');
            vim.text().should.equal('');
        });
    });

});
