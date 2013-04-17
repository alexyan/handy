/**
 * basePayment.js
 */
define(function(require, exports, module) {
    "use strict";
    var $ = require('$'),
        Json = require('json');
    var Base = require('base');
    var BasePayment = Base.extend({
        options:{
        },      
        initialize:function(options,extra){
            var that = this;
            that.element = options.element;
            BasePayment.superclass.initialize.apply(that,[ options, extra ]);
        }
    });
    module.exports = BasePayment;
});

