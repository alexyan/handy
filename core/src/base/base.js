/* base.js */
define(function(require, exports, module) {
    "use strict";
    var Class = require('class');
    var Options = require('./options');
    var store = require('store');
    var Base = Class.create({
        Implements:[Options],
        options:{
            author:'想当当'
        },
        initialize:function(options){
            var that = this;
            that.__options__ = Object.clone(that.options);
            options = options || {};
            that.resetOptions().setOptions(options);
            //that.fireEvent('preInit');
            /*
            that.setOptions(options||{});
            that.removeEvents().addEvents(that.options.events || {});
            that.fireEvent('init');
            that.options.callback && 'function' == typeof(that.options.callback) && (function(){
                that.options.callback.apply(that,[options]);
            })();
            */
        }
    });
    module.exports = Base;
});