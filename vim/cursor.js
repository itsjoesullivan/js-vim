var Cursor = Backbone.Model.extend({
    line:0,
    char:0,
    position: {
        line:0,
        char:0
    },
    initialize: function() {
        this.set('view',new CursorV({model:this}));
        this.on('change:line', function(m,v,o) {
            this.position.line = this.line = v;
            this.get('view').render();
        },this);
        this.on('change:char', function(m,v,o) {
            this.position.char = this.char = v;
            this.get('view').render();
        },this);
        
    }
});

var CursorV = Backbone.View.extend({
    el: json2html({'pre.cursor':' '}),
    render: function() {
        console.log('render');
        var position = this.model.position;
        if(position.line < 0) {
            this.model.set('line',0);
            return this.render();
        }
        if(position.char < 0) {
            this.model.set('char',0);
            return this.render();
        }
        //move the cursor to the position that you're in by inserting it after the previous character on that line.
        if(!vim.get('doc').get('lines').length) {
            vim.set('mode','idle');
            return;
        }
        var line = doc.get('lines').at(position.line);
        
        if(line.get('chars').length < position.char) {
            this.model.set('char',line.get('chars').length);
        }
        if(position.char === 0 && !line.get('chars').length) { //add to the line's el if it is empty
            $(line.get('view').el).append(this.el);
        } else { //otherwise find the last char and 
            $(line.get('chars').at(position.char === 0 ? 0 : position.char-1).get('el')).after(this.el);
        }
      
        //we fuck up the character we're on top of to keep the cursor relatively positioned. So, if we did, put it back.
        if(this.fixThisOne) {
            this.fixThisOne.style.display = 'inline';
        }
        
        //check if we're on top of a character. grab its value and display that, then hide it under fixThisOne, and switch the cursor colors.
        var onTopOf = doc.get('lines').at(position.line).get('chars').at(position.char);
        if(onTopOf) {
            this.el.style.color = '#eee';
            this.el.innerHTML = onTopOf.get('val');
            this.fixThisOne = onTopOf.get('el');
            this.fixThisOne.style.display = 'none';
        } else {
            this.el.style.color = '#eee';
            this.el.innerHTML = ' ';
        }
        this.el.scrollIntoViewIfNeeded();
    }
});