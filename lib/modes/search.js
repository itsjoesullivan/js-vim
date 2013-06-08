module.exports = {
	'/(.*)\n/': function(keys,vim,res) {
		vim.searchBuffer = res[1];
		vim.exec('esc');
		vim.exec('n');
	}
};