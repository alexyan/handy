/**
 * payment.js
 * 用于组织wapCashier支付相关业务
 */
define(function (require, exports, module) {
  "use strict";
  var $ = require('$');
  var HandyBase = require('handy-base');

  var JSON = require('json');
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  var CouponPayment = require('./couponPayment');
  var JfbPayment = require('./jfbPayment');
  var BalancePayment = require('./balancePayment');
  var YltPayment = require('./yltPayment');
  var CreditPayment = require('./creditPayment');
  var ExpressPayment = require('./expressPayment');

  var UtilObject = require('../../util/object');

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
    setup: function () {
      var that = this;
      this.orderId = this.root.PageVar.orderId;
      this.totalAmount = this.root.PageVar.pay_amount;

      //支付方式,用数组,记录历史操作记录,可用于回退操作
      //this.paymentHistory = [];
      //当前的支付方式
      //this.payment = this.paymentHistory[this.paymentHistory.length - 1];

      //payments对象,存放当前交易所支持的支付方式
      this.payments = {};
      //存放当前使用的支付方式以及支付的Amount
      this.paymentsCache = {};
      //遍历页面上支持的支付类型
      $.each($('input.payment'), function (index, item) {
        var dataConf = JSON.parse(($(item).data('conf') || '{}').replace(/'/g, '"'));
        var modelOptions = that.get(dataConf.model + 'Options');
        that.payments[dataConf.model] = that._paymentCreate(dataConf.model, $.extend({
          element: item,
          dataConf: dataConf
        }, modelOptions));
      });

      this.on('paymentChanged', this.onPaymentChanged);
      this.init();
    },
    /**
     * 初始化各支付方式
     */
    init: function () {
      var that = this;
      var payments = this.sortPaymentsByGrade();
      $.each(payments, function (i, payment) {
        if (that.isPaymentFullAmount() || payment.get('availableAmount') == 0) {
          payment.trigger('notUse').trigger('notAvailable');
        } else {
          payment.trigger('use').trigger('available');
        }
      });
    },
    /**
     * 返回支付类型实例
     * @param model
     * @param options
     * @returns {*}
     * @private
     */
    _paymentCreate: function (model, options) {
      switch (model) {
        case 'couponPayment':
          return new CouponPayment(options, this);
        case 'jfbPayment':
          return new JfbPayment(options, this);
        case 'balancePayment':
          return new BalancePayment(options, this);
        case 'yltPayment':
          return new YltPayment(options, this);
        case 'creditPayment':
          return new CreditPayment(options, this);
        case 'expressPayment':
          return new ExpressPayment(options, this);
        default:
          return null;
      }
    },
    /**
     * 是否已足额支付
     * @param payments
     * @returns {boolean}
     */
    isPaymentFullAmount: function (payments) {
      if (sumObject(payments || this.paymentsCache) >= this.totalAmount) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * 去掉当前payment后，还需要支付的余额
     * @returns {number}
     */
    getUsableAmount: function (currentPayment) {
      var that = this;
      var currentAmount = 0;
      $.each(this.paymentsCache, function (model, amount) {
        if (currentPayment.get('grade') < that.payments[model].get('grade'))
          currentAmount += amount;
      });
      return this.get('payAmount') - currentAmount;
    },
    /**
     * 获取最低grade配置
     * @returns {*}
     */
    getLowestPaymentGrade: function () {
      var that = this;
      var keys = UtilObject.keys(this.paymentsCache);
      var lowestPaymentGrade = Number.POSITIVE_INFINITY;

      $.each(keys, function (i, key) {
        var grade = that.payments[key].get('grade');
        if (grade < lowestPaymentGrade)
          lowestPaymentGrade = grade;
      });

      return lowestPaymentGrade;
    },
    /**
     * payments状态变更后触发。
     */
    onPaymentChanged: function () {
      var that = this;
      var grades = this.sortPaymentsByGrade();
      var payAmount = 0;

      $.each(grades, function (i, payment) {
        var availableAmount = payment.get('availableAmount');
        if (payment.used) {
          if (payAmount < that.totalAmount) {
            payment.trigger('available').trigger('use');
          } else {
            payment.trigger('notAvailable').trigger('notUse');
          }
          payAmount += availableAmount;
        } else {
          if (payAmount < that.totalAmount && 0 < availableAmount) {
            payment.trigger('available');
          } else {
            payment.trigger('notAvailable');
          }
        }
      });
    },
    /**
     * 根据grade配置，从高到低排序
     * @returns {*}
     */
    sortPaymentsByGrade: function () {
      var grades = [];
      $.each(this.payments, function (model, payment) {
        grades.push(payment);
      });
      return grades.sort(function (prev, next) {
        return next.get('grade') - prev.get('grade');
      });
    }
  });

  return Payment;
});
