#Cursor

Each doc has at least one cursor. It represents... well, you know.

##API

###Cursor.line(lineNumber)

Get / set the cursor's line number.

__N.B.__ As everywhere else, line number is zero-indexed.

####Get
```javascript
var line = cursor.line();
console.log("The current line number is: " + line);
```
####Set
```javascript
cursor.line(10);
```
###Cursor.char(charNumber)

Get / set the cursor's character.

__N.B.__ This should be changed to "col"

__N.B.__ As everywhere else, line number is zero-indexed.

####Get

```javascript
var col = cursor.char();
console.log("The current column is: " + col);
```

####Set

```javascript
cursor.char(10);
```

###Cursor.col(colNumber)

Alias for cursor.char

###Cursor.position(pos)

Get / set the overall cursor position... syntactic sugar for setting line and char/col individually

####Returns:
```javascript
{
    line: {Number},
    char: {Number}
}
```

####Get

```javascript
var pos = cursor.position();
```

####Set
```javascript
var pos = {
    line: 2,
    char: 4
}
cursor.position(pos);
```
