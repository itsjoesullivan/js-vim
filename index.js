
var markdown = require('markdown').markdown;
var markup = document.getElementById('content-src').innerHTML;
var content = document.getElementById('content');
var src = document.getElementById('content-src');
var text = markdown.toHTML(markup);
document.getElementById('content').innerHTML = text;
