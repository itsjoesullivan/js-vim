var Doc = Backbone.Model.extend({
	initialize: function(attrs) {
		this.set('lines', new LineC());
		var view = new DocV({
			model: this
		});
		this.set('view', view);
		if (typeof attrs === 'object') {
			if ('text' in attrs) {
				this.setLines(attrs.text);
			}
		}
		if (vim.get('mode') === 'insert' && !this.get('lines').length) {
			var line = new Line();
			this.get('lines').add(line);
			line.get('view').render();
		}
		vim.on('change:mode', function(m, mode, options) {
			switch (mode) {
				case 'insert':
					if (!this.get('lines').length) {
						this.get('lines').add({
							val: ''
						});
					}
					break;
				default:
					break;
			}
		}, this);
	},
	at: function(position) {
		if (typeof position === 'number') {
			return this.get('lines').at(position);
		}
		var line = cursor.line,
			char = -1;
		if (typeof position === 'object') {
			if (position.length === 2) {
				line = position[0];
				char = position[1];
			}
			if ('line' in position) {
				line = position.line;
			}
			if ('char' in position) {
				char = position.char;
			}
		}
		line = this.get('lines').at(line)
		return char === -1 ? line : line.get('chars').at(char);
	},
	newLine: function() {
		var curLine = this.get('lines').at(cursor.line),
			curChars = curLine.get('chars'),
			curText = curLine.toText(),
			remainder = curText.substring(cursor.char);
		curChars.rest(cursor.char).forEach(function(char) {
			char.delete();
		});
		this.get('lines').add(new Line({
			val: remainder
		}), {
			at: cursor.line + 1
		});
		this.get('lines').rest(cursor.line + 1).forEach(function(line) {
			line.get('view').render();
		});
		vim.exec(['escape', 'j', '0', 'i']);


		/*vim.get('cursor').set({
            'char':0,
            'line':vim.get('cursor').line+1
        });*/

	},
	add: function(key, keyCode) {
		switch (keyCode) {
			/*case 13: // '\r'
                this.newLine();
                break;*/
			default: switch (key) {

				case '\r':
					this.newLine();
					break;
				default:
					this.get('lines').at(vim.get('cursor').line).get('chars').add({
						val: key
					}, {
						at: cursor.char
					});
					vim.get('cursor').set('char', cursor.char + 1);
					break;
			}
			break;

		}
	},
	setLines: function(text) {
		var lines = text.split('\n');
		_(lines).forEach(function(line) {
			this.get('lines').add({
				val: line
			});
		}, this);
	},
	toText: function() {
		var lines = [];
		this.get('lines').forEach(function(line) {
			lines.push(line.toText());
		});
		return lines.join('\n');
	},
	readFile: function() {
		log('readFile');
		vim.set('doc', this);
		if (!this.get('file') && !this.get('appFile')) {
			throw 'No file';
		}
		var that = this;
		if (this.get('appFile')) {
			var appFile = this.get('appFile');
			appFile.file(function(file) {
				var reader = new FileReader();
				reader.onload = function(e) {
					log('reader.onload');
					that.set('text', e.target.result);
					that.setLines(that.get('text'));
					vim.open(that);
				};
				reader.onerror = function(e) {
					throw e;
				};
				log('reader.readAsText');
				reader.readAsText(file);
			}, function(e) {
				throw e;
			});
		}

		var reader = new FileReader();
		reader.onload = function() {
			log('reader.onload');
			that.set('text', reader.result);
			that.setLines(that.get('text'));
			vim.open(that);
		};
		log('reader.readAsText');
		reader.readAsText(this.get('file'));
	},
	save: function() {
		log('doc.save');
		if (this.get('file') || this.get('appFile')) {
			this.saveFile();
		}
	},
	saveFile: function() {
		if (!this.get('file') && !this.get('appFile')) {
			throw "No file";
		}
		var that = this;
		if (this.get('file')) {
			var file = this.get('file');
			file.createWriter(function(writer) {
				writer.onwriteend = function(e) {
					that.trigger('saved');
				};
				writer.onerror = function(e) {
					throw e;
				}
				writer.write(new Blob[that.toText()], {
					type: 'text/plain'
				});
			}, function(e) {
				console.log(e);
			});
		} else if (this.get('appFile')) {
			var file = this.get('appFile');
			file.createWriter(function(writer) {
				log('file.createWriter');
				writer.onerror = function(e) {
					log('writer.onerror');
					throw e;
				};
				var blob = new Blob([that.toText()], {
					type: 'text/plain'
				});
				writer.truncate(blob.size);

				//truncating is a write
				writer.onwriteend = function() {
					log('writer.truncate');

					//then you actually write
					writer.write(blob);
					writer.onwriteend = function() {
						log('writer.writeend');
						that.trigger('ready');
					}
				}

			}, function(e) {
				throw e;
			});
		}

	}
});


var DocV = Backbone.View.extend({
	render: function() {
		this.model.get('lines').forEach(function(line) {
			var lineV = new LineV({
				model: line
			});
			line.set('view', lineV);
			$(this.el).append(lineV.render());
		}, this);
	},
	el: $(".doc"),
	initialize: function() {
		$(this.el).empty();
		this.model.get('lines').on('add', function(line, col, options) {
			var lineV = new LineV({
				model: line
			});
			line.set('view', lineV);

			if (options && options.at) {
				$(doc.get('lines').at(options.at - 1).get('view').el).after(lineV.el);
			} else {
				$(this.el).append(lineV.el);
			}
			lineV.render();
		}, this);
		this.render();
	}
});
