if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./utils/misc.js", function() {
    "use strict";

    it("msngr.isBrowser() - returns true when running in the browser", function() {
        expect(msngr.isBrowser()).to.equal(true);
    });
});
