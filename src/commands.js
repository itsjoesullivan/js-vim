var Command = Backbone.Model.extend({
	defaults: {
		queue: [],
		modeCommandMap: {}
	},
	exec: function(command, keyCode) {
		var map = this.get('modeCommandMap'),
			mode = vim.get('mode'),
			queue = this.get('queue');
		if (queue.length) {
			command = queue.join('') + command;
		}
		if (!(mode in map)) {
			throw 'No map for this mode';
		}
		if (command in map.
		default) {
			this.set('queue', []);
			return map.
			default [command](command, keyCode);
		}
		var modeCommands = map[mode];
		if (command in modeCommands) {
			this.set('queue', []);
			return map[mode][command](command, keyCode);
		} else {
			//go treat them as a regexp
			for (var i in modeCommands) {
				if (new RegExp(i).exec(command)) {
					this.set('queue', []);
					return modeCommands[i](command, keyCode);
				}
			}
			//now check keycode
			if (keyCode in modeCommands) {
				this.set('queue', []);
				return modeCommands[keyCode](command, keyCode);
			}
			//ok, nothing stuck. so let's push it into the queue
			this.set('queue', command.split(''));
		}

	}
});
