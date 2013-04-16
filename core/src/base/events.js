/* events.js */
define(function(require, exports, module) {
    "use strict";
    require('../reset/reset');
    var Events = require('events');
    var removeOn = function(string){
        return string.replace(/^on([A-Z])/, function(full, first){
            return first.toLowerCase();
        });
    };
    Events.prototype.addEvent = function(type, fn, callback){
        var that = this;
        type = removeOn(type);
        !!fn && 'function' == typeof(fn) && that.on(type,fn,callback);  
        return this;            
    };
    Events.prototype.addEvents = function(events){
        var that = this;            
        $.each(events,function(type,fn){  
            that.addEvent(type,fn)
        });
        return that;
    };
    Events.prototype.removeEvent = function(type,fn,context){
        var that = this;
        type = removeOn(type);
        that.off(type,fn,context);
        return that;
    };
    Events.prototype.removeEvents = function(){
        var that = this;
        that.off();
        return that;        
    };
    Events.prototype.fireEvent = function(type,args){
        var that = this;         
        ['before' + type.capitalize(), type, 'after' + type.capitalize()].each(function(type,index){
            !!that.__events[type] && (function(){
                that.trigger(type,args);
            })()
        });
        return that;    
    };
   
    return Events;

});
