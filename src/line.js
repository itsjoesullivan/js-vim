var Line = Backbone.Model.extend({
    defaults: {
        val: ''
    },
    initialize: function() {
        this.set('chars',new Chars());
        this.get('chars').on('add', function(e) { this.trigger('change',e); }, this);
        if(this.get('chars').length === 0 && this.get('val').length > 0) {
            var val = this.get('val');
            val = val.split('');
            for(var i in val) {
                this.get('chars').add({val:val[i]});
            }
        }
        this.get('chars').on('add', function() {
            console.log('add');
            var map = {
                'function': '#d7af5f'
            }
            var text = this.toText();
            for(var i in map) {
                var index = text.indexOf(i);
                if(index > -1) {
                    _(this.get('chars').rest(index)).first(i.length).forEach(function(char) {
                        //console.log(i,char.el);
                        $(char.get('el')).addClass(i);
                    });
                }
            }
        },this);
        this.get('chars').on('remove', function() {
            console.log('remove');
            var map = {
                'function': '#d7af5f'
            }
            for(var i in map) {
                $(this.get('view').el).find('pre').removeClass(i)
            }
        },this);
    }, 
    toText: function() {
        var chars = this.get('chars');
        var text = '';
        chars.forEach(function(char) {
            text += char.get('val');
        });
        return text;
    },
    delete: function() {
        this.destroy();
    }
});

var LineV = Backbone.View.extend({
    initialize: function() {
        this.el = json2html({'p':[{'pre.gutter':''}/*{'pre.char':' '}*/]});   
        this.model.set('view',this);
        this.model.on('change',function() {
           this.render(); 
        },this);
        this.model.on('destroy', function(model) {
            $(this.el).detach();
            this.remove();
        },this);
    },
    render: function() {
        var gutter = ' ' + (doc.get('lines').indexOf(this.model)+1) + ' ';
        while(gutter.length < 4) {
            gutter = ' ' + gutter;
        }
        
        $(this.el).find('.gutter').html(gutter);
        this.model.get('chars').forEach(function(char){
            this.el.appendChild(char.render());
        },this);
        return this.el;
    }
});

var LineC = Backbone.Collection.extend({
    model:Line
});