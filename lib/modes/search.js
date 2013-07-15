module.exports = {
	'/(.*)\n/': function(keys, vim, res) {
		vim.searchBuffer = res[1];
		var lastMode = vim.lastMode || 'command';
		vim.mode(lastMode);
		vim.exec('n');
	}
};
