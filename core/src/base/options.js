/* options.js */
define(function(require, exports, module) {
	"use strict";
	require('../reset/reset');
    var Class = require('class');
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
			var that = this;
			that.options = Object.clone(that.__options||{});
			Object.each(that.options,function(v,k){
				if(/^on([A-Z])/.test(k)){
					//console.log(k);
					//delete that.options[k];
				}
			});
			return this;
		}
    });
    module.exports = Options;
});