msngr.extend((function (external, internal) {
	"use strict";

	return {
		getType: function (obj) {
			if (!external.exist(obj)) {
				return "" + obj;
			}
			return Object.prototype.toString.call(obj);
		},
		isArguments: function (obj) {
			return (external.getType(obj) === "[object Arguments]");
		},
		areArguments: function () {
			return external.reiterativeValidation(external.isArguments, external.argumentsToArray(arguments));
		},
		isNullOrUndefined: function (obj) {
			return (obj === undefined || obj === null);
		},
		exist: function (obj) {
			return !external.isNullOrUndefined(obj);
		},
		exists: function () {
			return external.reiterativeValidation(external.exist, external.argumentsToArray(arguments));
		},
		isString: function (str) {
            return (external.getType(str) === "[object String]");
        },
		areStrings: function () {
			return external.reiterativeValidation(external.isString, external.argumentsToArray(arguments));
		},
        isDate: function (obj) {
            return (external.getType(obj) === "[object Date]");
        },
		areDates: function () {
			return external.reiterativeValidation(external.isDate, external.argumentsToArray(arguments));
		},
        isArray: function (obj) {
            return (external.getType(obj) === "[object Array]");
        },
		areArrays: function () {
			return external.reiterativeValidation(external.isArray, external.argumentsToArray(arguments));
		},
        isNumber: function (obj) {
            return (external.getType(obj) === "[object Number]");
        },
		areNumbers: function () {
			return external.reiterativeValidation(external.isNumber, external.argumentsToArray(arguments));
		},
        isObject: function (obj) {
            return (external.getType(obj) === "[object Object]");
        },
		areObjects: function () {
			return external.reiterativeValidation(external.isObject, external.argumentsToArray(arguments));
		},
        isFunction: function (func) {
            return (external.getType(func) === "[object Function]");
        },
		areFunctions: function () {
			return external.reiterativeValidation(external.isFunction, external.argumentsToArray(arguments));
		},
        isEmptyString: function (str) {
            var isStr = external.isString(str);
            if (str === undefined || str === null || (isStr && str.toString().trim().length === 0)) {
                return true;
            }
            return false;
        },
		areEmptyStrings: function () {
			return external.reiterativeValidation(external.isEmptyString, external.argumentsToArray(arguments));
		},
		hasWildCard: function (str) {
			return (str.indexOf("*") !== -1);
		},
		reiterativeValidation: function (validationMethod, inputs) {
			var result = false;
			if (external.exist(validationMethod) && external.exist(inputs)) {
				if (!external.isArray(inputs)) {
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
	};
}));
