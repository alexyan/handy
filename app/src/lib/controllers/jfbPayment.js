/**
 * jfbPayment.js
 * 集分宝支付
 */
define(function(require, exports, module) {
    "use strict";
    var $ = require('$'),
        Json = require('json');
    var Base = require('base');
    var JfbPayment = Base.extend({
        options:{
            onInit:function(){
                var that = this;
                
            }
        },
        initialize:function(options){
            var that = this;
            that.domContext = options.domContext;
            JfbPayment.superclass.initialize.apply(that,[ options ]);

            that.payment = that.getParent();
        }
    });
    module.exports = JfbPayment;
});

