msngr.extend((function () {
	"use strict";

	return {
		utils: {
			getType: function (obj) {
				if (!msngr.utils.exist(obj)) {
					return "" + obj;
				}
				return Object.prototype.toString.call(obj);
			},
			isArguments: function (obj) {
				return (msngr.utils.getType(obj) === "[object Arguments]");
			},
			areArguments: function () {
				return msngr.utils.reiterativeValidation(msngr.utils.isArguments, msngr.utils.argumentsToArray(arguments));
			},
			isNullOrUndefined: function (obj) {
				return (obj === undefined || obj === null);
			},
			exist: function (obj) {
				return !msngr.utils.isNullOrUndefined(obj);
			},
			exists: function () {
				return msngr.utils.reiterativeValidation(msngr.utils.exist, msngr.utils.argumentsToArray(arguments));
			},
			isString: function (str) {
	            return (msngr.utils.getType(str) === "[object String]");
	        },
			areStrings: function () {
				return msngr.utils.reiterativeValidation(msngr.utils.isString, msngr.utils.argumentsToArray(arguments));
			},
	        isDate: function (obj) {
	            return (msngr.utils.getType(obj) === "[object Date]");
	        },
			areDates: function () {
				return msngr.utils.reiterativeValidation(msngr.utils.isDate, msngr.utils.argumentsToArray(arguments));
			},
	        isArray: function (obj) {
	            return (msngr.utils.getType(obj) === "[object Array]");
	        },
			areArrays: function () {
				return msngr.utils.reiterativeValidation(msngr.utils.isArray, msngr.utils.argumentsToArray(arguments));
			},
	        isNumber: function (obj) {
	            return (msngr.utils.getType(obj) === "[object Number]");
	        },
			areNumbers: function () {
				return msngr.utils.reiterativeValidation(msngr.utils.isNumber, msngr.utils.argumentsToArray(arguments));
			},
	        isObject: function (obj) {
	            return (msngr.utils.getType(obj) === "[object Object]");
	        },
			areObjects: function () {
				return msngr.utils.reiterativeValidation(msngr.utils.isObject, msngr.utils.argumentsToArray(arguments));
			},
	        isFunction: function (func) {
	            return (msngr.utils.getType(func) === "[object Function]");
	        },
			areFunctions: function () {
				return msngr.utils.reiterativeValidation(msngr.utils.isFunction, msngr.utils.argumentsToArray(arguments));
			},
	        isEmptyString: function (str) {
	            var isStr = msngr.utils.isString(str);
	            if (str === undefined || str === null || (isStr && str.toString().trim().length === 0)) {
	                return true;
	            }
	            return false;
	        },
			areEmptyStrings: function () {
				return msngr.utils.reiterativeValidation(msngr.utils.isEmptyString, msngr.utils.argumentsToArray(arguments));
			},
			hasWildCard: function (str) {
				return (str.indexOf("*") !== -1);
			},
			reiterativeValidation: function (validationMethod, inputs) {
				var result = false;
				if (msngr.utils.exist(validationMethod) && msngr.utils.exist(inputs)) {
					if (!msngr.utils.isArray(inputs)) {
						inputs = [inputs];
					}
					for (var i = 0; i < inputs.length; ++i) {
						result = validationMethod.apply(this, [inputs[i]]);
						if (result === false) {
							break;
						}
					}
				}
				return result;
			}
	    }
	};
}()));
