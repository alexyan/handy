/* util.js */
define(function(require, exports, module) {
	return {
        //Fixing the JavaScript typeof operator
        //Thanks to : 
        //  http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
        typeOf : function(obj) {
          return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
        },
        //Mootools instanceof
        instanceof : function(item, object){
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