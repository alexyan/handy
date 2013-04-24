/**
 * balancePayment.js
 * 余额支付
 */
define(function (require, exports, module) {
  "use strict";
  var $ = require('$');
  var UtilString = require('../../util/string');
  var BasePayment = require('./basePayment');
  var BalancePayment = BasePayment.extend({
    attrs: {
      name: '余额支付',
      key: 'balancePayment',
      grade: 3
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
      this.getPaymentsCache().balancePayment = payAmount;

      this.trigger('used');
    },
    onNotUse: function () {
      var paymentsCache = this.getPaymentsCache();

      delete paymentsCache.balancePayment;
      this.trigger('notUsed');
    },
    onUsed: function () {
      BalancePayment.superclass.onUsed.call(this);
      var showTxtUse = UtilString.substitute(this.get('dataConf').showTxt.use, {
        payAmount: this.getPaymentsCache().balancePayment
      });
      this.element.closest('label').find('span').html(showTxtUse);
    }
  });
  return BalancePayment;
});

