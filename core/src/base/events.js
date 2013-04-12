/* events.js */
define(function(require, exports, module) {
    "use strict";
    require('../reset/reset');
    var Class = require('class');
    var removeOn = function(string){
        return string.replace(/^on([A-Z])/, function(full, first){
            return first.toLowerCase();
        });
    };
    var Events = Class.create({ 
        $events:{},
        addEvent: function(type, fn, internal){
            type = removeOn(type);
            this.$events[type] = (this.$events[type] || []).include(fn);
            if (internal) fn.internal = true;
            return this;
        },
        addEvents: function(events){
            for (var type in events) this.addEvent(type, events[type]);
            return this;
        },
        fireEvent: function(type, args, delay){
            type = removeOn(type);
            var events = this.$events[type];
            if (!events) return this;
            args = Array.from(args);
            events.each(function(fn){
                if (delay) fn.delay(delay, this, args);
                else fn.apply(this, args);
            }, this);
            return this;
        },
        removeEvent: function(type, fn){
            type = removeOn(type);
            var events = this.$events[type];
            if (events && !fn.internal){
                var index =  events.indexOf(fn);
                if (index != -1) delete events[index];
            }
            return this;
        },
        removeEvents: function(events){
            var type;
            if (typeOf(events) == 'object'){
                for (type in events) this.removeEvent(type, events[type]);
                return this;
            }
            if (events) events = removeOn(events);
            for (type in this.$events){
                if (events && events != type) continue;
                var fns = this.$events[type];
                for (var i = fns.length; i--;) if (i in fns){
                    this.removeEvent(type, fns[i]);
                }
            }
            return this;
        }
    });
    module.exports = Events;
});
