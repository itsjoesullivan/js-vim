module.exports = {
	'/(.*)\n/': function(keys,vim,res) {
		console.log('what came in:',res);
		vim.searchBuffer = res[1];
		console.log(vim.searchBuffer);
		var lastMode = vim.lastMode || 'command';
		vim.mode(lastMode);
		vim.exec('n');
	}
};