var idleObj = {
    'idle': {
        'a': function() {
            //var curChars = vim.get('doc').get('lines').at(cursor.line).get('chars');
		var curChars = doc.get('lines').at(cursor.line).get('chars');
//            if(curChars.length > cursor.char) {
                var curVal = vim.get('doc').get('lines').at(cursor.line).get('chars').at(cursor.char).get('val');
                vim.exec(['x','i',curVal]);
 //           } else {
  //              vim.exec('i');
   //         }
            
        },
        'i': function() {
            vim.set('mode','insert');
        },
        'h': function() {
            if(cursor.char) {
                cursor.set('char',cursor.char-1)
            } else if(cursor.line) {
                vim.exec(['k','$']);
            }
        },
        'j': function() {
            var line = cursor.line;
            if(vim.get('doc').get('lines').length-1 > line) {
                cursor.set('line',line+1);
            }
        },
        'k': function() {
            var line = cursor.line;
            if(line) {
                cursor.set('line',line-1)
            }
        },
        'l': function() {
            console.log('l');
            var thisLine = vim.get('doc').get('lines').at(cursor.line);
            if(thisLine.get('chars').length - 1 > cursor.char) {
                cursor.set('char',cursor.char+1);
            } else if(thisLine.length - 1 > cursor.line) {
                vim.exec(['j','0']);
            }
        },
        '^0': function() {
            cursor.set('char',0);
        },
        '\\$': function() {
            cursor.set('char',vim.get('doc').at({line:cursor.line}).get('chars').length);
        },
        'x': function() {
            var curChar = vim.get('doc').at(cursor.position)
            if(curChar) {
                curChar.delete();
            }
            cursor.get('view').render();
        },
        'p': function() {
            vim.exec('o');
            clipboard.paste();
            vim.exec('escape');
        },
        'P': function() {
            vim.exec('O');
            clipboard.paste();
            vim.exec('escape');
        },
        'o': function() {
            vim.exec(['i','escape','$','i','\r']);
        },
        'O': function() {
            vim.exec(['0','i','\r','escape','k','i']);
        },
        'dd': function() {
            var line = doc.at({line:cursor.line});
            clipboard.copy(line.toText());
            line.delete();
	    cursor.set('line',cursor.line-1);
        },
	'yank': function() {
		var selection = vim.get('selection');
		var text = '';
		var curLine = false; 
		_(selection).each(function(char) {
			text += char.get('val');
			if(char.collection.indexOf(char) === char.collection.length-1) {
				text += '\n';
			}
		});
		if(text.substring(text.length-1) === '\n') {
			text = text.substring(0,text.length-1);
		}
		clipboard.copy(text);
	},
        '([0-9])+(y)': function(val) {
		console.log('here');
		vim.exec(['0','v','j','$','y']);
	},
        '([0-9])+([hjkl])': function(val) {
           var key = val[2];
           var times = val[1];
           while(times--) {
               vim.exec(key);
           }
        },
        //'[0-9]+[yd]{2}':
        'yy': function() {
            var selection = vim.get('doc').get('lines').at(cursor.line).toText();
            clipboard.copy(selection);
        }
    },
    'on': {
        'idle': function() {
            vim.notify('');
        }
    }
}

vim.extend(idleObj);
