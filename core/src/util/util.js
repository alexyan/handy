/* util.js */
define(function(require, exports, module) {
    var Class = require('class');
    require('../reset/reset');
    var Util = Class.create({ 
        initialize:function(){
            var that = this;
            //UA Detect
            that.$D = require('./detect');

            that.$A = function(item){
                return Array.from(item).slice();
            };
            
            that.$arguments = function(i){
                return function(){
                    return arguments[i];
                };
            };
            that.$chk = function(obj){
                return !!(obj || obj === 0);
            };
            that.$clear = function(timer){
                clearTimeout(timer);
                clearInterval(timer);
                return null;
            };
            that.$type = function(object){
                var type = typeOf(object);
                if (type == 'elements') return 'array';
                return (type == 'null') ? false : type;
            };
            that.$extend = function(original, extended){
                return Object.append(original, extended);
            };            
            that.$merge = function(){
                var args = Array.slice(arguments);
                args.unshift({});
                return Object.merge.apply(null, args);
            };
            that.$defined = function(obj){
                return (obj != null);
            };
            that.$defined = function(obj){
                return (obj != null);
            };
            that.$each = function(iterable, fn, bind){
                var type = typeOf(iterable);
                ((type == 'arguments' || type == 'collection' || type == 'array' || type == 'elements') ? Array : Object).each(iterable, fn, bind);
            };
            that.$unlink = function(object){
                switch (typeOf(object)){
                    case 'object': return Object.clone(object);
                    case 'array': return Array.clone(object);
                    case 'hash': return new Hash(object);
                    default: return object;
                }
            };
            //Hash Object
            that.$H = function(object){
                return new Hash(object);
            };
            that.$empty = function(){};
            that.$lambda = Function.from;
            that.$mixin = Object.merge;
            that.$random = Number.random;
            that.$splat = Array.from;
            that.$time = Date.now;
        }
    });
    module.exports = new Util;
});