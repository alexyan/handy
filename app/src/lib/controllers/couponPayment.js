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
            onInit:function(){
                var that = this;
            }
        },
        initialize:function(options){
            var that = this;
            that.domContext = options.domContext;
            CouponPayment.superclass.initialize.apply(that,[ options ]);

            that.payment = that.getParent();
            console.log(that.payment,'that.payment');
        }
    });
    module.exports = CouponPayment;
});