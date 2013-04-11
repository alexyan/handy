/* options.js */
define(function(require, exports, module) {
	"use strict";
    var Class = require('class');
    //require('../reset/reset');
    var Options = Class.create({ 
		setOptions: function(){
			var options = this.options = Object.merge.apply(null, [{}, this.options].append(arguments));
			if (this.addEvent) for (var option in options){
				if (typeOf(options[option]) != 'function' || !(/^on[A-Z]/).test(option)) continue;
				this.addEvent(option, options[option]);
				delete options[option];
			}
			return this;
		},
		resetOptions:function(){
			var options = this.options = this.__options__ || {};
			return this;
		},
        initialize:function(){
        }
    });
    module.exports = Options;
});




