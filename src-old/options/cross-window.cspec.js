if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./options/cross-window.js", function() {
    "use strict";

    this.timeout(60000);

    before(function() {
        msngr.debug = true;
    });

    beforeEach(function() {
        msngr.internal.reset();
    });

    after(function() {
        msngr.debug = false;
    });

    it("msngr().option('cross-window') - sends a 100 messages between different tabs or windows", function(done) {
        var crossWindowVerifierPath = (window.specRunner.indexOf(".min.html") === -1) ? "crossWindowVerifier.html" : "crossWindowVerifier.min.html";
        var testCounts = 0;
        var observedTests = {};

        var iframe = document.createElement("iframe");
        var msg = msngr("CrossWindow", "Message");
        msg.on(function(payload) {
            expect(payload).to.exist;
            expect(payload.data.meaningOfLife).to.equal(42);
            expect(payload.data.OPDelivers).to.equal(false);
            expect(payload.data.text).to.equal("something");

            if (observedTests[payload.id] === undefined) {
                testCounts++;
                observedTests[payload.id] = payload;
            }

            if (testCounts === 100) {
                document.querySelector("body").removeChild(iframe);
                done();
            }
        });

        iframe.setAttribute("src", crossWindowVerifierPath);
        document.querySelector("body").appendChild(iframe);
    });
});
