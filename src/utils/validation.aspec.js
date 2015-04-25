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

    it("msngr.getType(obj) - obj is a function", function () {
        expect(msngr.getType(function () {})).to.equal("[object Function]");
    });

    it("msngr.getType(obj) - obj is a string", function () {
        expect(msngr.getType("test")).to.equal("[object String]");
    });

    it("msngr.getType(obj) - obj is a number", function () {
        expect(msngr.getType(42)).to.equal("[object Number]");
    });

    it("msngr.getType(obj) - obj is an array", function () {
        expect(msngr.getType([])).to.equal("[object Array]");
    });

    it("msngr.getType(obj) - obj is an object", function () {
        expect(msngr.getType({ })).to.equal("[object Object]");
    });

    it("msngr.getType(obj) - obj is undefined", function () {
        expect(msngr.getType(undefined)).to.equal("undefined");
    });

    it("msngr.getType(obj) - obj is null", function () {
        expect(msngr.getType(null)).to.equal("null");
    });

    // isArguments
    it("msngr.isArguments(obj) - obj is a function", function () {
        expect(msngr.isArguments(function () {})).to.equal(false);
    });

    it("msngr.isArguments(obj) - obj is a string with content", function () {
        expect(msngr.isArguments("test")).to.equal(false);
    });

    it("msngr.isArguments(obj) - obj is an empty string", function () {
        expect(msngr.isArguments("")).to.equal(false);
    });

    it("msngr.isArguments(obj) - obj is a string with only whitespace", function () {
        expect(msngr.isArguments(" ")).to.equal(false);
    });

    it("msngr.isArguments(obj) - obj is undefined", function () {
        expect(msngr.isArguments(undefined)).to.equal(false);
    });

    it("msngr.isArguments(obj) - obj is null", function () {
        expect(msngr.isArguments(null)).to.equal(false);
    });

    it("msngr.isArguments(obj) - obj is an object", function () {
        expect(msngr.isArguments({})).to.equal(false);
    });

    it("msngr.isArguments(obj) - obj is a number", function () {
        expect(msngr.isArguments(7)).to.equal(false);
    });

    it("msngr.isArguments(obj) - obj is an array", function () {
        expect(msngr.isArguments([])).to.equal(false);
    });

    it("msngr.isArguments(obj) - obj is a Date", function () {
        expect(msngr.isArguments(new Date())).to.equal(false);
    });

    it("msngr.isArguments(obj) - obj is an Arguments object", function () {
        var tFunc = function () {
            expect(msngr.isArguments(arguments)).to.equal(true);
        }

        tFunc("something", 15, "weee");
    });

    // isNullOrUndefined(obj)
    it("msngr.isNullOrUndefined(obj) - obj is a function", function () {
        expect(msngr.isNullOrUndefined(function () {})).to.equal(false);
    });

    it("msngr.isNullOrUndefined(obj) - obj is a string with content", function () {
        expect(msngr.isNullOrUndefined("test")).to.equal(false);
    });

    it("msngr.isNullOrUndefined(obj) - obj is an empty string", function () {
        expect(msngr.isNullOrUndefined("")).to.equal(false);
    });

    it("msngr.isNullOrUndefined(obj) - obj is a string with only whitespace", function () {
        expect(msngr.isNullOrUndefined(" ")).to.equal(false);
    });

    it("msngr.isNullOrUndefined(obj) - obj is undefined", function () {
        expect(msngr.isNullOrUndefined(undefined)).to.equal(true);
    });

    it("msngr.isNullOrUndefined(obj) - obj is null", function () {
        expect(msngr.isNullOrUndefined(null)).to.equal(true);
    });

    it("msngr.isNullOrUndefined(obj) - obj is an object", function () {
        expect(msngr.isNullOrUndefined({})).to.equal(false);
    });

    it("msngr.isNullOrUndefined(obj) - obj is a number", function () {
        expect(msngr.isNullOrUndefined(7)).to.equal(false);
    });

    it("msngr.isNullOrUndefined(obj) - obj is an array", function () {
        expect(msngr.isNullOrUndefined([])).to.equal(false);
    });

    it("msngr.isNullOrUndefined(obj) - obj is a Date", function () {
        expect(msngr.isNullOrUndefined(new Date())).to.equal(false);
    });

    // exist(obj)
    it("msngr.exist(obj) - obj is a function", function () {
        expect(msngr.exist(function () {})).to.equal(true);
    });

    it("msngr.exist(obj) - obj is a string with content", function () {
        expect(msngr.exist("test")).to.equal(true);
    });

    it("msngr.exist(obj) - obj is an empty string", function () {
        expect(msngr.exist("")).to.equal(true);
    });

    it("msngr.exist(obj) - obj is a string with only whitespace", function () {
        expect(msngr.exist(" ")).to.equal(true);
    });

    it("msngr.exist(obj) - obj is undefined", function () {
        expect(msngr.exist(undefined)).to.equal(false);
    });

    it("msngr.exist(obj) - obj is null", function () {
        expect(msngr.exist(null)).to.equal(false);
    });

    it("msngr.exist(obj) - obj is an object", function () {
        expect(msngr.exist({})).to.equal(true);
    });

    it("msngr.exist(obj) - obj is a number", function () {
        expect(msngr.exist(7)).to.equal(true);
    });

    it("msngr.exist(obj) - obj is an array", function () {
        expect(msngr.exist([])).to.equal(true);
    });

    it("msngr.exist(obj) - obj is a Date", function () {
        expect(msngr.exist(new Date())).to.equal(true);
    });

    // exists()
    it("msngr.exists(...) - arguments are of various types", function () {
        expect(msngr.exists("whatever", 15, true, false, { })).to.equal(true);
    });

    it("msngr.exists(...) - arguments are of various types with an undefined item", function () {
        expect(msngr.exists("whatever", 15, undefined, false, { })).to.equal(false);
    });

    it("msngr.exists(...) - arguments are of various types with a null item", function () {
        expect(msngr.exists(null, 15, true, false, { })).to.equal(false);
    });

    // isString(str)
    it("msngr.isString(str) - obj is a function", function () {
        expect(msngr.isString(function () {})).to.equal(false);
    });

    it("msngr.isString(str) - obj is a string with content", function () {
        expect(msngr.isString("test")).to.equal(true);
    });

    it("msngr.isString(str) - obj is an empty string", function () {
        expect(msngr.isString("")).to.equal(true);
    });

    it("msngr.isString(str) - obj is a string with only whitespace", function () {
        expect(msngr.isString(" ")).to.equal(true);
    });

    it("msngr.isString(str) - obj is undefined", function () {
        expect(msngr.isString(undefined)).to.equal(false);
    });

    it("msngr.isString(str) - obj is null", function () {
        expect(msngr.isString(null)).to.equal(false);
    });

    it("msngr.isString(str) - obj is an object", function () {
        expect(msngr.isString({})).to.equal(false);
    });

    it("msngr.isString(str) - obj is a number", function () {
        expect(msngr.isString(7)).to.equal(false);
    });

    it("msngr.isString(str) - obj is an array", function () {
        expect(msngr.isString([])).to.equal(false);
    });

    it("msngr.isString(str) - obj is a Date", function () {
        expect(msngr.isString(new Date())).to.equal(false);
    });

    // isDate(obj)
    it("msngr.isDate(obj) - obj is a function", function () {
        expect(msngr.isDate(function () {})).to.equal(false);
    });

    it("msngr.isDate(obj) - obj is a string with content", function () {
        expect(msngr.isDate("test")).to.equal(false);
    });

    it("msngr.isDate(obj) - obj is an empty string", function () {
        expect(msngr.isDate("")).to.equal(false);
    });

    it("msngr.isDate(obj) - obj is a string with only whitespace", function () {
        expect(msngr.isDate(" ")).to.equal(false);
    });

    it("msngr.isDate(obj) - obj is undefined", function () {
        expect(msngr.isDate(undefined)).to.equal(false);
    });

    it("msngr.isDate(obj) - obj is null", function () {
        expect(msngr.isDate(null)).to.equal(false);
    });

    it("msngr.isDate(obj) - obj is an object", function () {
        expect(msngr.isDate({})).to.equal(false);
    });

    it("msngr.isDate(obj) - obj is a number", function () {
        expect(msngr.isDate(7)).to.equal(false);
    });

    it("msngr.isDate(obj) - obj is an array", function () {
        expect(msngr.isDate([])).to.equal(false);
    });

    it("msngr.isDate(obj) - obj is a Date", function () {
        expect(msngr.isDate(new Date())).to.equal(true);
    });

    // isArray(obj)
    it("msngr.isArray(obj) - obj is a function", function () {
        expect(msngr.isArray(function () {})).to.equal(false);
    });

    it("msngr.isArray(obj) - obj is a string with content", function () {
        expect(msngr.isArray("test")).to.equal(false);
    });

    it("msngr.isArray(obj) - obj is an empty string", function () {
        expect(msngr.isArray("")).to.equal(false);
    });

    it("msngr.isArray(obj) - obj is a string with only whitespace", function () {
        expect(msngr.isArray(" ")).to.equal(false);
    });

    it("msngr.isArray(obj) - obj is undefined", function () {
        expect(msngr.isArray(undefined)).to.equal(false);
    });

    it("msngr.isArray(obj) - obj is null", function () {
        expect(msngr.isArray(null)).to.equal(false);
    });

    it("msngr.isArray(obj) - obj is an object", function () {
        expect(msngr.isArray({})).to.equal(false);
    });

    it("msngr.isArray(obj) - obj is a number", function () {
        expect(msngr.isArray(7)).to.equal(false);
    });

    it("msngr.isArray(obj) - obj is an array", function () {
        expect(msngr.isArray([])).to.equal(true);
    });

    it("msngr.isArray(obj) - obj is a Date", function () {
        expect(msngr.isArray(new Date())).to.equal(false);
    });

    // isNumber(obj)
    it("msngr.isNumber(obj) - obj is a function", function () {
        expect(msngr.isNumber(function () {})).to.equal(false);
    });

    it("msngr.isNumber(obj) - obj is a string with content", function () {
        expect(msngr.isNumber("test")).to.equal(false);
    });

    it("msngr.isNumber(obj) - obj is an empty string", function () {
        expect(msngr.isNumber("")).to.equal(false);
    });

    it("msngr.isNumber(obj) - obj is a string with only whitespace", function () {
        expect(msngr.isNumber(" ")).to.equal(false);
    });

    it("msngr.isNumber(obj) - obj is undefined", function () {
        expect(msngr.isNumber(undefined)).to.equal(false);
    });

    it("msngr.isNumber(obj) - obj is null", function () {
        expect(msngr.isNumber(null)).to.equal(false);
    });

    it("msngr.isNumber(obj) - obj is an object", function () {
        expect(msngr.isNumber({})).to.equal(false);
    });

    it("msngr.isNumber(obj) - obj is a number", function () {
        expect(msngr.isNumber(7)).to.equal(true);
    });

    it("msngr.isNumber(obj) - obj is an array", function () {
        expect(msngr.isNumber([])).to.equal(false);
    });

    it("msngr.isNumber(obj) - obj is a Date", function () {
        expect(msngr.isNumber(new Date())).to.equal(false);
    });

    // isObject(obj)
    it("msngr.isObject(obj) - obj is a function", function () {
        expect(msngr.isObject(function () {})).to.equal(false);
    });

    it("msngr.isObject(obj) - obj is a string with content", function () {
        expect(msngr.isObject("test")).to.equal(false);
    });

    it("msngr.isObject(obj) - obj is an empty string", function () {
        expect(msngr.isObject("")).to.equal(false);
    });

    it("msngr.isObject(obj) - obj is a string with only whitespace", function () {
        expect(msngr.isObject(" ")).to.equal(false);
    });

    it("msngr.isObject(obj) - obj is undefined", function () {
        expect(msngr.isObject(undefined)).to.equal(false);
    });

    it("msngr.isObject(obj) - obj is null", function () {
        expect(msngr.isObject(null)).to.equal(false);
    });

    it("msngr.isObject(obj) - obj is an object", function () {
        expect(msngr.isObject({})).to.equal(true);
    });

    it("msngr.isObject(obj) - obj is a number", function () {
        expect(msngr.isObject(7)).to.equal(false);
    });

    it("msngr.isObject(obj) - obj is an array", function () {
        expect(msngr.isObject([])).to.equal(false);
    });

    it("msngr.isObject(obj) - obj is a Date", function () {
        expect(msngr.isObject(new Date())).to.equal(false);
    });

    // isFunction(func)
    it("msngr.isFunction(func) - obj is a function", function () {
        expect(msngr.isFunction(function () {})).to.equal(true);
    });

    it("msngr.isFunction(func) - obj is a string with content", function () {
        expect(msngr.isFunction("test")).to.equal(false);
    });

    it("msngr.isFunction(func) - obj is an empty string", function () {
        expect(msngr.isFunction("")).to.equal(false);
    });

    it("msngr.isFunction(func) - obj is a string with only whitespace", function () {
        expect(msngr.isFunction(" ")).to.equal(false);
    });

    it("msngr.isFunction(func) - obj is undefined", function () {
        expect(msngr.isFunction(undefined)).to.equal(false);
    });

    it("msngr.isFunction(func) - obj is null", function () {
        expect(msngr.isFunction(null)).to.equal(false);
    });

    it("msngr.isFunction(func) - obj is an object", function () {
        expect(msngr.isFunction({})).to.equal(false);
    });

    it("msngr.isFunction(func) - obj is a number", function () {
        expect(msngr.isFunction(7)).to.equal(false);
    });

    it("msngr.isFunction(func) - obj is an array", function () {
        expect(msngr.isFunction([])).to.equal(false);
    });

    it("msngr.isFunction(func) - obj is a Date", function () {
        expect(msngr.isFunction(new Date())).to.equal(false);
    });

    // isEmptyString(str)
    it("msngr.isEmptyString(str) - str is a function", function () {
        expect(msngr.isEmptyString(function () {})).to.equal(false);
    });

    it("msngr.isEmptyString(str) - str is a string with content", function () {
        expect(msngr.isEmptyString("test")).to.equal(false);
    });

    it("msngr.isEmptyString(str) - str is an empty string", function () {
        expect(msngr.isEmptyString("")).to.equal(true);
    });

    it("msngr.isEmptyString(str) - str is a string with only whitespace", function () {
        expect(msngr.isEmptyString(" ")).to.equal(true);
    });

    it("msngr.isEmptyString(str) - str is undefined", function () {
        expect(msngr.isEmptyString(undefined)).to.equal(true);
    });

    it("msngr.isEmptyString(str) - str is null", function () {
        expect(msngr.isEmptyString(null)).to.equal(true);
    });

    it("msngr.isEmptyString(str) - str is an object", function () {
        expect(msngr.isEmptyString({})).to.equal(false);
    });

    it("msngr.isEmptyString(str) - str is a number", function () {
        expect(msngr.isEmptyString(7)).to.equal(false);
    });

    it("msngr.isEmptyString(str) - str is an array", function () {
        expect(msngr.isEmptyString([])).to.equal(false);
    });

    it("msngr.isEmptyString(str) - str is a Date", function () {
        expect(msngr.isEmptyString(new Date())).to.equal(false);
    });

    // hasWildCard(str)
    it("msngr.hasWildCard(str)", function () {
        expect(msngr.hasWildCard("whatever")).to.equal(false);
        expect(msngr.hasWildCard("")).to.equal(false);
        expect(msngr.hasWildCard("what*")).to.equal(true);
    });

    // reiterativeValidation(func, inputs)
    it("msngr.reiterativeValidation(func, inputs) - func is undefined", function () {
        expect(msngr.reiterativeValidation(undefined, [true, false, 15, "534"])).to.equal(false);
    });

    it("msngr.reiterativeValidation(func, inputs) - inputs is undefined", function () {
        expect(msngr.reiterativeValidation(msngr.exists, undefined)).to.equal(false);
    });

    it("msngr.reiterativeValidation(func, inputs) - func is msngr.exists and inputs is a single value", function () {
        expect(msngr.reiterativeValidation(msngr.exists, true)).to.equal(true);
        expect(msngr.reiterativeValidation(msngr.exists, undefined)).to.equal(false);
        expect(msngr.reiterativeValidation(msngr.exists, null)).to.equal(false);
    });

    it("msngr.reiterativeValidation(func, inputs) - func is msngr.exists and inputs are various values", function () {
        expect(msngr.reiterativeValidation(msngr.exists, [true, false, 15, "534"])).to.equal(true);
        expect(msngr.reiterativeValidation(msngr.exists, [undefined, false, 15, "534"])).to.equal(false);
        expect(msngr.reiterativeValidation(msngr.exists, [true, undefined, 15, "534"])).to.equal(false);
    });

    // exists()
    it("msngr.exists()", function () {
        expect(msngr.exists({}, [], "something", 12)).to.equal(true);
        expect(msngr.exists({}, null, "something", 12)).to.equal(false);
        expect(msngr.exists({}, [], undefined, 12)).to.equal(false);
        expect(msngr.exists(null, undefined, null)).to.equal(false);
    });

    // areStrings()
    it("msngr.areStrings()", function () {
        expect(msngr.areStrings("Whatever", "Totes!", "Chickens")).to.equal(true);
        expect(msngr.areStrings("Whatever", undefined, "Chickens")).to.equal(false);
        expect(msngr.areStrings("Whatever", null, "Chickens")).to.equal(false);
        expect(msngr.areStrings("Whatever", "Totes!", 5)).to.equal(false);
    });

    // areDates()
    it("msngr.areDates()", function () {
        expect(msngr.areDates((new Date()), (new Date()))).to.equal(true);
        expect(msngr.areDates((new Date()), undefined, "Chickens")).to.equal(false);
        expect(msngr.areDates((new Date()), null, "Chickens")).to.equal(false);
        expect(msngr.areDates((new Date()), "Totes!", 5)).to.equal(false);
    });

    // areNumbers()
    it("msngr.areNumbers()", function () {
        expect(msngr.areNumbers(15, 12, 90000, -1)).to.equal(true);
        expect(msngr.areNumbers(15, undefined, 90000, -1)).to.equal(false);
        expect(msngr.areNumbers(15, 12, "whatever", -1)).to.equal(false);
    });

    // areArrays()
    it("msngr.areArrays()", function () {
        expect(msngr.areArrays([], [15, 45], ["test"])).to.equal(true);
        expect(msngr.areArrays([], [15, 45], undefined)).to.equal(false);
        expect(msngr.areArrays([], 0, ["test"])).to.equal(false);
    });

    // areObjects()
    it("msngr.areObjects()", function () {
        expect(msngr.areObjects({}, { k: true })).to.equal(true);
        expect(msngr.areObjects({}, "CHICKENS FOR SALE")).to.equal(false);
        expect(msngr.areObjects(null, { k: true })).to.equal(false);
    });

    // areFunctions()
    it("msngr.areFunctions()", function () {
        expect(msngr.areFunctions(function () {}, function () {})).to.equal(true);
        expect(msngr.areFunctions("yup()", function () {})).to.equal(false);
        expect(msngr.areFunctions(function () {}, undefined)).to.equal(false);
    });

    // areEmptyStrings()
    it("msngr.areEmptyStrings()", function () {
        expect(msngr.areEmptyStrings("", undefined, "  ")).to.equal(true);
        expect(msngr.areEmptyStrings("", undefined, " a ")).to.equal(false);
        expect(msngr.areEmptyStrings({ }, undefined, "  ")).to.equal(false);
    });
});
