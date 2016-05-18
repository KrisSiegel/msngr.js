if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./validators/is.js", function () {
    "use strict";

    it("msngr.is.browser - expects to return true when in a web browser", function () {
        expect(msngr.is.browser).to.equal(true);
    });

});
