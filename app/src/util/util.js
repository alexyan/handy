/* util.js */
define(function(require, exports, module) {
    var Class = require('class');
    var Util = Class.create({ 
        fixed:function(n, type){
            //默认保留两位小数
            //((0.58+0.00000001)*100 | 0) / 100
            var n = Math.round(n * 100) / 100;
            type == 'str' ? n = (n).toFixed(2) : null;
            return n;
        },
        initialize:function(){
            var that = this;
            console.log('app util');
        }
    });
    module.exports = new Util;
});