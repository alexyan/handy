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

        },
        initialize:function(domContext,options){
            var that = this;
            that.domContext = domContext;
            JfbPayment.superclass.initialize.apply(that,[ options ]);
        }
    });
    module.exports = JfbPayment;
});

