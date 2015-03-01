if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./actions/action.js", function () {
    "use strict";

    beforeEach(function (done) {
        msngr.dropAll();
        done();
    });

    it("msngr.action('poke', function () { }) adds poke to payload", function (done) {
        msngr.on("TestTopic", function (payload) {
            expect(payload).to.exist;
            expect(payload).to.equal("Payload Poke!");

            expect(msngr.getActionCount()).to.exist;
            var c = msngr.getActionCount();
            msngr.inaction("poke");
            expect(msngr.getActionCount()).to.equal(c - 1);

            done();
        });

        expect(msngr.getActionCount()).to.exist;
        msngr.action("poke", function (message, wrap) {
            wrap.payload = wrap.payload + " Poke!";
        });

        msngr.emit({ topic: "TestTopic" , poke: true }, "Payload");
    });

});
