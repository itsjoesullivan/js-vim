module.exports = {

	'/(.*)/': function(keys,vim) {
		vim.insert(keys);
	}

};