#Vim(for Chrome)

Vim
for Chrome is a project to bring the vim editor to Google Chrome as an app.

##Commands

The crucial bit, at least with respect to central functionality, is how commands are executed and defined.

To move to insert mode:

  vim.exec('i');

To type hello:

	vim.exec(['h', 'e', 'l', 'l', 'o']);

Obviously, this provides a simple way to route keystrokes into the application.But it also facilitates creating new commands:

Capital "O"
might be defined like:

	vim.exec(['k', 'o']);


##Extensibility

The actual extension API is like:

	vim.extend({
		'insert': { //name of mode you are extending
			'O': function() {
				vim.exec(['k', 'o']);
			}
		},
		on: { //event-based actions
			'insert': function() { //event fired by vim on switch to insert
				vim.notify('-- INSERT --');
			}
		}
	});

A little more dry:

###Extension object:

	extensionObject = {
		{
			mode: {
			 	{
				'command': function(value) {
					//run when that command is called in that mode
				},
			...
		},
		on: {
			'eventName': function(subject) { ... };
			...
		}
	};

- __mode__ is a string, but can be any mode. 
- __command__ is a string, BUT will be executed as a regular expression if a literal match is not found. The command function is given the command value in any case.

###What about syntax + highlighting ?

Maybe the question is: how does this structure allow for syntax formatting and highlighting ?

I __think__ that the answer is pretty straightforward : create a listener for the "stroke" event(doesn 't exist), which will get passed the actual line that changed. Check the line for your keywords, then when you find them draw out the __element__ associated with each character and add a class ('function ') if the keyword is 'function ' for later handling by a stylesheet. That seems about as easy/efficient as it _could_ be, though obviously that would then be exposed in a more friendly way.

##Status

Just revisiting this (spring 2013) since starting it last winter. Need to evaluate whether (1) the architecture will actually scale to the needs of vim (hunch: yes) and (2) need to find a better solution for rendering. The backbone paradigm, I think, breaks down with this. We end up with a trillion 'models' for characters when fundamentally we're just trying to map a string of text to the screen with some extra meta information. So that needs some thought, and a rewrite based on those conclusions.
