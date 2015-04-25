if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./utils/exceptional.js", function () {
    "use strict";

    before(function () {
        msngr.debug = true;
    });

    after(function () {
        msngr.debug = false;
    });

});
