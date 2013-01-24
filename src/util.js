var log = function() {
    console.log(arguments[0]);
};

var clipboard = {
    _val: false,
    copy: function(text) {
        this._val = text;
    },
    paste: function() {
        if(this._val) {
            vim.exec(this._val.split(''));
        }
    }
    
}