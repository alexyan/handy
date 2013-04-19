/**
 * payment.js
 * 用于组织wapCashier支付相关业务
 */
define(function (require, exports, module) {
  "use strict";
  var $ = require('$');
  var HandyBase = require('handy-base');

  require('handy-util');
  var JSON = require('json');
  var Object = window.Object;
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  var CouponPayment = require('./couponPayment');
  var JfbPayment = require('./jfbPayment');
  var BalancePayment = require('./balancePayment');
  var YltPayment = require('./yltPayment');
  var ExpressPayment = require('./expressPayment');

  function sumObject(object) {
    var total = 0;
    for (var key in object) {
      if (hasOwnProperty.call(object, key)) {
        var value = object[key];
        if ($.type(value) == 'number') {
          total += value;
        }
      }
    }
    return total;
  }

  function getMin(arr) {
    return Math.min.apply({}, arr);
  }

  function getMax(arr) {
    return Math.max.apply({}, arr);
  }

  var Payment = HandyBase.extend({
    attrs: {
      paymentHistoryLimit: 3
    },
    couponPaymentCreate: function (options, parent) {
      return new CouponPayment(options, parent);
    },
    jfbPaymentCreate: function (options, parent) {
      return new JfbPayment(options, parent);
    },
    balancePaymentCreate: function (options, parent) {
      return new BalancePayment(options, parent);
    },
    yltPaymentCreate: function (options, parent) {
      return new YltPayment(options, parent);
    },
    expressPaymentCreate: function (options, parent) {
      return new ExpressPayment(options, parent);
    },
    setup: function () {
      var that = this;
      //console.log(that.options);
      //console.log(that.$root.PageVar);
      //orderId
      that.orderId = that.root.PageVar.orderId;
      //console.log(that.orderId);
      that.totalAmount = that.root.PageVar.pay_amount;

      //支付方式,用数组,记录历史操作记录,可用于回退操作
      that.paymentHistory = [
        {}
      ];
      //当前的支付方式
      that.payment = that.paymentHistory[that.paymentHistory.length - 1];
      //console.log(that.payment,'that.payment');

      //payments对象,存放当前交易所支持的支付方式
      that.payments = {};

      $.each($('input.payment'), function (index, item) {
        var dataConf = JSON.parse($(item).data('conf').replace(/\'/g, '"'));
        var modelOptions = that.get(dataConf.model + 'Options');
        !!dataConf.model && (function () {
          modelOptions && 'object' == $.type(modelOptions)
          && (function () {
            var paymentOptions = modelOptions || {};
            $.extend(paymentOptions, {element: item, dataConf: dataConf});

            that.payments[dataConf.model] = that[dataConf.model + 'Create'](paymentOptions, that);
          })();
        })();
      });
      //      //实例中不存在的支付方式删除
      //      $.each(that.options.paymentsOptions, function (key, paymentOption) {
      //        if (!_.$H(that.payments).getKeys().contains(key.replace('Options', '')))delete that.options.paymentsOptions[key];
      //      });

      $.each(that.payments, function (key, payment) {
        payment.init && payment.init();
      });

    },
    paymentChanged: function (triggerPayment) {
      var that = this;
      setTimeout(function () {
        var payment = that.getPayment();
        //console.log(payment,'payment');
        var restPayments = that.getRestPayments(payment, triggerPayment);
        //var lowestPaymentGrade = that.getLowestPaymentGrade(payment);
        $.each(restPayments, function (i, restPayment) {
          if (payment[restPayment]) {
            that.payments[restPayment].trigger('check');
            //return false;
          } else {
            setTimeout(function () {
              var lowestPaymentGrade = that.getLowestPaymentGrade(payment);
              if (that.payments[restPayment].get('grade') < lowestPaymentGrade) {
                if (that.isPaymentFullAmount()) {
                  that.payments[restPayment].trigger('notAvailable');
                } else {
                  that.payments[restPayment].trigger('available');
                }
              }
            }, 0);
          }
        });
      }, 0);
    },
    setPayment: function (payment, triggerPayment) {
      var that = this;
      that.payment = payment;
      that.paymentHistory.push(that.payment);
      if (that.paymentHistory.length > that.get('paymentHistoryLimit')) {
        that.paymentHistory.shift();
      }
      that.paymentChanged(triggerPayment);
      return that;
    },
    getPayment: function () {
      var that = this;
      return that.payment || {};
    },
    getPaymentAmount: function (payment) {
      var that = this;
    },
    getPaymentHistory: function () {
      var that = this;
      return that.paymentHistory || [];
    },
    isPaymentFullAmount: function (payment) {//检查是否足额支付
      var that = this;
      var payment = payment || that.getPayment();

      if (sumObject(payment) >= that.totalAmount) {
        return true;
      } else {
        return false;
      }
    },
    getUpperGradePayments: function (payment) {
      var that = this;
      var keys = Object.keys(payment);
      var grades = [];
      keys.each(function (key) {
        grades.push(that.payments[key].get('grade'));
      });
      var minGrade = getMin(grades);
      var maxGrade = getMax(grades);
      var upperGradePayments = [];
      $.each(that.payments, function (key, payment) {
        if (payment.get('grade') >= minGrade && payment.get('grade') <= maxGrade) {
          upperGradePayments.push(key);
        }
      });
      return upperGradePayments;
    },
    getRestPayments: function (payment, triggerPayment) {
      var that = this;
      var keys = Object.keys(payment);
      var grades = [];
      $.each(keys, function (i, key) {
        grades.push(that.payments[key].get('grade'));
      });
      var triggerPaymentGrade = triggerPayment.get('grade');
      var restPayments = [];
      $.each(that.payments, function (key, payment) {
        if (payment.get('grade') < triggerPaymentGrade) {
          restPayments.push(key);
        }
      });
      return restPayments;
    },
    getLowestPaymentGrade: function (payment) {
      var that = this;
      var keys = Object.keys(payment);
      var grades = [];

      $.each(keys, function (i, key) {
        grades.push(that.payments[key].get('grade'));
      });
      return getMin(grades);
    }
  });
  return Payment;
});
