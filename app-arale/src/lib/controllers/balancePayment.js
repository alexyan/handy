/**
 * balancePayment.js
 * 余额支付
 */
define(function (require, exports, module) {
  "use strict";
  var $ = require('$');
  var BasePayment = require('./basePayment');
  var BalancePayment = BasePayment.extend({
    attrs: {
      name: '余额支付',
      key: 'balancePayment',
      grade: 3
    },
    onAvailable: function (params) {
      var that = this;
      that.available = true;

      that.element.prop("disabled", false);
      that.element.closest('div.ui-checkbox').removeClass('ui-checkbox-disabled');
    },
    onNotAvailable: function (params) {
      var that = this;
      that.available = false;
      that.element.prop("disabled", true);
      that.element.closest('div.ui-checkbox').addClass('ui-checkbox-disabled');
    },
    onUse: function (params) {
      var that = this;
      var payment = that.payment.getPayment();
      var totalAmount = that.payment.totalAmount;
      var amountNeed2Pay = totalAmount;
      var grade = that.get('grade');

      $.each(that.payment.payments, function (key, item) {
        if (payment[key] && item.get('grade') > grade) {
          amountNeed2Pay = amountNeed2Pay - payment[key];
        }
      });

      var payAmount = amountNeed2Pay;
      if (that.get('availableAmount') >= payAmount) {
        payAmount = payAmount;
      } else {
        payAmount = that.get('availableAmount');
      }

      payment.balancePayment = payAmount;

      that.trigger('used', [params]);
      that.payment.setPayment.apply(that.payment, [payment, that]);
    },
    onNotUse: function (params) {
      var that = this;
      var payment = that.payment.getPayment();
      delete payment.balancePayment;
      that.trigger('notUsed', [params]);
      that.payment.setPayment.apply(that.payment, [payment, that]);
    },
    onUsed: function (params) {
      var that = this;
      that.used = true;
      that.element.prop('checked', true);
      that.element.closest('div.ui-checkbox').addClass('ui-checkbox-checked');
      var payment = that.payment.getPayment();
      var showTxtUse = String.substitute(that.get('dataConf').showTxt.use, {
        payAmount: payment.balancePayment
      });
      that.element.closest('label').find('span').html(showTxtUse);
    },
    onNotUsed: function (params) {
      var that = this;
      that.used = false;

      that.element.prop('checked', false);
      that.element.closest('div.ui-checkbox').removeClass('ui-checkbox-checked');
      that.element.closest('label').find('span').text(that.get('dataConf').showTxt.unuse);
    },
    onReset: function (params) {
      var that = this;
      var payment = that.payment.getPayment(),
        tempPayment = {},
        grade = that.get('grade');
      $.each(payment, function (key, item) {
        if (that.payment.payments[key].get('grade') > grade) {
          tempPayment[key] = payment[key];
        }
      });
      //console.log(tempPayment,'balancePayment tempPayment');

      if (that.get('availableAmount') && !that.payment.isPaymentFullAmount(tempPayment)) {
        that.trigger('available', [params]);
      } else {
        that.trigger('notAvailable', [params]);
      }
    },
    onCheck: function (params) {
      var that = this;
      that.trigger('reset', [params]);
      if (that.available) {
        if (that.element.prop('checked')) {
          that.trigger('use', [params]);
        } else {
          that.trigger('notUse', [params]);
        }
      }
    },
    init: function () {
      var that = this;

      that.payment = that.parent;
      that.element = $(that.get('element'));
      that.initEvents();
      /**
       * 参数说明:
       * 1、active:用户主动行为,比如点击;初始化时也设置为主动触发.
       * 主动行为可以处理完毕后通知pay对象向其它方式发起check事件
       * 2、silent: 静默执行, 比如初始化是需要主动触发,但是静默操作设置为true,
       * 那么可以屏蔽一些ui上的行为
       * 3、init: 标示初始化行为
       */
      that.element.bind('checkuse',function (e, params) {
        that.trigger('check', [params]);//主动模式
      }).bind('click',function () {
          $(this).trigger('checkuse', [
            {active: true, silent: false}
          ]);
        }).trigger('checkuse', [
          {active: true, silent: true, init: true}
        ]);

      that.element.closest('div.ui-checkbox').find('span.ui-icon').bind('click', function () {
        that.element.trigger('click');
      });
    }
  });
  return BalancePayment;
});

