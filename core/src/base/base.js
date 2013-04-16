/* base.js */
define(function(require, exports, module) {
    "use strict";
    require('../reset/reset');
    //var $ = require('$');
    var Class = require('./class');



    var Options = require('./options');
    var Events = require('./events');

    var Base = Class.create({
        Implements:[Options, Events],
        options:{
            author:'想当当'
        },
        initialize:function(options,extra){
            var that = this;    
            that.__options = Object.clone(that.options);
            options = options || {};
            that.resetOptions().setOptions(options);

            that.fireEvent.apply(that,['preInit']);
            that.fireEvent.apply(that,['init']);
            that.options.callback && 'function' == typeof(that.options.callback) && (function(){
                that.options.callback.apply(that,[options]);
            })();
        }
    });
    module.exports = Base;
});