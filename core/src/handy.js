/* handy.js */
define(function(require, exports, module) {
    "use strict";
    var Base = require('./base/base');
    var Util = require('./util/util');
    //require('./reset/viewport');
    var Class = require('class');
    var Handy = Base.extend({
        Implements:[ Util ],
        app:function(app,options,callback){
            var that = this;
            seajs.use(app,function(App){
                options.context = that;
                that.app = new App(options);
                "function" == that.$type(that.setup) && that.setup.call(that);
                "function" == that.$type(callback) && callback.call(that);
            });
        },
        setup:function(){
            var that = this;

            console.log(that.options,"that.options");
        
            //console.log(that.app,'that.app');
            /*
            var appId = that.app.__module.id;
            seajs.use(seajs.pluginSDK.config.base + '/' + appId + '/util/util',function(){
                "function" == that.$type(callback) && callback.call(that);
            });
            console.log('setup');
            */
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
    module.exports = new Handy;
});