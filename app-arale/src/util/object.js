/* handy.js */
define(function (require, exports, module) {
  "use strict";

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  var o = {
    keys: function (object) {
      var keys = [];
      for (var key in object) {
        if (hasOwnProperty.call(object, key)) keys.push(key);
      }
      return keys;
    }
  };

  return o;
});