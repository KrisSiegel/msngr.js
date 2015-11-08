msngr.extend((function(external, internal) {
    "use strict";

    internal.reiterativeValidation = function(validationMethod, inputs) {
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
    };

    return {
        getType: function(obj) {
            if (!external.exist(obj)) {
                return "" + obj;
            }
            return Object.prototype.toString.call(obj);
        },
        isArguments: function(obj) {
            return (external.getType(obj) === "[object Arguments]");
        },
        areArguments: function() {
            return internal.reiterativeValidation(external.isArguments, external.argumentsToArray(arguments));
        },
        isNullOrUndefined: function(obj) {
            return (obj === undefined || obj === null);
        },
        exist: function(obj) {
            return !external.isNullOrUndefined(obj);
        },
        exists: function() {
            return internal.reiterativeValidation(external.exist, external.argumentsToArray(arguments));
        },
        isString: function(str) {
            return (external.getType(str) === "[object String]");
        },
        areStrings: function() {
            return internal.reiterativeValidation(external.isString, external.argumentsToArray(arguments));
        },
        isDate: function(obj) {
            return (external.getType(obj) === "[object Date]");
        },
        areDates: function() {
            return internal.reiterativeValidation(external.isDate, external.argumentsToArray(arguments));
        },
        isArray: function(obj) {
            return (external.getType(obj) === "[object Array]");
        },
        areArrays: function() {
            return internal.reiterativeValidation(external.isArray, external.argumentsToArray(arguments));
        },
        isNumber: function(obj) {
            return (external.getType(obj) === "[object Number]");
        },
        areNumbers: function() {
            return internal.reiterativeValidation(external.isNumber, external.argumentsToArray(arguments));
        },
        isObject: function(obj) {
            return (external.getType(obj) === "[object Object]");
        },
        areObjects: function() {
            return internal.reiterativeValidation(external.isObject, external.argumentsToArray(arguments));
        },
        isFunction: function(func) {
            return (external.getType(func) === "[object Function]");
        },
        areFunctions: function() {
            return internal.reiterativeValidation(external.isFunction, external.argumentsToArray(arguments));
        },
        isEmptyString: function(str) {
            var isStr = external.isString(str);
            if (str === undefined || str === null || (isStr && str.toString().trim().length === 0)) {
                return true;
            }
            return false;
        },
        areEmptyStrings: function() {
            return internal.reiterativeValidation(external.isEmptyString, external.argumentsToArray(arguments));
        }
    };
}));
