/**
 * basePayment.js
 */
define(function (require, exports, module) {
  "use strict";
  var $ = require('$');
  var HandyBase = require('handy-base');
  var UtilString = require('../../util/string');

  var BasePayment = HandyBase.extend({
    setup: function () {
      var that = this;
      this.element = $(this.get('element'));
      this.initEvents();

      this.element.on('click', function () {
        that.trigger('check');
      });
    },
    initEvents: function () {
      this.on('available', this.onAvailable);
      this.on('notAvailable', this.onNotAvailable);
      this.on('use', this.onUse);
      this.on('notUse', this.onNotUse);
      this.on('used', this.onUsed);
      this.on('notUsed', this.onNotUsed);
      this.on('check', this.onCheck);
    },
    onCheck: function () {
      if (this.available) {
        if (this.element.prop('checked')) {
          this.trigger('use');
        } else {
          this.trigger('notUse');
        }
        this.parent.trigger('paymentChanged');
      }
    },
    onAvailable: function () {
      if (!this.available) {
        this.available = true;

        this.element.prop("disabled", false);
        this.element.closest('div.ui-checkbox').removeClass('ui-checkbox-disabled');
      }
    },
    onNotAvailable: function () {
      if (this.available) {
        this.available = false;
        this.element.prop("disabled", true);
        this.element.closest('div.ui-checkbox').addClass('ui-checkbox-disabled');
      }
    },
    onUsed: function () {
      this.used = true;

      this.element.prop('checked', true)
        .closest('.ui-checkbox')
        .addClass('ui-checkbox-checked');
    },
    onNotUsed: function () {
      this.used = false;

      this.element.prop('checked', false)
        .next('span')
        .text(this.get('dataConf').showTxt.unuse)
        .end()
        .closest('.ui-checkbox')
        .removeClass('ui-checkbox-checked');
    },
    getPaymentsCache: function () {
      return this.parent.paymentsCache;
    }
  });

  return BasePayment;
});

