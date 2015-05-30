if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./options/cross-window.js", function () {
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

    it("msngr().option('cross-window') - sends a message between different tabs or windows", function (done) {
        var crossWindowVerifierPath = (window.specRunner.indexOf(".min.html") === -1) ? "crossWindowVerifier.html" : "crossWindowVerifier.min.html";
        var test1 = false;
        var test2 = false;
        var test3 = false;

        var iframe = document.createElement("iframe");
        var msg = msngr("CrossWindow", "Message");
        msg.on(function (payload) {
            if (payload === "VerificationCrossTest1") {
                test1 = true;
            }

            if (payload === "VerificationCrossTest2") {
                test2 = true;
            }

            if (payload === "VerificationCrossTest3") {
                test3 = true;
            }

            if (test1 && test2 && test3) {
                document.querySelector("body").removeChild(iframe);
                done();
            }
        });

        iframe.setAttribute("src", crossWindowVerifierPath);
        document.querySelector("body").appendChild(iframe);
    });
});
