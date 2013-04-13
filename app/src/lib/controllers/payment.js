/**
 * payment.js
 * 用于组织wapCashier支付相关业务
 */
define(function(require, exports, module) {
    "use strict";
    var $ = require('$');
    var Base = require('base');
    var Json = require('json');
    var CouponPayment = require('./couponPayment');
    var JfbPayment = require('./jfbPayment');
    var BalancePayment = require('./balancePayment');
    var YltPayment = require('./yltPayment');
    var ExpressPayment = require('./expressPayment');
    var Payment = Base.extend({
    	options:{
            paymentsOptions:{
                couponPaymentOptions:{//红包支付
                    name:'红包支付',
                    constructor:function(options) {
                        return new CouponPayment(options);
                    }
                },
	            jfbPaymentOptions:{//集分宝支付
                    name:'集分宝支付',
                    constructor:function(options) {
                        return new JfbPayment(options);
                    }
                },
	            balancePaymentOptions:{//余额付款
                    name:'余额支付',
                    constructor:function(options) {
                        return new BalancePayment(options);
                    }
                },
	            yltPaymentOptions:{//盈利通付款
                    name:'盈利通支付',
                    constructor:function(options){
                        return new YltPayment(options);
                    }
                },
	            expressPaymentOptions:{//快捷支付含其他付款方式(网银、话费卡)、添加新卡等
                    name:'快捷支付',
                    constructor:function(options) {
                        return new ExpressPayment(options);
                    }
                }
            },
            onInit:function(){
                var that = this;
                that.payments = {};
                $.each($('input.payment'),function(index,item){
                    var dataConf = $(item).data('conf').replace(/\'/g,'"');
                    dataConf = Json.parse(dataConf);
                    !!dataConf.model && (function(){
                        that.options.paymentsOptions[dataConf.model + 'Options'] 
                        && 'object' == _.$type(that.options.paymentsOptions[dataConf.model + 'Options'])
                        && (function(){
                            var paymentOptions = that.options.paymentsOptions[dataConf.model + 'Options'] || {};
                            paymentOptions = that.$root.$merge({},paymentOptions,{$root:that.$root,$parent:that,domContext:item});
                            that.payments[dataConf.model] = that.options.paymentsOptions[dataConf.model+'Options']['constructor'].apply(that,[paymentOptions]);
                        })();
                    })();
                });
            },
            onPreInit:function(){
            }
    	},
        setPayment:function(){
            console.log('setPayment');
        },
        initialize:function(options){
            var that = this;
            Payment.superclass.initialize.apply(that,[ options ]);
            return that;
        }
    });
    module.exports = Payment;
});
