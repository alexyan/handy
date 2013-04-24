/**
 * jfbPayment.js
 * 集分宝支付
 */
define(function (require, exports, module) {
  "use strict";
  var $ = require('$');
  var BasePayment = require('./basePayment');
  var UtilString = require('../../util/string');
  var JfbPayment = BasePayment.extend({
    attrs: {
      name: '集分宝支付',
      key: 'jfbPayment',
      grade: 4
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
      this.getPaymentsCache().jfbPayment = payAmount;

      this.trigger('used');
    },
    onNotUse: function () {
      var paymentsCache = this.getPaymentsCache();

      delete paymentsCache.jfbPayment;
      this.trigger('notUsed');
    },
    onUsed: function () {
      var paymentsCache = this.getPaymentsCache();
      JfbPayment.superclass.onUsed.call(this);
      var showTxtUse = UtilString.substitute(this.get('dataConf').showTxt.use, {
        payAmount: paymentsCache.jfbPayment,
        payPoint: parseInt(paymentsCache.jfbPayment * 100)
      });
      this.element.closest('label').find('span').html(showTxtUse);
    }
  });
  return JfbPayment;
});

