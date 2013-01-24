var Vim = Backbone.Model.extend({
    initialize: function() {
        this.set({
            cursor: new Cursor(),
            mode: 'idle',
            command: new Command()
        });
        $(document).keypress(function(e) {
            e.preventDefault();
            var key = String.fromCharCode(e.keyCode);
            vim.exec(key,e.keyCode);
        });
        $(document).keydown(function(e) {
            var key = String.fromCharCode(e.keyCode);
            var handle = {
                27: 'escape',
                8: 'backspace',
		9: '\t'
            };
            if(e.keyCode in handle) {
                e.preventDefault();
                vim.exec(handle[e.keyCode]);
            }
        });
        window.cursor = this.get('cursor');
        window.command = this.get('command');
    },
    open: function(doc) {
        if(this.get('doc')) {
            this.get('doc').destroy();
        }
        if(!doc) {
            doc = new Doc();
        }
        this.set('doc',doc);
        window.doc = doc;
        this.set('mode','idle');
        cursor.set({
            line:0,
            char:0
        });
	console.log('to here');
    },
    //lets add all commands via this
    extend: (function() {
	    return function(commandObj) {
        /* commandObj like
            {
	   	'idle': {  in idle mode
	       		'i': function() {  //declare a command on "i"
		       		vim.set('mode','insert'); //that sets the mode to insert!
			}
		},
	   	'on': {
	       		//various events to listen for
			'insert': {
		       	//we're in insert mode!!!
			}
		},
                'modeName': {
                    'commandPattern': function() {
                    
                    }
                }
            }
        
        */
    

        var modeCommandMap = this.get('command').get('modeCommandMap');
       //for each mode 
        for(var mode in commandObj) {
		//that isn't "on", which is special (don't make an "on" mode plz")
		if(mode === 'on') {
			continue;
		}
	
            var commands = commandObj[mode];
            if(! (mode in modeCommandMap) ) {
                modeCommandMap[mode] = {};
            }
	    //for each keystroke pattern
            for(var pattern in commands) {
		    //add that pattern to that mode in the global command map
                modeCommandMap[mode][pattern] = commands[pattern];
            }
        }
	//for on, 
	if('on' in commandObj) {
		_(commandObj.on).each(function(event,mode) {
			console.log(event,mode);
			vim.on('change:mode', function(m,v,o) {
				if(mode === v) {
					event();
				}
			});
		})
	}
    }
    }()),
    exec: function(commandArg,keyCodeArg) {
        /* commandArg like
            ['esc','i','hello','esc'] --> like typing hello, I guess
        */
        console.log(arguments);
        if(typeof commandArg === 'string') {
            commandArg = [commandArg];
        }
        if(typeof keyCodeArg === 'string') {
            keyCodeArg = [keyCodeArg];
        }
        var command;
        while(command = commandArg.shift()) {
            this.get('command').exec(command,keyCodeArg);
        }
    },
	commandEl: $('.command'),
	notify: function(text) {
		this.commandEl.html(text);
	}  
});


var vim = new Vim();


var test = function() {
        var style = { 
            link: {
                rel: "stylesheet",
                type: 'text/css',
                href: 'lib/mocha.css'
                
            }
        }; 
        mocha.setup({
            'ui':'bdd',
            'globals':['*'],
		"slow":5 
        });
        
        $(".doc").hide();
        $(".command").hide();
        $('title').html("vim - test");
        $("link").first().detach();
            
        $("body").append(json2html(style));  
        require([
        'http://joesul.li/van/vim/lib/chai.js',
            'vim/plugins-core/idle-spec.js' + '?' + Math.random()
            ], function(chai,idle) {
            window.expect = chai.expect;
            idle();
            mocha.run();
        })
}
if(document.location.href.indexOf('runTest') > -1) {
    test();
}
