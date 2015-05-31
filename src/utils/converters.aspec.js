if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./utils/converters.js", function () {
    "use strict";

    it("msngr.argumentsToArray(args) - 0 arguments", function () {
        var func = function () {
            var args = msngr.argumentsToArray(arguments);
            expect(args.length).to.equal(0);
        }

        func();
    });

    it("msngr.argumentsToArray(args) - 3 arguments", function () {
        var func = function () {
            var args = msngr.argumentsToArray(arguments);
            expect(args.length).to.equal(3);
        }

        func(1, 2, 3);
    });

    it("msngr.argumentsToArray(args) - 15 arguments", function () {
        var func = function () {
            var args = msngr.argumentsToArray(arguments);
            expect(args.length).to.equal(15);
        }

        func(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
    });
});
