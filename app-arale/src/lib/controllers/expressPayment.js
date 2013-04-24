/**
 * expressPayment.js
 * 快捷支付
 */
define(function (require, exports, module) {
  "use strict";
  var $ = require('$');
  var BasePayment = require('./basePayment');
  var UtilString = require('../../util/string');
  var JSON = require('json');

  var ExpressPayment = BasePayment.extend({
    attrs: {
      name: '快捷支付',
      key: 'expressPayment',
      availableAmount: Number.POSITIVE_INFINITY,
      grade: 1
    },
    setup: function () {
      ExpressPayment.superclass.setup.call(this);
      var that = this;
      var uiCheckbox = this.element.closest('div.ui-checkbox');
      var uiSelect = uiCheckbox.next('.ui-select');

      $('#savedCardList').on('change',function () {
        var selectedOption = $(this.options[this.selectedIndex]);
        var dataConf = JSON.parse((selectedOption.data('conf') || '{}').replace(/'/g, '"'));
        var dataAttrs = JSON.parse((selectedOption.data('attrs') || '{}').replace(/'/g, '"'));
        $.extend(true, that.get('dataConf'), dataConf);
        $.each(dataAttrs, function (key, attr) {
          that.set(key, attr);
        });
        that.parent.trigger('paymentChanged');
      }).triggerHandler('change');

    },
    onUse: function () {
      var payAmount = this.parent.getUsableAmount(this);

      this.getPaymentsCache().expressPayment = payAmount;

      this.trigger('used');
    },
    onNotUse: function () {
      var paymentsCache = this.getPaymentsCache();

      delete paymentsCache.expressPayment;
      this.trigger('notUsed');
    },
    onUsed: function () {
      ExpressPayment.superclass.onUsed.call(this);
      var showTxtUse = UtilString.substitute(this.get('dataConf').showTxt.use, {
        payAmount: this.getPaymentsCache().expressPayment
      });
      this.element.next('span').html(showTxtUse);
      var uiCheckbox = this.element.closest('div.ui-checkbox');
      var uiSelect = uiCheckbox.next('.ui-select');
      uiSelect.removeClass('ui-select-disabled').find('select').prop('disabled', false);
    },
    onNotUsed: function () {
      ExpressPayment.superclass.onNotUsed.call(this);
      var uiCheckbox = this.element.closest('div.ui-checkbox');
      var uiSelect = uiCheckbox.next('.ui-select');
      uiSelect.addClass('ui-select-disabled').find('select').prop('disabled', true);
    }
  });
  return ExpressPayment;
});

