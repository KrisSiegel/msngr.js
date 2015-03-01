if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./actions/dom.js", function () {
    "use strict";

    beforeEach(function (done) {
        msngr.dropAll();
        done();
    });

    it("dom.gather gathers element values", function (done) {
        var input = document.createElement("input");
        input.setAttribute("name", "Name");
        input.value = "Kris";

        document.body.appendChild(input);

        msngr.on("TestTopic", function (payload) {
            expect(payload).to.exist;
            expect(payload.gathered).to.exist;
            expect(payload.gathered["Name"]).to.exist;
            expect(payload.gathered["Name"]).to.equal("Kris");

            document.body.removeChild(input);

            done();
        });

        msngr.emit({ topic: "TestTopic", dom: { gather: ["input"] }}, { });
    });

});
