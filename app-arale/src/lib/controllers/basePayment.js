/**
 * basePayment.js
 */
define(function (require, exports, module) {
  "use strict";
  var $ = require('$');
  var HandyBase = require('handy-base');
  var UtilString = require('../../util/string');

  var BasePayment = HandyBase.extend({
    initEvents: function () {
      this.on('available', this.onAvailable);
      this.on('notAvailable', this.onNotAvailable);
      this.on('use', this.onUse);
      this.on('notUse', this.onNotUse);
      this.on('used', this.onUsed);
      this.on('notUsed', this.onNotUsed);
      this.on('reset', this.onReset);
      this.on('check', this.onCheck);
    },
    setup: function () {
      var that = this;
      this.element = $(this.get('element'));
      this.initEvents();
      //this.payment = that.parent;
      /**
       * 参数说明:
       * 1、active:用户主动行为,比如点击;初始化时也设置为主动触发.
       * 主动行为可以处理完毕后通知pay对象向其它方式发起check事件
       * 2、silent: 静默执行, 比如初始化是需要主动触发,但是静默操作设置为true,
       * 那么可以屏蔽一些ui上的行为
       * 3、init: 标示初始化行为
       */
      this.element.on('click', function () {
        that.trigger('check');
      });

      //this.trigger('check', {active: true, silent: true, init: true});
    },
    onCheck: function () {
      //this.trigger('reset');

      if (this.available) {
        if (this.element.prop('checked')) {
          this.trigger('use');
        } else {
          this.trigger('notUse');
        }
        this.parent.trigger('paymentChanged');
      }
    },
//    onReset: function () {
//      var that = this,
//        grade = that.get('grade');
//
//      //有availableAmount配置，并且已经足额支付了，禁用当前支付方式
//      if (that.get('availableAmount') && that.parent.isPaymentFullAmount()) {
//        that.trigger('notAvailable');
//      } else {
//        that.trigger('available');
//      }
//    },
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

