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

    it("msngr.utils.getType(obj) - obj is a HTMLDivElement", function () {
        expect(msngr.utils.getType(document.createElement("div"))).to.equal("[object HTMLDivElement]");
    });

    it("msngr.utils.getType(obj) - obj is a HTMLInputElement", function () {
        expect(msngr.utils.getType(document.createElement("input"))).to.equal("[object HTMLInputElement]");
    });

});
