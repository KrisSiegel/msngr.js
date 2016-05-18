if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../msngr");
}

describe("./main.js", function () {
    "use strict";

    it("msngr - expect object to exist", function () {
        expect(msngr).to.exist;
    });

    it("msngr.version - expect a version value to exist", function () {
        expect(msngr.version).to.exist;
        expect(msngr.version.length).to.be.above(0);
    });

    it("msngr.extend - calls a function passing in the appropriate interfaces", function () {
        expect(msngr.extend).to.exist;

        expect(msngr.fn1).to.not.exist;
        expect(msngr.fn2).to.not.exist;

        msngr.extend(function (external, internal) {
            expect(external).to.exist;
            expect(internal).to.exist;

            external.fn1 = function () { };
            internal.fn2 = function () { };
        });

        expect(msngr.fn1).to.exist;
        expect(msngr.fn2).to.not.exist;
    });

    it("msngr.debug - property setting exports internal object for testing and debugging", function () {
        msngr.debug = false;
        expect(msngr.internal).to.not.exist;
        expect(msngr.debug).to.equal(false);
        msngr.debug = true;
        expect(msngr.internal).to.exist;
        expect(msngr.debug).to.equal(true);
        msngr.debug = false;
        expect(msngr.internal).to.not.exist;
    });
});
