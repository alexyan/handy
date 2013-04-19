/**
 * expressPayment.js
 * 快捷支付
 */
define(function(require, exports, module) {
    "use strict";
    var $ = require('$'),
        Json = require('json');
    var BasePayment = require('./basePayment');
    var ExpressPayment = BasePayment.extend({
        options:{
            name:'快捷支付',
            key:'expressPayment',
            grade:1,
            onAvailable:function(params){
                var that = this;
                $(that.element).prop("disabled", false);
                $('#savedCardList').prop("disabled",false);
                $('#savedCardList').closest('div.ui-select').removeClass('ui-select-disabled');
                $(that.element).closest('div.ui-checkbox').removeClass('ui-checkbox-disabled');
            },
            onNotAvailable:function(params){
                var that = this;
                $(that.element).prop("disabled", true);
                $('#savedCardList').prop("disabled",true);
                $('#savedCardList').closest('div.ui-select').addClass('ui-select-disabled');
                $(that.element).closest('div.ui-checkbox').addClass('ui-checkbox-disabled');
            },
            onUse:function(params){
                var that = this;
                that.fireEvent('used',params);
            },
            onNotUse:function(params){
                var that = this;
                that.fireEvent('notUsed',params);
            },
            onUsed:function(params){
                var that = this;
                that.used = true;
                $(that.element).prop('checked',true);
                $(that.element).closest('div.ui-checkbox').addClass('ui-checkbox-checked');
            },
            onNotUsed:function(params){
                var that = this;
                that.used = false;
                $(that.element).prop('checked',false);
                $(that.element).closest('div.ui-checkbox').removeClass('ui-checkbox-checked');
            },
            onChange:function(params){
                var that = this;
                that.fireEvent('use',params);
            },
            onReset:function(params){
                var that = this;
                var payment = that.payment.getPayment(),
                tempPayment = Object.clone(payment);

                _.$H(tempPayment).each(function(item,key){
                    if(that.payment.payments[key]['options']['grade'] <= that.options.grade){
                        delete tempPayment[key]; 
                    }
                });

                if(!that.payment.isPaymentFullAmount(tempPayment)){
                    that.fireEvent('available',[params]);
                }else{
                    that.fireEvent('notAvailable',[params]);
                }                
            },
            onCheck:function(params){
                var that = this;
                that.fireEvent('reset',[params]);

                if(that.available){
                    
                    if($(that.element).prop('checked')){
                        that.fireEvent('change',[params]);
                    }else{
                        that.fireEvent('notUse',[params]);
                    }
                }
            }
        },
        init:function(){
            var that = this;
            that.payment = that.$parent;

            /**
             * 完整事件流
             * 1、用户触发点击(click)事件 -> 2、dom对象发起checkuse事件[checkuse事件可能未必由点击事件触发,因此拆分] ->
             * 3、that对象触发check事件 -> 4、如果使用则触发下拉框change事件,不使用 则触发unuse转到7结束 ->
             * 5、使用的情况下触发下拉框的change事件 -> 6、得到选项后触发use事件 -> 
             * 7、use/unuse事件处理完毕, 主动触发情况下, 由pay对象向其它几种方式发起check
             * 
             * 当本支付方式处于选中状态,用户操作下拉框 则事件流从4开始
             * 当本支付方式因其它方式的改变被动发起则从3开始
             */

            /**
             * 参数说明:
             * 1、active:用户主动行为,比如点击;初始化时也设置为主动触发.
             * 主动行为可以处理完毕后通知pay对象向其它方式发起check事件
             * 2、silent: 静默执行, 比如初始化是需要主动触发,但是静默操作设置为true,
             * 那么可以屏蔽一些ui上的行为
             */            

            
            
            $(that.element).bind('checkuse',function(e,params){
                that.fireEvent('check',params);
            }).bind('click',function(){
                $(that.element).trigger('checkuse',[{active:true,silent:false}]);
            }).trigger('checkuse',[{active:true,silent:true,init:true}]);
            $(that.element).closest('div.ui-checkbox').find('span.ui-icon').bind('click',function(){
                $(that.element).trigger('click');
            });


            $('#savedCardList').bind('change',function(e,params){
                if(!params)params = { active : true };
                $('[name="payType"]').val('pay');
                var option = $(this).find('option:nth-child('+($(this).get(0).options.selectedIndex+1)+')');
                params.option = option;
                $(that.element).prop('disabled',false);
                that.fireEvent('change',params);
            })/*.closest('.ui-select').find('.ui-select-text').html(selectedOptionTxt)*/;




        },
        initialize:function(options,extra){
            var that = this;
            ExpressPayment.superclass.initialize.apply(that,[ options, extra ]);
        }
    });
    module.exports = ExpressPayment;
});

