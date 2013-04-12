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

        },
        initialize:function(domContext,options){
            var that = this;
            that.domContext = domContext;
            YltPayment.superclass.initialize.apply(that,[ options ]);
        }
    });
    module.exports = YltPayment;
});

