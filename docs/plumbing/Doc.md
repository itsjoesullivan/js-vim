#Doc

Text documents, generally referred to as "buffers"

##API

###Instanciation

```javascript
var doc = new Vim.Doc();
```

###Methods

####doc.text



####doc.getRange(range)

Return the text value of a [range](Types.md#range)


####doc.insert(text)

Inserts text at cursor

####doc.remove(range)

Removes a given range of text


####doc.find(expression, options)

Returns the position of a match, if there is one.

expression must (1) be global, i.e. /(hello)/g and (2) include a capture... otherwise we don't know what we're looking for.


