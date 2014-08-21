if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("utils/ensure.js", function () {
    it("msngr.utils.ensureMessage(message)", function () {
        expect(msngr.utils.ensureMessage("MyTopic").topic, "MyTopic");
        expect(msngr.utils.ensureMessage({ topic: "MyTopic" }).topic, "MyTopic");
    });
});
