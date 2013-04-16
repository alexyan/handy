/**
 * YltPayment.js
 * 盈利通支付
 */
define(function(require, exports, module) {
    "use strict";
    var $ = require('$'),
        Json = require('json');
    var Base = require('base');
    var YltPayment = Base.extend({
        options:{
            name:'盈利通支付'
        },
        init:function(){

        },    
        initialize:function(options,extra){
            var that = this;
            YltPayment.superclass.initialize.apply(that,[ options, extra ]);
        }
    });
    module.exports = YltPayment;
});

