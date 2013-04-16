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
            paymentHistoryLimit:3,
            paymentsOptions:{
                couponPaymentOptions:{//红包支付
                    constructor:function(options,extra) {
                        return new CouponPayment(options,extra);
                    }
                },
	            jfbPaymentOptions:{//集分宝支付
                    constructor:function(options,extra) {
                        return new JfbPayment(options,extra);
                    }
                },
	            balancePaymentOptions:{//余额付款
                    constructor:function(options,extra) {
                        return new BalancePayment(options,extra);
                    }
                },
	            yltPaymentOptions:{//盈利通付款
                    constructor:function(options,extra){
                        return new YltPayment(options,extra);
                    }
                },
	            expressPaymentOptions:{//快捷支付含其他付款方式(网银、话费卡)、添加新卡等
                    constructor:function(options,extra) {
                        return new ExpressPayment(options,extra);
                    }
                }
            },
            onPaymentChanged:function(){
                var that = this;
                var payment = that.getPayment();
                console.log(payment,'paymentChanged');
            },
            onInit:function(){
                var that = this;
                //console.log(that.options);
                //console.log(that.$root.PageVar);
                //orderId
                that.orderId = that.$root.PageVar.orderId;
                //console.log(that.orderId);

                //支付方式,用数组,记录历史操作记录,可用于回退操作
                that.paymentHistory = [{}],
                //当前的支付方式
                that.payment = that.paymentHistory.getLast();
                //console.log(that.payment,'that.payment');

                //payments对象,存放当前交易所支持的支付方式
                that.payments = {};
                $.each($('input.payment'),function(index,item){
                    var dataConf = $(item).data('conf').replace(/\'/g,'"');
                    dataConf = Json.parse(dataConf);
                    !!dataConf.model && (function(){
                        that.options.paymentsOptions[dataConf.model + 'Options'] 
                        && 'object' == _.$type(that.options.paymentsOptions[dataConf.model + 'Options'])
                        && (function(){
                            var paymentOptions = that.options.paymentsOptions[dataConf.model + 'Options'] || {};
                            paymentOptions = Object.merge({},paymentOptions,{element:item,dataConf:dataConf});
                            that.payments[dataConf.model] = that.options.paymentsOptions[dataConf.model+'Options']['constructor'].apply(that,[paymentOptions,{$root:that.$root,$parent:that}]);
                        })();
                    })();
                });
                //实例中不存在的支付方式删除
                $.each(that.options.paymentsOptions,function(key,paymentOption){
                    if(!_.$H(that.payments).getKeys().contains(key.replace('Options','')))delete that.options.paymentsOptions[key];
                });
                //
                $.each(that.payments,function(key,payment){
                    payment.init && (function(){

                        payment.init();
                    })();
                });
            },
            onPreInit:function(){
            }        
    	},
        setPayment:function(payment,trigger){
            var that = this;
            that.payment = payment;
            that.paymentHistory.push(that.payment);
            if(that.paymentHistory.length>that.options.paymentHistoryLimit)delete that.paymentHistory[0];
            that.fireEvent('paymentChanged');
            return that;
        },
        getPayment:function(){
            var that = this;
            return that.payment || {};
        },
        getPaymentAmount:function(payment){
            var that = this;
            console.log(_.$H(payment).getValues());
        },
        getPaymentHistory:function(){
            var that = this;
            return that.paymentHistory || [];
        },
        isPaymentFullAmount:function(){

        },
        initialize:function(options,extra){
            var that = this;
            Payment.superclass.initialize.apply(that,[ options, extra ]);
        }
    });
    module.exports = Payment;
});
