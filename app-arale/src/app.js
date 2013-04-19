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
      /* securityProd */
      //      this.securityProd = new SecurityProd({
      //        element: "#paymentForm"
      //      });

    }
  });
  //  var App = Base.extend({
  //    options: {
  //      onPreInit: function () {
  //      },
  //      onInit: function () {
  //        var that = this;
  //        //console.log(that.options);
  //        //console.log('initialize....');
  //        /* 订单详情 */
  //        //that.orderDetail = new OrderDetail(that.options.orderDetailOptions || {}, that);
  //        /* 组合支付 */
  //        that.payment = new Payment(that.options.paymentOptions || {}, {$root: that.$root, $parent: that});
  //        /* securityProd */
  //        that.securityProd = new SecurityProd({
  //          element: "#paymentForm"
  //        }, {$root: that.$root, $parent: that});
  //      }
  //    },
  //    initialize: function (options, extra) {
  //      var that = this;
  //      App.superclass.initialize.apply(that, [ options, extra ]);
  //    }
  //  });
  return App;
});