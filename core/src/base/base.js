/* base.js */
define(function(require, exports, module) {
    "use strict";
    require('../reset/reset');

    var $ = require('$');
    var Class = require('class');
    var Options = require('./options');
    var Events = require('./events');

    var Base = Class.create({
        Implements:[Options, Events],
        options:{
            author:'想当当'          
        },
        getParent:function(){
            return this.$parent;
        },
        getRoot:function(){
            return this.$root;
        },
        initialize:function(options){
            var that = this;         
            that.__options__ = Object.clone(that.options);
            options = options || {};

            options.$root && (function(){
                $.each(options,function(key,opt){
                    if(key.lastIndexOf("Options") > -1){
                        opt.$root = options.$root;
                        opt.$parent = that;
                    }
                });
            })();

            that.removeEvents().resetOptions().setOptions(options||{});

            that.options.$root && (function(){
                that.$root = that.options.$root;
                delete that.options.$root;
            })();
             that.options.$parent && (function(){
                that.$parent = that.options.$parent;
                delete that.options.$parent;
            })();           


            that.fireEvent.apply(that,['preInit']);
            that.fireEvent.apply(that,['init']);
            that.options.callback && 'function' == typeof(that.options.callback) && (function(){
                that.options.callback.apply(that,[options]);
            })();
        }
    });
    module.exports = Base;
});