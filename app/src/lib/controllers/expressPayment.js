/**
 * expressPayment.js
 * 快捷支付
 */
define(function(require, exports, module) {
    "use strict";
    var $ = require('$'),
        Json = require('json');
    var Base = require('base');
    var ExpressPayment = Base.extend({
        options:{
            onInit:function(){
                var that = this;
                
            }
        },
        initialize:function(domContext,options){
            var that = this;
            that.domContext = domContext;
            ExpressPayment.superclass.initialize.apply(that,[ options ]);

            that.payment = that.getParent();

        }
    });
    module.exports = ExpressPayment;
});

