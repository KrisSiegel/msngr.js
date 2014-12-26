if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("utils/exceptional.js", function () {
    it("msngr.utils.ThrowNotImplementedException()", function () {
        expect(msngr.utils.ThrowNotImplementedException).to.throw();
    });

    it("msngr.utils.ThrowRequiredParameterMissingOrUndefinedException()", function () {
        expect(msngr.utils.ThrowRequiredParameterMissingOrUndefinedException).to.throw();
    });
});
