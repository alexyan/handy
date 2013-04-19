/* handy.js */
define(function (require, exports, module) {
  "use strict";
  var $ = require('$'), Util = {}, O = {}, S = {}, A = {};

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  $.extend(O, {
    keys: function (object) {
      var keys = [];
      for (var key in object) {
        if (hasOwnProperty.call(object, key)) keys.push(key);
      }
      return keys;
    }
  });
  Util.Object = O;
  $.extend(S, {
    substitute: function (str, object, regexp) {
      return String(str).replace(regexp || (/\\?\{([^{}]+)\}/g), function (match, name) {
        if (match.charAt(0) == '\\') return match.slice(1);
        return (object[name] != null) ? object[name] : '';
      });
    }
  });
  Util.String = S;

  return Util;
});