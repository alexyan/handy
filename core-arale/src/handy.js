/* handy.js */
define(function (require, exports, module) {
  "use strict";
  var $ = require('$'), HandyBase = require('./base');

  var Handy = HandyBase.extend({
    setup: function () {
      //把PageVar挂在root上
      this.PageVar = $.extend({}, AP._PageVar_, AP.__PageVar__);
    },
    app: function (id, options, callback) {
      var that = this;
      require.async(id, function (App) {
        var app = new App(options, that, that);
        callback && callback.call(app);
      });
    }
  });

  return new Handy();
});