/* util.js */
define(function(require, exports, module) {
    var Class = require('class');
    require('../reset/reset');
    var Util = Class.create({ 
        initialize:function(){
            var that = this;
            that.$type = function(object){
                var type = typeOf(object);
                if (type == 'elements') return 'array';
                return (type == 'null') ? false : type;
            };
        }
    });
    module.exports = new Util;
});