/**
 * creditPayment.js
 * 信用支付
 */
define(function (require, exports, module) {
  "use strict";
  var $ = require('$');
  var UtilString = require('../../util/string');
  var BasePayment = require('./basePayment');
  var CreditPayment = BasePayment.extend({
    attrs: {
      name: '信用支付',
      key: 'creditPayment',
      grade: 2
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
      this.getPaymentsCache().creditPayment = payAmount;

      this.trigger('used');
    },
    onNotUse: function () {
      var paymentsCache = this.getPaymentsCache();

      delete paymentsCache.creditPayment;
      this.trigger('notUsed');
    },
    onUsed: function () {
      CreditPayment.superclass.onUsed.call(this);
      var showTxtUse = UtilString.substitute(this.get('dataConf').showTxt.use, {
        payAmount: this.getPaymentsCache().creditPayment
      });
      this.element.next('span').html(showTxtUse);
    }
  });

  return CreditPayment;
});