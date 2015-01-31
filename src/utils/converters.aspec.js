if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("utils/converters.js", function () {
    "use strict";
    
    it("msngr.utils.argumentsToArray(args)", function () {
        var func1 = function () {
            var args = msngr.utils.argumentsToArray(arguments);
            expect(args.length).to.equal(3);
        }

        var func2 = function () {
            var args = msngr.utils.argumentsToArray(arguments);
            expect(args.length).to.equal(1);
        }

        var func3 = function () {
            var args = msngr.utils.argumentsToArray(arguments);
            expect(args.length).to.equal(0);
        }

        func1("whatever", "something", "weee");
        func2("foobar");
        func3();
    });
});
