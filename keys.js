/*

  Simple: listen to keystrokes, converting them to a logical set (read: strings representing the letter) and pass them to a fn

*/
module.exports = keys = function(fn) {

  document.addEventListener('keydown', function(e) {
	//console.log(e);
	switch(e.keyCode) {
		case 27:
			e.preventDefault();
			fn('esc');
			break;
		case 8:
			e.preventDefault();
			fn('backspace');	
			break;
		case 13: 
			e.preventDefault();
			fn('\n');
			break;
		case 9:
			e.preventDefault();
			fn('\t');
			break;
	}
  }); 

  document.addEventListener('keypress', function(e) {
		//console.log(e);
		var key = String.fromCharCode(e.keyCode);
			fn(key);
  	}); 

};
