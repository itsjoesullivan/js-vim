var Char = Backbone.Model.extend({
        initialize: function() {
            if(this.get('val')) {
                this.set('el',json2html({
                    'pre.char':this.get('val')
                }));
            }
            this.on('destroy', function(me) {
                $(me.get('el')).detach();
            })
        },
        render: function() {
            if(!this.get('el')) {
                this.initialize();
            }
            return this.get('el');
        },
        delete: function() {
            $(this.get('el')).detach();
            this.destroy();
        }
    });
    
var Chars = Backbone.Collection.extend({model:Char})