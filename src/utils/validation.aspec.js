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

    it("msngr.utils.isNullOrUndefined(obj)", function () {
        expect(msngr.utils.isNullOrUndefined("test")).to.equal(false);
        expect(msngr.utils.isNullOrUndefined("")).to.equal(false);
        expect(msngr.utils.isNullOrUndefined(undefined)).to.equal(true);
        expect(msngr.utils.isNullOrUndefined(null)).to.equal(true);
        expect(msngr.utils.isNullOrUndefined({})).to.equal(false);
        expect(msngr.utils.isNullOrUndefined(7)).to.equal(false);
        expect(msngr.utils.isNullOrUndefined([])).to.equal(false);
        expect(msngr.utils.isNullOrUndefined(new Date())).to.equal(false);
        expect(msngr.utils.isNullOrUndefined(function () {})).to.equal(false);
    });

    it("msngr.utils.isString(obj)", function () {
        expect(msngr.utils.isString("test")).to.equal(true);
        expect(msngr.utils.isString("")).to.equal(true);
        expect(msngr.utils.isString(undefined)).to.equal(false);
        expect(msngr.utils.isString(null)).to.equal(false);
        expect(msngr.utils.isString({})).to.equal(false);
        expect(msngr.utils.isString(7)).to.equal(false);
        expect(msngr.utils.isString([])).to.equal(false);
        expect(msngr.utils.isString(new Date())).to.equal(false);
        expect(msngr.utils.isString(function () {})).to.equal(false);
    });

    it("msngr.utils.isObject(obj)", function () {
        expect(msngr.utils.isObject("test")).to.equal(false);
        expect(msngr.utils.isObject("")).to.equal(false);
        expect(msngr.utils.isObject(undefined)).to.equal(false);
        expect(msngr.utils.isObject(null)).to.equal(false);
        expect(msngr.utils.isObject({})).to.equal(true);
        expect(msngr.utils.isObject(7)).to.equal(false);
        expect(msngr.utils.isObject([])).to.equal(false);
        expect(msngr.utils.isObject(new Date())).to.equal(false);
        expect(msngr.utils.isObject(function () {})).to.equal(false);
    });

    it("msngr.utils.isNumber(obj)", function () {
        expect(msngr.utils.isNumber("test")).to.equal(false);
        expect(msngr.utils.isNumber("")).to.equal(false);
        expect(msngr.utils.isNumber(undefined)).to.equal(false);
        expect(msngr.utils.isNumber(null)).to.equal(false);
        expect(msngr.utils.isNumber({})).to.equal(false);
        expect(msngr.utils.isNumber(7)).to.equal(true);
        expect(msngr.utils.isNumber([])).to.equal(false);
        expect(msngr.utils.isNumber(new Date())).to.equal(false);
        expect(msngr.utils.isNumber(function () {})).to.equal(false);
    });

    it("msngr.utils.isDate(obj)", function () {
        expect(msngr.utils.isDate("test")).to.equal(false);
        expect(msngr.utils.isDate("")).to.equal(false);
        expect(msngr.utils.isDate(undefined)).to.equal(false);
        expect(msngr.utils.isDate(null)).to.equal(false);
        expect(msngr.utils.isDate({})).to.equal(false);
        expect(msngr.utils.isDate(7)).to.equal(false);
        expect(msngr.utils.isDate([])).to.equal(false);
        expect(msngr.utils.isDate(new Date())).to.equal(true);
        expect(msngr.utils.isDate(function () {})).to.equal(false);
    });

    it("msngr.utils.isFunction(obj)", function () {
        expect(msngr.utils.isFunction(function () {})).to.equal(true);
        expect(msngr.utils.isFunction("test")).to.equal(false);
        expect(msngr.utils.isFunction("")).to.equal(false);
        expect(msngr.utils.isFunction(undefined)).to.equal(false);
        expect(msngr.utils.isFunction(null)).to.equal(false);
        expect(msngr.utils.isFunction({})).to.equal(false);
        expect(msngr.utils.isFunction(7)).to.equal(false);
        expect(msngr.utils.isFunction([])).to.equal(false);
        expect(msngr.utils.isFunction(new Date())).to.equal(false);
    });

    it("msngr.utils.isArray(obj)", function () {
        expect(msngr.utils.isArray(function () {})).to.equal(false);
        expect(msngr.utils.isArray("test")).to.equal(false);
        expect(msngr.utils.isArray("")).to.equal(false);
        expect(msngr.utils.isArray(undefined)).to.equal(false);
        expect(msngr.utils.isArray(null)).to.equal(false);
        expect(msngr.utils.isArray({})).to.equal(false);
        expect(msngr.utils.isArray(7)).to.equal(false);
        expect(msngr.utils.isArray(new Date())).to.equal(false);
        expect(msngr.utils.isArray(new Array)).to.equal(true);
        expect(msngr.utils.isArray([])).to.equal(true);
        expect(msngr.utils.isArray([1,2,3,4,5])).to.equal(true);
    });

    it("msngr.utils.getType(obj)", function () {
        expect(msngr.utils.getType(function () {})).to.equal("[object Function]");
        expect(msngr.utils.getType("test")).to.equal("[object String]");
    });

    it("msngr.utils.isEmptyString(str)", function () {
        expect(msngr.utils.isEmptyString(function () {})).to.equal(false);
        expect(msngr.utils.isEmptyString("test")).to.equal(false);
        expect(msngr.utils.isEmptyString("")).to.equal(true);
        expect(msngr.utils.isEmptyString(undefined)).to.equal(true);
        expect(msngr.utils.isEmptyString(null)).to.equal(true);
        expect(msngr.utils.isEmptyString({})).to.equal(false);
        expect(msngr.utils.isEmptyString(7)).to.equal(false);
        expect(msngr.utils.isEmptyString([])).to.equal(false);
        expect(msngr.utils.isEmptyString(new Date())).to.equal(false);
    });
});
