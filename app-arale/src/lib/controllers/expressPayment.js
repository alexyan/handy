/**
 * expressPayment.js
 * 快捷支付
 */
define(function(require, exports, module) {
    "use strict";
    var $ = require('$');
    var Base = require('handy-base');
    var ExpressPayment = Base.extend({
        attrs:{
            name:'快捷支付',
            key:'expressPayment',
            grade:1
        },
        init:function(){

        }
    });
    module.exports = ExpressPayment;
});

