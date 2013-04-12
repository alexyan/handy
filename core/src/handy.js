/* handy.js */
define(function(require, exports, module) {
    "use strict";
    var $ = require('$');
    var Base = require('./base/base');
    var Util = require('./util/util');
    var Handy = Base.extend({
        Implements:[ Util ],
        app:function(appId,options,callback){
            var that = this;

            require.async([appId],function(App){
                options.context = that;
                that.app = new App(options);
                "function" == that.$type(that.setup) && that.setup.call(that);
                "function" == that.$type(callback) && callback.call(that);
            });

        },
        setup:function(){
            var that = this;
            AP && AP.PageVar && (function(){
                that.PageVar = _.$merge({},AP.PageVar,AP._PageVar_||{},AP.__PageVar__||{});
            })();
            return that;
        },
        initialize:function(options){
            var that = this;
            Handy.superclass.initialize.apply(that, [ options ]);
            window && (function(){
                window._ = Util;//global Util
            })();
            return that;
        }
    });
    var handy = new Handy();
    module.exports = handy;
});