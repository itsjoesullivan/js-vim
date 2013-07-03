module.exports = function(Vim) {

Vim.addCommand({
	mode: 'command',
	match: /:s(\/.*\n)/,
	fn: function(keys,vim,expr) {
		vim.exec(keys.replace(/^:s/,':substitute'));
	}
});
Vim.addCommand({
	mode: 'command',
	match: /:substitute\/([^\/]*)\/([^\/]*)\n/,
	fn: function(keys,vim,expr) {
		vim.exec(keys.replace(/\n/,'/\n'));
	}
});

Vim.addCommand({
	mode: 'command',
	match: /:substitute\/(.*)\/(.*)\/([gci]*)\n/,
	fn: function(res,vim,expr) {
		var pos = this.curDoc.cursor.position();
		var flags = (expr[3] || '').split('');
		val = this.curDoc.find(new RegExp('(' + expr[1] + ')','g'), {wholeLine: true});
		while(val.found) {
			this.curDoc.cursor.char(val.char);
			this.curDoc.cursor.line(val.line);
			vim.exec('v');
			for(var i = 1; i < expr[1].length; i++) {
				vim.exec('l');
			}
			vim.exec('c');
			vim.exec(expr[2]);
			vim.exec('esc');

			//If not global, stop after first.
			if(flags.indexOf('g') === -1) break;
			val = this.curDoc.find(new RegExp('(' + expr[1] + ')','g'), {wholeLine: true});
		}
		this.curDoc.cursor.char(pos.char);
		this.curDoc.cursor.line(pos.line);
	}
});

}
