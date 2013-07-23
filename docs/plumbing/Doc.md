#Doc

Text documents, generally referred to as "buffers"

```javascript
var doc = new Vim.Doc();
```

##Methods

###doc.insert(text)

Inserts text at cursor:
```javascript
doc.insert('asdf');
```
###doc.remove(range)

Removes a given range of text:

```javascript
doc.remove([
	{
		line: 0,
		col: 0
	},
	{
		line: 1,
		col: 3
	}
]);
```

###doc.find(expression, options)

Returns the position of a match, if there is one:
```javascript
doc.find(/hello/g);
```

####Options

Options are passed as a json object like:

```javascript
{
	[ backwards: {Bool}, ] // Perform the search backwards
	[ inclusive: {Bool}, ] // Include the cursor position in the search
	[ wholeLine: {Bool}, ] // Search the entire line, disregarding the cursor position
	[ offset: {Bool} ]     // Specify precisely where to begin the search; override above options.
}
expression must (1) be global, i.e. /(hello)/g and (2) include a capture... otherwise we don't know what we're looking for.

N.B. The internals for reverse searching are a bit yucky. Possibly there is an elegant solution, but the upshot presently is that you are better off including as much as you're searching for within the first captured group of your regular expression.

###doc.text([range])

Return the text of the document. Optional range value determines boundaries.

###doc.getRange(range)

Return the text value of a [range](Types.md#range)





