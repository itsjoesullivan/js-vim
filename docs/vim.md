#Vim

```javascript
var vim = new Vim();
```

###exec(command)

Execute a command, from the general perspective of: "This is a key that was typed"

```javascript
//Enter insert mode
vim.exec('i');

//Insert 'hello'
vim.exec('hello');
```

###addMode(modeName, mode)

Apply a new mode defined as an object of key-value pairs in which the key takes the form:

	'/{RegExp}/'

And the value is a function executed with <code>bind.(vim)</code>, so that <code>this</code> is always a reference to vim.

//The arguments passed to the functions are a little muddled right now.

####Example

```javascript
vim.addMode('insert', {
	'/(.*)/': function(keys) {
		vim.curDoc.insert(keys);	
	}
});
```

###addCommand(commandObj)

Add a specific command, defined as a [commandObj](https://github.com/itsjoesullivan/js-vim/blob/master/docs/plumbing/Types.md#commandobj)

```javascript
vim.addCommand({
	mode: 'insert',
	match: /(.*)/,
	fn: function(keys) {
		vim.curDoc.insert(keys);	
	}
});
```
