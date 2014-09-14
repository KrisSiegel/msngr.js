if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../msngr");
}

describe("register.js", function () {
    it("msngr.register() throws", function () {
        expect(msngr.register).throws();
    });

    it("msngr.unregister() removes", function () {
        var uniqueKey = Math.floor(Math.random() * 1000);
        
        var method = msngr.register("test100_" + uniqueKey, function () {
            throw "test failure";
        }, this);
        expect(method).to.not.equal(undefined);
        msngr.unregister(method);
        msngr.emit("test100_" + uniqueKey);
    });
});
