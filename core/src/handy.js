/* handy.js */
define(function(require, exports, module) {
    "use strict";
    var Util = require('./util/util');
    var Class = require('class');
    var Handy = Class.create({
        Implements:[ Util ],
        app:function(app,options,callback){
            var that = this;
            seajs.use(app,function(App){
                options.context = that;
                that.app = new App(options);
                "function" == that.$type(callback) && callback.call(that);
            });
        },
        initialize:function(options){
            var that = this;
            window && (function(){
                window._ = Util;//global Util
            })();
            return that;
        }
    });
    module.exports = new Handy;
});