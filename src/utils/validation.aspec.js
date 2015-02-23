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
});
