var strokes = [];

var exec;
window.record = function() {

	strokes = [];

	var startTime = new Date().getTime();

	vim.on('exec',function(command) {
		console.log(command,arguments);
		strokes.push({
			at: new Date().getTime() - startTime,
			keys: '' + command
		});

	});

};
window.stopRecord = function() {
	console.log(strokes);
};

var timeouts = [];
window.play = function() {

	console.log(strokes);

	while(strokes.length) {
		var stroke = strokes.shift();
		var keys = '' + stroke.keys;
		var timeout = setTimeout(vim.exec.bind(vim),stroke.at,keys);
		timeouts.push(timeout);
	}

	strokes = [];

};

window.stopPlay = function() {

	while(timeouts) {
		clearTimeout(timeouts.pop());
	}

};