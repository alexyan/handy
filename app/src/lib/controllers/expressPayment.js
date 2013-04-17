/**
 * expressPayment.js
 * 快捷支付
 */
define(function(require, exports, module) {
    "use strict";
    var $ = require('$'),
        Json = require('json');
    var Base = require('base');
    var ExpressPayment = Base.extend({
        options:{
            name:'快捷支付',
            key:'expressPayment',
            grade:1
        },
        init:function(){

        },
        initialize:function(options,extra){
            var that = this;
            ExpressPayment.superclass.initialize.apply(that,[ options, extra ]);
        }
    });
    module.exports = ExpressPayment;
});

