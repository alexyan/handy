/**
 * balancePayment.js
 * 余额支付
 */
define(function(require, exports, module) {
    "use strict";
    var $ = require('$'),
        Json = require('json');
    var Base = require('base');
    var BalancePayment = Base.extend({
        options:{

        },
        initialize:function(domContext,options){
            var that = this;
            that.domContext = domContext;
            BalancePayment.superclass.initialize.apply(that,[ options ]);
        }
    });
    module.exports = BalancePayment;
});

