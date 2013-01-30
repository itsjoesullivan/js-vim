var jade = require('jade');
var fs = require('fs');


var template = fs.readFileSync(__dirname + '/src/template.jade','binary');
var fn = jade.compile(template,{
    pretty: true
});

var categories = {
    "Movement by character": require(__dirname + '/src/movement_character'),
    "Movement by text": require(__dirname + '/src/movement_text'),
    "Movement by lines": require(__dirname + '/src/movement_lines')
}



var html = fn({categories:categories});


console.log(html);


fs.writeFileSync('index.html',html,'binary');