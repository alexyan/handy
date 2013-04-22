/* handy.js */
define(function (require, exports, module) {
  "use strict";
  var $ = require('$'), Base = require('base');

  var Handy = Base.extend({
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
      return this;
    }
  });

  return function (configs) {
    return new Handy(configs);
  };
});