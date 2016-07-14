if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./messaging/middleware.js", function() {
    "use strict";

    before(function() {
        msngr.debug = true;
    });

    beforeEach(function() {
        msngr.internal.reset();
    });

    after(function() {
        msngr.debug = false;
    });

    it("msngr.middleware() / msngr.unmiddleware() - Works as expected to add and remove a middleware", function () {
        var initialCount = msngr.internal.getMiddlewares().length;
        msngr.middleware("mytest", function () { return 42; }, true);

        expect(msngr.internal.getMiddlewares().length).to.be.greaterThan(initialCount);
        msngr.unmiddleware("mytest");
        expect(msngr.internal.getMiddlewares().length).to.equal(initialCount);

        msngr.middleware("whatever", function () { return 42; }, false);
        expect(msngr.internal.getMiddlewares().length).to.equal(initialCount);
        expect(msngr.internal.getMiddlewares(["whatever"]).length).to.be.greaterThan(initialCount);
        msngr.unmiddleware("whatever");
        expect(msngr.internal.getMiddlewares(["whatever"]).length).to.equal(initialCount);
    });

    it("msngr.middleware() - Executes forced middleware over all messages", function (done) {
        msngr.middleware("forcedTest", function (payload, async) {
            return "middle";
        }, true);

        msngr("mytopic").on(function (payload, message) {
            expect(payload).to.equal("middle");
            msngr.unmiddleware("forcedTest");
            done();
        }).emit("test");
    });

    it("msngr.middleware() - Doesn't execute non-forced middleware over all messages", function (done) {
        msngr.middleware("nonforcedTest", function (payload, async) {
            return "middle";
        }, false);

        msngr("mytopic").on(function (payload, message) {
            expect(payload).to.equal("test");
            msngr.unmiddleware("nonforcedTest");
            done();
        }).emit("test");
    });

    it("msngr.middleware() - Executes optional middleware over specified message", function (done) {
        msngr.middleware("middleTest", function (payload, async) {
            return "middle";
        }, false);

        msngr("mytopic").use("middleTest").on(function (payload, message) {
            expect(payload).to.equal("middle");
            msngr.unmiddleware("middleTest");
            done();
        }).emit("test");
    });

});
