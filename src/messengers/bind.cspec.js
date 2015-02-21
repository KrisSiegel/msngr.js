if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./messengers/bind.js", function () {
    it("msngr.bind(element, event, message) / msngr.unbind(element, event)", function (done) {
        var div1 = document.createElement("div");
        var div2 = document.createElement("div");
        var div3 = document.createElement("div");

        msngr.bind(div1, "testEvent1", { topic: "Topical1" });
        msngr.bind(div1, "testEvent2", { topic: "Topical2" });

        msngr.register({ topic: "Topical1" }, function (payload) {
            expect(payload).to.exist;

            expect(msngr.getBindCount()).to.equal(2);
            msngr.unbind(div1, "testEvent1");
            expect(msngr.getBindCount()).to.equal(1);

            done();
        });

        var testEvent1 = document.createEvent('CustomEvent');
        testEvent1.initCustomEvent('testEvent1', false, false, null);
        div1.dispatchEvent(testEvent1);

    });
});
