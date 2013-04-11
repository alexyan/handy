/* util.js */
define(function(require, exports, module) {
    var Class = require('class');
    var Util = Class.create({ 
        initialize:function(){
            var that = this;
            console.log('app util');
        }
    });
    module.exports = new Util;
});