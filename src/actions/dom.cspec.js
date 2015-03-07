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

    it("dom action - gathers multiple values with a selector that matches multiple elements", function (done) {
        var input1 = document.createElement("input");
        input1.setAttribute("name", "Name");
        input1.value = "Kris";

        var input2 = document.createElement("input");
        input2.setAttribute("name", "Email");
        input2.value = "AnEmail@Address.here";

        document.body.appendChild(input1);
        document.body.appendChild(input2);

        msngr.on("TestTopic", function (payload) {
            console.log(payload);
            expect(payload).to.exist;
            expect(payload["Name"]).to.exist;
            expect(payload["Name"]).to.equal("Kris");
            expect(payload["Email"]).to.exist;
            expect(payload["Email"]).to.equal("AnEmail@Address.here");

            document.body.removeChild(input1);
            document.body.removeChild(input2);

            done();
        });

        msngr.emit({ topic: "TestTopic", dom: ["input"] });
    });
});
