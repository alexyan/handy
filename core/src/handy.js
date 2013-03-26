/* handy.js */
define(function(require, exports, module) {
    "use strict";
    var Util = require('./util/util');
    require('./reset/reset');
    var Class = require('class');
    var Handy = Class.create({
        Implements:[ Util ],
        use:function(app,options,callback){
            var that = this;
            seajs.use(app,function(App){
                options.context = that;
                that.app = new App(options);
                "function" == that.typeOf(callback) && callback.call(that);
            });
        },
        initialize:function(options){
            var that = this;
            window && (function(){
                window.$U = Util;//global Util
            })();

            return that;
        }
    });
    module.exports = new Handy();
});