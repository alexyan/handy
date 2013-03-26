/* handy.js */
define(function(require, exports, module) {
    "use strict";
    var Util = require('./util/util');
    require('./reset/reset');
    var Class = require('class');
    var Handy = Class.create({
        Implements:[ Util ],
        init:function(callback){
            var that = this;
            "function" == that.typeOf(callback) && callback.call(that);
            return that;
        },
        initialize:function(options){
            var that = this;
            window && (function(){
                window.$U = Util;//global Util
            })();

            return that;
        }
    });
    module.exports = Handy;
});