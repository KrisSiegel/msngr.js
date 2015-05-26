if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../msngr");
}

describe("./docs/extending and hacking.md", function () {
    "use strict";

    before(function () {
        msngr.debug = true;
    });

    beforeEach(function () {
        msngr.internal.reset();
    });

    after(function () {
        msngr.debug = false;
    });
});
