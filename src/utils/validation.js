msngr.extend((function () {
	"use strict";

	return {
		utils: {
			getType: function (obj) {
				if (!msngr.utils.exists(obj)) {
					return "" + obj;
				}
				return Object.prototype.toString.call(obj);
			},
			isNullOrUndefined: function (obj) {
				return (obj === undefined || obj === null);
			},
			exists: function (obj) {
				return !this.isNullOrUndefined(obj);
			},
			isString: function (str) {
	            return (this.getType(str) === "[object String]");
	        },
	        isDate: function (obj) {
	            return (this.getType(obj) === "[object Date]");
	        },
	        isArray: function (obj) {
	            return (this.getType(obj) === "[object Array]");
	        },
	        isNumber: function (obj) {
	            return (this.getType(obj) === "[object Number]");
	        },
	        isObject: function (obj) {
	            return (this.getType(obj) === "[object Object]");
	        },
	        isFunction: function (func) {
	            return (this.getType(func) === "[object Function]");
	        },
	        isEmptyString: function (str) {
	            var isStr = this.isString(str);
	            if (str === undefined || str === null || (isStr && str.toString().trim().length === 0)) {
	                return true;
	            }
	            return false;
	        },
			hasWildCard: function (str) {
				return (str.indexOf("*") !== -1);
			}
	    }
	};
}()));
