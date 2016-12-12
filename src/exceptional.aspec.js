if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../msngr");
}

describe("./exceptional.js", function () {
    "use strict";

    before(function() {
        msngr.debug = true;
    });

    after(function() {
        msngr.debug = false;
    });

    it("internal.InvalidParametersException creates a correct object as expected based on input", function () {
        expect(msngr.internal.InvalidParametersException("myFunc").name).to.equal("InvalidParametersException");
        expect(msngr.internal.InvalidParametersException("myFunc").severity).to.equal("unrecoverable");
        expect(msngr.internal.InvalidParametersException("myFunc").message).to.equal("Invalid parameters supplied to the myFunc method");
        expect(msngr.internal.InvalidParametersException("myFunc", "wut").message).to.equal("Invalid parameters supplied to the myFunc method wut");
    });

    it("internal.DuplicateException creates a correct object as expected based on input", function () {
        expect(msngr.internal.DuplicateException("myFunc").name).to.equal("DuplicateException");
        expect(msngr.internal.DuplicateException("myFunc").severity).to.equal("unrecoverable");
        expect(msngr.internal.DuplicateException("myFunc").message).to.equal("Duplicate input provided to myFunc where duplicates are not allowed.");
    });

    it("internal.ReservedKeywordsException creates a correct object as expected based on input", function () {
        expect(msngr.internal.ReservedKeywordsException("myKeyword").name).to.equal("ReservedKeywordsException");
        expect(msngr.internal.ReservedKeywordsException("myKeyword").severity).to.equal("unrecoverable");
        expect(msngr.internal.ReservedKeywordsException("myKeyword").message).to.equal("Reserved keyword myKeyword supplied as action.");
    });

    it("internal.MangledException creates a correct object as expected based on input", function () {
        expect(msngr.internal.MangledException("myVar", "myFunc").name).to.equal("MangledException");
        expect(msngr.internal.MangledException("myVar", "myFunc").severity).to.equal("unrecoverable");
        expect(msngr.internal.MangledException("myVar", "myFunc").message).to.equal("The myVar was unexpectedly mangled in myFunc.");
    });
});
