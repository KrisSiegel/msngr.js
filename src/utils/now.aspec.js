if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./utils/now.js", function () {
    "use strict";

    it("msngr.now() - generates a value", function() {
        expect(msngr.now()).to.exist;
    });

    it("msngr.now(true) - 5 consecutive calls have unique values", function() {
        var t1 = msngr.now(true);
        var t2 = msngr.now(true);
        var t3 = msngr.now(true);
        var t4 = msngr.now(true);
        var t5 = msngr.now(true);

        expect(t1).to.exist;
        expect(t2).to.exist;
        expect(t3).to.exist;
        expect(t4).to.exist;
        expect(t5).to.exist;

        expect(t2).to.not.equal(t1);
        expect(t3).to.not.equal(t2);
        expect(t4).to.not.equal(t3);
        expect(t5).to.not.equal(t4);
    });

    it("msngr.now('sdfkjsdfl') - Correctly handles invalid input", function() {
        var t = msngr.now("sdfkjsdfl");

        expect(t).to.exist;
    });

});
