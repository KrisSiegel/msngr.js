msngr.extend((function () {
	return {
		utils: {
			getType: function (obj) {
				return Object.prototype.toString.call(obj);
			},
			isString: function (str) {
	            return (Object.prototype.toString.call(str) === "[object String]");
	        },
	        isDate: function (obj) {
	            return (Object.prototype.toString.call(obj) === "[object Date]");
	        },
	        isNumber: function (obj) {
	            return (Object.prototype.toString.call(obj) === "[object Number]");
	        },
	        isObject: function (obj) {
	            return (Object.prototype.toString.call(obj) === "[object Object]");
	        },
	        isFunction: function (func) {
	            return (Object.prototype.toString.call(func) === "[object Function]");
	        },
	        isEmptyString: function (str) {
	            var isStr = this.isString(str);
	            if (str === undefined || str === null || (isStr && str.toString().length === 0)) {
	                return true;
	            }
	            if (isStr) {
	                return false;
	            }
	            return undefined;
	        }
	    }
	};
}()));
