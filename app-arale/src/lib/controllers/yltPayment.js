/**
 * YltPayment.js
 * 盈利通支付
 */
define(function (require, exports, module) {
  "use strict";
  var $ = require('$');
  var BasePayment = require('./basePayment');
  var UtilString = require('../../util/string');
  var YltPayment = BasePayment.extend({
    attrs: {
      name: '盈利通支付',
      key: 'yltPayment',
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
      this.getPaymentsCache().yltPayment = payAmount;

      this.trigger('used');
    },
    onNotUse: function () {
      var paymentsCache = this.getPaymentsCache();

      delete paymentsCache.yltPayment;
      this.trigger('notUsed');
    },
    onUsed: function () {
      YltPayment.superclass.onUsed.call(this);
      var showTxtUse = UtilString.substitute(this.get('dataConf').showTxt.use, {
        payAmount: this.getPaymentsCache().yltPayment
      });
      this.element.next('span').html(showTxtUse);
    }

  });
  return YltPayment;
});

