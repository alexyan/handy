/**
 * couponPayment.js
 * 红包支付
 */
define(function(require, exports, module) {
    "use strict";
    var $ = require('$'),
        Json = require('json');
    var Base = require('base');
    var CouponPayment = Base.extend({
        options:{

        },
        initialize:function(domContext,options){
            var that = this;
            that.domContext = domContext;
            CouponPayment.superclass.initialize.apply(that,[ options ]);
        }
    });
    module.exports = CouponPayment;
});