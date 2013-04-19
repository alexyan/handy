/**
 * basePayment.js
 */
define(function (require, exports, module) {
  "use strict";
  var $ = require('$');
  var HandyBase = require('handy-base');

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
    }
  });

  return BasePayment;
});

