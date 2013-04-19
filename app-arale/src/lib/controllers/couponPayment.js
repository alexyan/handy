/**
 * couponPayment.js
 * 红包支付
 */
define(function (require, exports, module) {
  "use strict";
  var $ = require('$');
  var BasePayment = require('./basePayment');
  //var Base = require('base');
  var CouponPayment = BasePayment.extend({
    attrs: {
      name: '红包支付',
      key: 'couponPayment',
      grade: 5
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

      var payAmount = 0;
      if (that.get('availableAmount') >= that.payment.get('payAmount')) {
        payAmount = that.payment.get('payAmount');
      } else {
        payAmount = that.get('availableAmount');
      }
      payment.couponPayment = payAmount;
      that.payment.setPayment.apply(that.payment, [payment, that]);

      that.trigger('used', [params]);
    },
    onNotUse: function (params) {
      var that = this;
      var payment = that.payment.getPayment();
      delete payment.couponPayment;
      //that.payment.setPayment(payment,that);
      that.payment.setPayment.apply(that.payment, [payment, that]);
      that.trigger('notUsed', [params]);
    },
    onUsed: function (params) {
      var that = this;
      that.used = true;
      that.element.prop('checked', true);
      that.element.closest('div.ui-checkbox').addClass('ui-checkbox-checked');
      var payment = that.payment.getPayment();
      var showTxtUse = String.substitute(that.get('dataConf').showTxt.use, {
        payAmount: payment.couponPayment
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
      that.element.on('checkuse',function (e, params) {
        that.trigger('check', [params]);//主动模式
      }).on('click',function () {
          $(this).trigger('checkuse', [
            {
              active: true,
              silent: false
            }
          ]);
        }).trigger('checkuse', [
          {
            active: true,
            silent: true,
            init: true
          }
        ]);

      that.element.closest('div.ui-checkbox').find('span.ui-icon').on('click', function () {
        that.element.trigger('click');
      });
    }
  });

  return CouponPayment;
});