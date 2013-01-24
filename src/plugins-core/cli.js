var cliObject = {
    'cli': {
        'w': function() {
            doc.save();
        },
        'o': function() {
            vim.exec('q');
            var doc = new Doc();
            vim.open(doc);
        },
        'q': function() {
            vim.quit();
        }
    }
};

vim.extend(cliObject);