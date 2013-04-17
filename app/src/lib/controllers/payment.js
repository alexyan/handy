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
                    instance:function(options,extra) {
                        return new CouponPayment(options,extra);
                    }
                },
	            jfbPaymentOptions:{//集分宝支付
                    instance:function(options,extra) {
                        return new JfbPayment(options,extra);
                    }
                },
	            balancePaymentOptions:{//余额付款
                    instance:function(options,extra) {
                        return new BalancePayment(options,extra);
                    }
                },
	            yltPaymentOptions:{//盈利通付款
                    instance:function(options,extra){
                        return new YltPayment(options,extra);
                    }
                },
	            expressPaymentOptions:{//快捷支付含其他付款方式(网银、话费卡)、添加新卡等
                    instance:function(options,extra) {
                        return new ExpressPayment(options,extra);
                    }
                }
            },
            onPaymentChanged:function(triggerPayment){
                var that = this;
                setTimeout(function(){
                    var payment = that.getPayment();
                    //console.log(payment,'payment');
                    var restPayments = that.getRestPayments(payment,triggerPayment);
                    //var lowestPaymentGrade = that.getLowestPaymentGrade(payment);
                    restPayments.each(function(restPayment){
                        if(_.$H(payment).has(restPayment)){
                            that.payments[restPayment].fireEvent('check');
                            //return false;
                        }else{
                            setTimeout(function(){
                                var lowestPaymentGrade = that.getLowestPaymentGrade(payment);
                                if(that.payments[restPayment]['options']['grade'] < lowestPaymentGrade){
                                    if(that.isPaymentFullAmount()){
                                        that.payments[restPayment].fireEvent('notAvailable');
                                    }else{
                                        that.payments[restPayment].fireEvent('available');
                                    }                         
                                }
                            },0);
                        }
                    });
                },0);
            },
            onInit:function(){
                var that = this;
                //console.log(that.options);
                //console.log(that.$root.PageVar);
                //orderId
                that.orderId = that.$root.PageVar.orderId;
                //console.log(that.orderId);
                that.totalAmount = that.$root.PageVar.pay_amount;

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
                            that.payments[dataConf.model] = that.options.paymentsOptions[dataConf.model+'Options']['instance'].apply(that,[paymentOptions,{$root:that.$root,$parent:that}]);
                        })();
                    })();
                });
                //实例中不存在的支付方式删除
                $.each(that.options.paymentsOptions,function(key,paymentOption){
                    if(!_.$H(that.payments).getKeys().contains(key.replace('Options','')))delete that.options.paymentsOptions[key];
                });

                $.each(that.payments,function(key,payment){
                    payment.init && (function(){
                        payment.init();
                    })();
                });

            },
            onPreInit:function(){
            }        
    	},
        setPayment:function(payment,triggerPayment){
            var that = this;
            that.payment = payment;
            that.paymentHistory.push(that.payment);
            if( that.paymentHistory.length > that.options.paymentHistoryLimit){
                that.paymentHistory.shift();
            }
            that.fireEvent('paymentChanged',triggerPayment);
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
        isPaymentFullAmount:function(payment){//检查是否足额支付
            var that = this;
            var payment = payment || that.getPayment();
            if(parseInt(_.$H(payment).getValues().sum(),10) >= parseInt(that.totalAmount,10)){
                return true;
            }else{
                return false;
            }
        },
        getUpperGradePayments:function(payment){
            var that = this;
            var keys = _.$H(payment).getKeys();
            var grades = [];
            keys.each(function(key){
                grades.push(that.payments[key].options.grade);
            });
            var minGrade = grades.min();
            var maxGrade = grades.max();
            var upperGradePayments = [];
            _.$H(that.payments).each(function(payment,key){
                if(payment.options.grade >= minGrade && payment.options.grade<=maxGrade ){
                    upperGradePayments.push(key);
                }
            });
            return upperGradePayments; 
        },
        getRestPayments:function(payment,triggerPayment){
            var that = this;
            var keys = _.$H(payment).getKeys();
            var grades = [];
            keys.each(function(key){
                grades.push(that.payments[key].options.grade);
            });
            var triggerPaymentGrade = triggerPayment.options.grade;
            var restPayments = [];
            _.$H(that.payments).each(function(payment,key){
                if(payment.options.grade < triggerPaymentGrade ){
                    restPayments.push(key);
                }
            });
            return restPayments;
        },
        getLowestPaymentGrade:function(payment){
            var that = this;
            var keys = _.$H(payment).getKeys();
            var grades = [];
            keys.each(function(key){
                grades.push(that.payments[key].options.grade);
            });
            return grades.min();
        },
        initialize:function(options,extra){
            var that = this;
            Payment.superclass.initialize.apply(that,[ options, extra ]);
        }
    });
    module.exports = Payment;
});
