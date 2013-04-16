/**
 * couponPayment.js
 * 红包支付
 */
define(function(require, exports, module) {
    "use strict";
    var $ = require('$'),
        Json = require('json');
    var BasePayment = require('./basePayment');
    //var Base = require('base');
    var CouponPayment = BasePayment.extend({
        options:{
            name:'红包支付',
            grade:5,

            onAvailable:function(params){
                var that = this;
                that.available = true;
                $(that.element).prop("disabled", false);
                $(that.element).closest('div.ui-checkbox').removeClass('ui-checkbox-disabled');
            },
            onNotAvailable:function(params){
                var that = this;
                that.available = false;
                $(that.element).prop("disabled", true);
                $(that.element).closest('div.ui-checkbox').addClass('ui-checkbox-disabled');
            },            
            onUse:function(params){
                var that = this;
                var payment = that.payment.getPayment();

                var payAmount = 0;
                if(that.options.availableAmount >= that.payment.options.payAmount ){
                    payAmount = that.payment.options.payAmount;
                }else{
                    payAmount = that.options.availableAmount;
                }
                payment.couponPayment = payAmount;
                that.payment.setPayment.apply(that.payment,[payment,that]);

                that.fireEvent('used',[params]);
            },
            onNotUse:function(params){
                var that = this;

                var payment = that.payment.getPayment();
                delete payment.couponPayment;
                //that.payment.setPayment(payment,that);
                that.payment.setPayment.apply(that.payment,[payment,that]);
                that.fireEvent('notUsed',[params]);
            },
            onUsed:function(params){
                var that = this;
                that.used = true;
                $(that.element).prop('checked',true);
                $(that.element).closest('div.ui-checkbox').addClass('ui-checkbox-checked');
                var payment = that.payment.getPayment();
                var showTxtUse = that.options.dataConf.showTxt.use.substitute({
                    payAmount:payment.couponPayment
                });
                $(that.element).closest('label').find('span').html(showTxtUse);




            },
            onNotUsed:function(params){
                var that = this;
                that.used = false;
                $(that.element).prop('checked',false);
                $(that.element).closest('div.ui-checkbox').removeClass('ui-checkbox-checked');
                $(that.element).closest('label').find('span').text(that.options.dataConf.showTxt.unuse);
            },
            onReset:function(params){
                var that = this;
                if(that.options.availableAmount){
                    that.fireEvent('available',[params]);
                }else{
                    that.fireEvent('notAvailable',[params]);
                }
            },
            onCheck:function(params){
                var that = this;
                that.fireEvent('reset',[params]);
                console.log(that.payment,'that.payment','onCheck');
                if(that.available){
                    if($(that.element).prop('checked')){
                        that.fireEvent('use',[params]);
                    }else{
                        that.fireEvent('notUse',[params]);
                    }
                }
            },
            onInit:function(){
                var that = this;
            }
        },
        init:function(){
            var that = this;
            that.payment = that.$parent;

            /**
             * 参数说明:
             * 1、active:用户主动行为,比如点击;初始化时也设置为主动触发.
             * 主动行为可以处理完毕后通知pay对象向其它方式发起check事件
             * 2、silent: 静默执行, 比如初始化是需要主动触发,但是静默操作设置为true,
             * 那么可以屏蔽一些ui上的行为
             * 3、init: 标示初始化行为
             */
            $(that.element).bind('checkuse',function(e,params){
                that.fireEvent('check',[params]);//主动模式
            }).bind('click',function(){
                $(this).trigger('checkuse',[{active:true,silent:false}]);
            }).trigger('checkuse',[{active:true,silent:true,init:true}]);

            $(that.element).closest('div.ui-checkbox').find('span.ui-icon').bind('click',function(){
                $(that.element).trigger('click');
            });
        },     
        initialize:function(options,extra){
            var that = this;
            CouponPayment.superclass.initialize.apply(that,[ options, extra ]);
        }
    });
    module.exports = CouponPayment;
});