/* securityProd.js */
define(function (require, exports, module) {
  "use strict";
  var $ = require("$");
  var HandyBase = require("handy-base");
  var SecurityProd = HandyBase.extend({
    setup: function () {
      $(this.get('element')).find("button:submit").prop("disabled", false).closest(".ui-button-submit").removeClass("ui-button-disabled");
    }
  });
  return SecurityProd;
});