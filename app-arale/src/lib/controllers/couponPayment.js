/**
 * couponPayment.js
 * 红包支付
 */
define(function (require, exports, module) {
  "use strict";
  var $ = require('$');
  var UtilString = require('../../util/string');
  var BasePayment = require('./basePayment');
  var CouponPayment = BasePayment.extend({
    attrs: {
      name: '红包支付',
      key: 'couponPayment',
      grade: 5
    },
    onUse: function () {
      var availableAmount = this.get('availableAmount'),
        usableAmount = this.parent.getUsableAmount(this),
        payAmount;
      if (availableAmount > usableAmount) {
        payAmount = usableAmount;
      } else {
        payAmount = availableAmount;
      }
      this.getPaymentsCache().couponPayment = payAmount;

      this.trigger('used');
    },
    onNotUse: function () {
      var paymentsCache = this.getPaymentsCache();

      delete paymentsCache.couponPayment;
      this.trigger('notUsed');
    },
    onUsed: function () {
      CouponPayment.superclass.onUsed.call(this);
      var showTxtUse = UtilString.substitute(this.get('dataConf').showTxt.use, {
        payAmount: this.getPaymentsCache().couponPayment
      });
      this.element.closest('label').find('span').html(showTxtUse);
    }
  });

  return CouponPayment;
});