if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./utils/validation.js", function () {
    "use strict";

    it("msngr.utils.getType(obj) - obj is a function", function () {
        expect(msngr.utils.getType(function () {})).to.equal("[object Function]");
    });

    it("msngr.utils.getType(obj) - obj is a string", function () {
        expect(msngr.utils.getType("test")).to.equal("[object String]");
    });

    it("msngr.utils.getType(obj) - obj is a number", function () {
        expect(msngr.utils.getType(42)).to.equal("[object Number]");
    });

    it("msngr.utils.getType(obj) - obj is an array", function () {
        expect(msngr.utils.getType([])).to.equal("[object Array]");
    });

    it("msngr.utils.getType(obj) - obj is an object", function () {
        expect(msngr.utils.getType({ })).to.equal("[object Object]");
    });

    it("msngr.utils.getType(obj) - obj is undefined", function () {
        expect(msngr.utils.getType(undefined)).to.equal("undefined");
    });

    it("msngr.utils.getType(obj) - obj is null", function () {
        expect(msngr.utils.getType(null)).to.equal("null");
    });

    // isArguments
    it("msngr.utils.isArguments(obj) - obj is a function", function () {
        expect(msngr.utils.isArguments(function () {})).to.equal(false);
    });

    it("msngr.utils.isArguments(obj) - obj is a string with content", function () {
        expect(msngr.utils.isArguments("test")).to.equal(false);
    });

    it("msngr.utils.isArguments(obj) - obj is an empty string", function () {
        expect(msngr.utils.isArguments("")).to.equal(false);
    });

    it("msngr.utils.isArguments(obj) - obj is a string with only whitespace", function () {
        expect(msngr.utils.isArguments(" ")).to.equal(false);
    });

    it("msngr.utils.isArguments(obj) - obj is undefined", function () {
        expect(msngr.utils.isArguments(undefined)).to.equal(false);
    });

    it("msngr.utils.isArguments(obj) - obj is null", function () {
        expect(msngr.utils.isArguments(null)).to.equal(false);
    });

    it("msngr.utils.isArguments(obj) - obj is an object", function () {
        expect(msngr.utils.isArguments({})).to.equal(false);
    });

    it("msngr.utils.isArguments(obj) - obj is a number", function () {
        expect(msngr.utils.isArguments(7)).to.equal(false);
    });

    it("msngr.utils.isArguments(obj) - obj is an array", function () {
        expect(msngr.utils.isArguments([])).to.equal(false);
    });

    it("msngr.utils.isArguments(obj) - obj is a Date", function () {
        expect(msngr.utils.isArguments(new Date())).to.equal(false);
    });

    it("msngr.utils.isArguments(obj) - obj is an Arguments object", function () {
        var tFunc = function () {
            expect(msngr.utils.isArguments(arguments)).to.equal(true);
        }

        tFunc("something", 15, "weee");
    });

    // isNullOrUndefined(obj)
    it("msngr.utils.isNullOrUndefined(obj) - obj is a function", function () {
        expect(msngr.utils.isNullOrUndefined(function () {})).to.equal(false);
    });

    it("msngr.utils.isNullOrUndefined(obj) - obj is a string with content", function () {
        expect(msngr.utils.isNullOrUndefined("test")).to.equal(false);
    });

    it("msngr.utils.isNullOrUndefined(obj) - obj is an empty string", function () {
        expect(msngr.utils.isNullOrUndefined("")).to.equal(false);
    });

    it("msngr.utils.isNullOrUndefined(obj) - obj is a string with only whitespace", function () {
        expect(msngr.utils.isNullOrUndefined(" ")).to.equal(false);
    });

    it("msngr.utils.isNullOrUndefined(obj) - obj is undefined", function () {
        expect(msngr.utils.isNullOrUndefined(undefined)).to.equal(true);
    });

    it("msngr.utils.isNullOrUndefined(obj) - obj is null", function () {
        expect(msngr.utils.isNullOrUndefined(null)).to.equal(true);
    });

    it("msngr.utils.isNullOrUndefined(obj) - obj is an object", function () {
        expect(msngr.utils.isNullOrUndefined({})).to.equal(false);
    });

    it("msngr.utils.isNullOrUndefined(obj) - obj is a number", function () {
        expect(msngr.utils.isNullOrUndefined(7)).to.equal(false);
    });

    it("msngr.utils.isNullOrUndefined(obj) - obj is an array", function () {
        expect(msngr.utils.isNullOrUndefined([])).to.equal(false);
    });

    it("msngr.utils.isNullOrUndefined(obj) - obj is a Date", function () {
        expect(msngr.utils.isNullOrUndefined(new Date())).to.equal(false);
    });

    // exist(obj)
    it("msngr.utils.exist(obj) - obj is a function", function () {
        expect(msngr.utils.exist(function () {})).to.equal(true);
    });

    it("msngr.utils.exist(obj) - obj is a string with content", function () {
        expect(msngr.utils.exist("test")).to.equal(true);
    });

    it("msngr.utils.exist(obj) - obj is an empty string", function () {
        expect(msngr.utils.exist("")).to.equal(true);
    });

    it("msngr.utils.exist(obj) - obj is a string with only whitespace", function () {
        expect(msngr.utils.exist(" ")).to.equal(true);
    });

    it("msngr.utils.exist(obj) - obj is undefined", function () {
        expect(msngr.utils.exist(undefined)).to.equal(false);
    });

    it("msngr.utils.exist(obj) - obj is null", function () {
        expect(msngr.utils.exist(null)).to.equal(false);
    });

    it("msngr.utils.exist(obj) - obj is an object", function () {
        expect(msngr.utils.exist({})).to.equal(true);
    });

    it("msngr.utils.exist(obj) - obj is a number", function () {
        expect(msngr.utils.exist(7)).to.equal(true);
    });

    it("msngr.utils.exist(obj) - obj is an array", function () {
        expect(msngr.utils.exist([])).to.equal(true);
    });

    it("msngr.utils.exist(obj) - obj is a Date", function () {
        expect(msngr.utils.exist(new Date())).to.equal(true);
    });

    // exists()
    it("msngr.utils.exists(...) - arguments are of various types", function () {
        expect(msngr.utils.exists("whatever", 15, true, false, { })).to.equal(true);
    });

    it("msngr.utils.exists(...) - arguments are of various types with an undefined item", function () {
        expect(msngr.utils.exists("whatever", 15, undefined, false, { })).to.equal(false);
    });

    it("msngr.utils.exists(...) - arguments are of various types with a null item", function () {
        expect(msngr.utils.exists(null, 15, true, false, { })).to.equal(false);
    });

    // isString(str)
    it("msngr.utils.isString(str) - obj is a function", function () {
        expect(msngr.utils.isString(function () {})).to.equal(false);
    });

    it("msngr.utils.isString(str) - obj is a string with content", function () {
        expect(msngr.utils.isString("test")).to.equal(true);
    });

    it("msngr.utils.isString(str) - obj is an empty string", function () {
        expect(msngr.utils.isString("")).to.equal(true);
    });

    it("msngr.utils.isString(str) - obj is a string with only whitespace", function () {
        expect(msngr.utils.isString(" ")).to.equal(true);
    });

    it("msngr.utils.isString(str) - obj is undefined", function () {
        expect(msngr.utils.isString(undefined)).to.equal(false);
    });

    it("msngr.utils.isString(str) - obj is null", function () {
        expect(msngr.utils.isString(null)).to.equal(false);
    });

    it("msngr.utils.isString(str) - obj is an object", function () {
        expect(msngr.utils.isString({})).to.equal(false);
    });

    it("msngr.utils.isString(str) - obj is a number", function () {
        expect(msngr.utils.isString(7)).to.equal(false);
    });

    it("msngr.utils.isString(str) - obj is an array", function () {
        expect(msngr.utils.isString([])).to.equal(false);
    });

    it("msngr.utils.isString(str) - obj is a Date", function () {
        expect(msngr.utils.isString(new Date())).to.equal(false);
    });

    // isDate(obj)
    it("msngr.utils.isDate(obj) - obj is a function", function () {
        expect(msngr.utils.isDate(function () {})).to.equal(false);
    });

    it("msngr.utils.isDate(obj) - obj is a string with content", function () {
        expect(msngr.utils.isDate("test")).to.equal(false);
    });

    it("msngr.utils.isDate(obj) - obj is an empty string", function () {
        expect(msngr.utils.isDate("")).to.equal(false);
    });

    it("msngr.utils.isDate(obj) - obj is a string with only whitespace", function () {
        expect(msngr.utils.isDate(" ")).to.equal(false);
    });

    it("msngr.utils.isDate(obj) - obj is undefined", function () {
        expect(msngr.utils.isDate(undefined)).to.equal(false);
    });

    it("msngr.utils.isDate(obj) - obj is null", function () {
        expect(msngr.utils.isDate(null)).to.equal(false);
    });

    it("msngr.utils.isDate(obj) - obj is an object", function () {
        expect(msngr.utils.isDate({})).to.equal(false);
    });

    it("msngr.utils.isDate(obj) - obj is a number", function () {
        expect(msngr.utils.isDate(7)).to.equal(false);
    });

    it("msngr.utils.isDate(obj) - obj is an array", function () {
        expect(msngr.utils.isDate([])).to.equal(false);
    });

    it("msngr.utils.isDate(obj) - obj is a Date", function () {
        expect(msngr.utils.isDate(new Date())).to.equal(true);
    });

    // isArray(obj)
    it("msngr.utils.isArray(obj) - obj is a function", function () {
        expect(msngr.utils.isArray(function () {})).to.equal(false);
    });

    it("msngr.utils.isArray(obj) - obj is a string with content", function () {
        expect(msngr.utils.isArray("test")).to.equal(false);
    });

    it("msngr.utils.isArray(obj) - obj is an empty string", function () {
        expect(msngr.utils.isArray("")).to.equal(false);
    });

    it("msngr.utils.isArray(obj) - obj is a string with only whitespace", function () {
        expect(msngr.utils.isArray(" ")).to.equal(false);
    });

    it("msngr.utils.isArray(obj) - obj is undefined", function () {
        expect(msngr.utils.isArray(undefined)).to.equal(false);
    });

    it("msngr.utils.isArray(obj) - obj is null", function () {
        expect(msngr.utils.isArray(null)).to.equal(false);
    });

    it("msngr.utils.isArray(obj) - obj is an object", function () {
        expect(msngr.utils.isArray({})).to.equal(false);
    });

    it("msngr.utils.isArray(obj) - obj is a number", function () {
        expect(msngr.utils.isArray(7)).to.equal(false);
    });

    it("msngr.utils.isArray(obj) - obj is an array", function () {
        expect(msngr.utils.isArray([])).to.equal(true);
    });

    it("msngr.utils.isArray(obj) - obj is a Date", function () {
        expect(msngr.utils.isArray(new Date())).to.equal(false);
    });

    // isNumber(obj)
    it("msngr.utils.isNumber(obj) - obj is a function", function () {
        expect(msngr.utils.isNumber(function () {})).to.equal(false);
    });

    it("msngr.utils.isNumber(obj) - obj is a string with content", function () {
        expect(msngr.utils.isNumber("test")).to.equal(false);
    });

    it("msngr.utils.isNumber(obj) - obj is an empty string", function () {
        expect(msngr.utils.isNumber("")).to.equal(false);
    });

    it("msngr.utils.isNumber(obj) - obj is a string with only whitespace", function () {
        expect(msngr.utils.isNumber(" ")).to.equal(false);
    });

    it("msngr.utils.isNumber(obj) - obj is undefined", function () {
        expect(msngr.utils.isNumber(undefined)).to.equal(false);
    });

    it("msngr.utils.isNumber(obj) - obj is null", function () {
        expect(msngr.utils.isNumber(null)).to.equal(false);
    });

    it("msngr.utils.isNumber(obj) - obj is an object", function () {
        expect(msngr.utils.isNumber({})).to.equal(false);
    });

    it("msngr.utils.isNumber(obj) - obj is a number", function () {
        expect(msngr.utils.isNumber(7)).to.equal(true);
    });

    it("msngr.utils.isNumber(obj) - obj is an array", function () {
        expect(msngr.utils.isNumber([])).to.equal(false);
    });

    it("msngr.utils.isNumber(obj) - obj is a Date", function () {
        expect(msngr.utils.isNumber(new Date())).to.equal(false);
    });

    // isObject(obj)
    it("msngr.utils.isObject(obj) - obj is a function", function () {
        expect(msngr.utils.isObject(function () {})).to.equal(false);
    });

    it("msngr.utils.isObject(obj) - obj is a string with content", function () {
        expect(msngr.utils.isObject("test")).to.equal(false);
    });

    it("msngr.utils.isObject(obj) - obj is an empty string", function () {
        expect(msngr.utils.isObject("")).to.equal(false);
    });

    it("msngr.utils.isObject(obj) - obj is a string with only whitespace", function () {
        expect(msngr.utils.isObject(" ")).to.equal(false);
    });

    it("msngr.utils.isObject(obj) - obj is undefined", function () {
        expect(msngr.utils.isObject(undefined)).to.equal(false);
    });

    it("msngr.utils.isObject(obj) - obj is null", function () {
        expect(msngr.utils.isObject(null)).to.equal(false);
    });

    it("msngr.utils.isObject(obj) - obj is an object", function () {
        expect(msngr.utils.isObject({})).to.equal(true);
    });

    it("msngr.utils.isObject(obj) - obj is a number", function () {
        expect(msngr.utils.isObject(7)).to.equal(false);
    });

    it("msngr.utils.isObject(obj) - obj is an array", function () {
        expect(msngr.utils.isObject([])).to.equal(false);
    });

    it("msngr.utils.isObject(obj) - obj is a Date", function () {
        expect(msngr.utils.isObject(new Date())).to.equal(false);
    });

    // isFunction(func)
    it("msngr.utils.isFunction(func) - obj is a function", function () {
        expect(msngr.utils.isFunction(function () {})).to.equal(true);
    });

    it("msngr.utils.isFunction(func) - obj is a string with content", function () {
        expect(msngr.utils.isFunction("test")).to.equal(false);
    });

    it("msngr.utils.isFunction(func) - obj is an empty string", function () {
        expect(msngr.utils.isFunction("")).to.equal(false);
    });

    it("msngr.utils.isFunction(func) - obj is a string with only whitespace", function () {
        expect(msngr.utils.isFunction(" ")).to.equal(false);
    });

    it("msngr.utils.isFunction(func) - obj is undefined", function () {
        expect(msngr.utils.isFunction(undefined)).to.equal(false);
    });

    it("msngr.utils.isFunction(func) - obj is null", function () {
        expect(msngr.utils.isFunction(null)).to.equal(false);
    });

    it("msngr.utils.isFunction(func) - obj is an object", function () {
        expect(msngr.utils.isFunction({})).to.equal(false);
    });

    it("msngr.utils.isFunction(func) - obj is a number", function () {
        expect(msngr.utils.isFunction(7)).to.equal(false);
    });

    it("msngr.utils.isFunction(func) - obj is an array", function () {
        expect(msngr.utils.isFunction([])).to.equal(false);
    });

    it("msngr.utils.isFunction(func) - obj is a Date", function () {
        expect(msngr.utils.isFunction(new Date())).to.equal(false);
    });

    // isEmptyString(str)
    it("msngr.utils.isEmptyString(str) - str is a function", function () {
        expect(msngr.utils.isEmptyString(function () {})).to.equal(false);
    });

    it("msngr.utils.isEmptyString(str) - str is a string with content", function () {
        expect(msngr.utils.isEmptyString("test")).to.equal(false);
    });

    it("msngr.utils.isEmptyString(str) - str is an empty string", function () {
        expect(msngr.utils.isEmptyString("")).to.equal(true);
    });

    it("msngr.utils.isEmptyString(str) - str is a string with only whitespace", function () {
        expect(msngr.utils.isEmptyString(" ")).to.equal(true);
    });

    it("msngr.utils.isEmptyString(str) - str is undefined", function () {
        expect(msngr.utils.isEmptyString(undefined)).to.equal(true);
    });

    it("msngr.utils.isEmptyString(str) - str is null", function () {
        expect(msngr.utils.isEmptyString(null)).to.equal(true);
    });

    it("msngr.utils.isEmptyString(str) - str is an object", function () {
        expect(msngr.utils.isEmptyString({})).to.equal(false);
    });

    it("msngr.utils.isEmptyString(str) - str is a number", function () {
        expect(msngr.utils.isEmptyString(7)).to.equal(false);
    });

    it("msngr.utils.isEmptyString(str) - str is an array", function () {
        expect(msngr.utils.isEmptyString([])).to.equal(false);
    });

    it("msngr.utils.isEmptyString(str) - str is a Date", function () {
        expect(msngr.utils.isEmptyString(new Date())).to.equal(false);
    });

    // hasWildCard(str)
    it("msngr.utils.hasWildCard(str)", function () {
        expect(msngr.utils.hasWildCard("whatever")).to.equal(false);
        expect(msngr.utils.hasWildCard("")).to.equal(false);
        expect(msngr.utils.hasWildCard("what*")).to.equal(true);
    });

    // reiterativeValidation(func, inputs)
    it("msngr.utils.reiterativeValidation(func, inputs) - func is undefined", function () {
        expect(msngr.utils.reiterativeValidation(undefined, [true, false, 15, "534"])).to.equal(false);
    });

    it("msngr.utils.reiterativeValidation(func, inputs) - inputs is undefined", function () {
        expect(msngr.utils.reiterativeValidation(msngr.utils.exists, undefined)).to.equal(false);
    });

    it("msngr.utils.reiterativeValidation(func, inputs) - func is msngr.utils.exists and inputs is a single value", function () {
        expect(msngr.utils.reiterativeValidation(msngr.utils.exists, true)).to.equal(true);
        expect(msngr.utils.reiterativeValidation(msngr.utils.exists, undefined)).to.equal(false);
        expect(msngr.utils.reiterativeValidation(msngr.utils.exists, null)).to.equal(false);
    });

    it("msngr.utils.reiterativeValidation(func, inputs) - func is msngr.utils.exists and inputs are various values", function () {
        expect(msngr.utils.reiterativeValidation(msngr.utils.exists, [true, false, 15, "534"])).to.equal(true);
        expect(msngr.utils.reiterativeValidation(msngr.utils.exists, [undefined, false, 15, "534"])).to.equal(false);
        expect(msngr.utils.reiterativeValidation(msngr.utils.exists, [true, undefined, 15, "534"])).to.equal(false);
    });

    // exists()
    it("msngr.utils.exists()", function () {
        expect(msngr.utils.exists({}, [], "something", 12)).to.equal(true);
        expect(msngr.utils.exists({}, null, "something", 12)).to.equal(false);
        expect(msngr.utils.exists({}, [], undefined, 12)).to.equal(false);
        expect(msngr.utils.exists(null, undefined, null)).to.equal(false);
    });

    // areStrings()
    it("msngr.utils.areStrings()", function () {
        expect(msngr.utils.areStrings("Whatever", "Totes!", "Chickens")).to.equal(true);
        expect(msngr.utils.areStrings("Whatever", undefined, "Chickens")).to.equal(false);
        expect(msngr.utils.areStrings("Whatever", null, "Chickens")).to.equal(false);
        expect(msngr.utils.areStrings("Whatever", "Totes!", 5)).to.equal(false);
    });

    // areDates()
    it("msngr.utils.areDates()", function () {
        expect(msngr.utils.areDates((new Date()), (new Date()))).to.equal(true);
        expect(msngr.utils.areDates((new Date()), undefined, "Chickens")).to.equal(false);
        expect(msngr.utils.areDates((new Date()), null, "Chickens")).to.equal(false);
        expect(msngr.utils.areDates((new Date()), "Totes!", 5)).to.equal(false);
    });

    // areNumbers()
    it("msngr.utils.areNumbers()", function () {
        expect(msngr.utils.areNumbers(15, 12, 90000, -1)).to.equal(true);
        expect(msngr.utils.areNumbers(15, undefined, 90000, -1)).to.equal(false);
        expect(msngr.utils.areNumbers(15, 12, "whatever", -1)).to.equal(false);
    });

    // areArrays()
    it("msngr.utils.areArrays()", function () {
        expect(msngr.utils.areArrays([], [15, 45], ["test"])).to.equal(true);
        expect(msngr.utils.areArrays([], [15, 45], undefined)).to.equal(false);
        expect(msngr.utils.areArrays([], 0, ["test"])).to.equal(false);
    });

    // areObjects()
    it("msngr.utils.areObjects()", function () {
        expect(msngr.utils.areObjects({}, { k: true })).to.equal(true);
        expect(msngr.utils.areObjects({}, "CHICKENS FOR SALE")).to.equal(false);
        expect(msngr.utils.areObjects(null, { k: true })).to.equal(false);
    });

    // areFunctions()
    it("msngr.utils.areFunctions()", function () {
        expect(msngr.utils.areFunctions(function () {}, function () {})).to.equal(true);
        expect(msngr.utils.areFunctions("yup()", function () {})).to.equal(false);
        expect(msngr.utils.areFunctions(function () {}, undefined)).to.equal(false);
    });

    // areEmptyStrings()
    it("msngr.utils.areEmptyStrings()", function () {
        expect(msngr.utils.areEmptyStrings("", undefined, "  ")).to.equal(true);
        expect(msngr.utils.areEmptyStrings("", undefined, " a ")).to.equal(false);
        expect(msngr.utils.areEmptyStrings({ }, undefined, "  ")).to.equal(false);
    });
});
