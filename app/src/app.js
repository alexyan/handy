/* App.js */
define(function(require, exports, module) {
    "use strict";
    var $ = require('$');
    var AppBase = require('app');
    //业务类
    var OrderDetail = require('orderDetail');
    var ShortCut = require('shortcut');
    var Payment = require('./lib/controllers/payment');
    var SecurityProd = require('securityProd');
    require('select').init();
    var App = AppBase.extend({
        options:{
            onPreInit:function(){
            },
            onInit:function(){
                var that = this;
                //console.log(that.options);
                //console.log('initialize....');
                /* 订单详情 */
                that.orderDetail = new OrderDetail(that.options.orderDetailOptions || {}, that);
                /* 组合支付 */
                that.payment = new Payment(that.options.paymentOptions||{});
                /* securityProd */
                that.securityProd = new SecurityProd({
                    element:"#paymentForm"
                });                
            }
        },
        initialize:function(options){
            var that = this;
            App.superclass.initialize.apply(that, [ options ]);
            console.log(that,'app');
        }
    });
    module.exports = App;
    
});