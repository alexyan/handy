/* handy.js */
define(function (require, exports, module) {
  "use strict";

  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var o = {
    substitute: function (str, object, regexp) {
      return String(str).replace(regexp || (/\\?\{([^{}]+)\}/g), function (match, name) {
        if (match.charAt(0) == '\\') return match.slice(1);
        return (object[name] != null) ? object[name] : '';
      });
    }
  };

  return o;
});