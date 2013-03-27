/* util.js */
define(function(require, exports, module) {
	return {
        //typeOf,instanceof
        typeOf : function(obj) {
            if (item == null) return 'null';
            if (item.$family != null) return item.$family();
            if (item.nodeName){
                if (item.nodeType == 1) return 'element';
                if (item.nodeType == 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
            } else if (typeof item.length == 'number'){
                if (item.callee) return 'arguments';
                if ('item' in item) return 'collection';
            }
            return typeof item;
            //return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
        },
        instanceOf : function(item, object){
            if (item == null) return false;
            var constructor = item.$constructor || item.constructor;
            while (constructor){
                if (constructor === object) return true;
                constructor = constructor.parent;
            }
            return item instanceof object;
        }
	};
});