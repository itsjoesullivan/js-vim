module.exports = function(vim) {
	var stdin = process.stdin,
		sys = require('sys'),
		exec = require('child_process').exec;

	stdin.setRawMode(true);
	stdin.resume();
	stdin.setEncoding('utf8');

	var size = [100,100];
	exec('tput lines', function(err,stdout) {
		size[1] = parseInt(stdout);
	})
	exec('tput cols', function(err,stdout) {
		size[0] = parseInt(stdout);
	})

var CSI = function(arg) {
	process.stdout.write('\u001B[' + arg);
}

stdin.on( 'data', function( key ){

  // ctrl-c ( end of text )
  if ( key === '\u0003' ) {
    process.exit();
  }
console.log(key);

  // write the key to stdout all normal like
  switch(key) {
    case '`':
      vim.exec('esc');
      break;
    default:
      vim.exec(key);
      break;
  }
}) 

vim.on('change',render);

var _text = '';
function render() {
	var text = vim.text();
console.log(text.split('\n').length);
	
	_text = text;
//	console.log(text);
}


};

