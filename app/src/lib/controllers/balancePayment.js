/**
 * balancePayment.js
 * 余额支付
 */
define(function(require, exports, module) {
    "use strict";
    var $ = require('$'),
        Json = require('json');
    var BasePayment = require('./basePayment');
    var BalancePayment = BasePayment.extend({
        options:{
            name:'余额支付',
            grade:3

        },
        init:function(){
        },
        initialize:function(options,extra){
            var that = this;
            BalancePayment.superclass.initialize.apply(that,[ options, extra ]);
        }
    });
    module.exports = BalancePayment;
});

