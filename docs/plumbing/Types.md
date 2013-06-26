#Types used in vim

##location

A specific point in the text characterized by a line and char value:

```javascript
{
	line: {Number},
	char: {Number}
}
```

##range

Represents a range of text by supplying a start and end [location](#location):

```javascript
[start, end]
```

##mode

##commandObj

The argument passed to <code>vim.addCommand</code>

Takes the form:

```javascript
{
	mode: {String}
	match: {String} | {RegExp}
	fn: {Function}
}
```
