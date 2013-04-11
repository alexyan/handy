/* App.js */
define(function(require, exports, module) {
    "use strict";
    var Base = require('./base/base');
    var App = Base.extend({
        initialize:function(options){
            var that = this;
            App.superclass.initialize.apply(that, [ options ]);
        }
    });
    module.exports = App;
});