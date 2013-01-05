var defaultObj = {
    'default': {
        //esc
        'escape': function() {
            vim.set('mode','idle');
        }
    }
};
vim.extend(defaultObj);