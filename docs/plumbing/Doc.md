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

###doc.find(expression, [ options ])

```javascript
doc.find(/hello/g);
```

- _expression_ is a __global__ RegExp with a __capture__ group
- Optional _options_ is a json object as described below
- Returns the position of a match, if there is one

####Options

Options are passed as a json object like:

```javascript
{
	[ backwards: {Bool}, ] // Perform the search backwards
	[ inclusive: {Bool}, ] // Include the cursor position in the search
	[ wholeLine: {Bool}, ] // Search the entire line, disregarding the cursor position
	[ offset: {Bool} ]     // Specify precisely where to begin the search; override above options.
}
```

###doc.text([range])

Return the text of the document. Optional range value determines boundaries.

###doc.getRange(range)

Return the text value of a [range](Types.md#range)





