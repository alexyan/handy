/* App.js */
define(function (require, exports, module) {
  "use strict";
  var $ = require('$');
  var HandyBase = require('handy-base');
  //业务类
  //  var OrderDetail = require('orderDetail');
  //  var ShortCut = require('shortcut');
  var SecurityProd = require('./external/securityProd');
  var Payment = require('./lib/controllers/payment');

  require('select').init();

  var App = HandyBase.extend({
    setup: function () {
      /* 组合支付 */
      new Payment(this.get('paymentOptions'), this);
      new SecurityProd({ element: "#paymentForm" }, this);
    }
  });
  return App;
});