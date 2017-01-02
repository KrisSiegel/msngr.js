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
        msngr.middleware("forcedTest", function (payload, message, async) {
            console.log("in forcedTest middleware");
            console.log(payload);
            console.log(message);
            return "middle";
        }, true);

        msngr("mytopic").on(function (payload, message) {
            console.log("forcedtest on handler");
            console.log(msngr.internal.getMiddlewares());
            expect(payload).to.equal("middle");
            console.log("before 'forcedTest' unmiddleware");
            msngr.unmiddleware("forcedTest");
            console.log("after 'forcedTest' unmiddleware");
            done();
        }).emit("test");
    });

    it("msngr.middleware() - Executes async, forced middleware over all messages", function (done) {
        msngr.middleware("forcedTest", function (payload, message, async) {
            async()("midd");
        }, true);

        msngr("mytopic").on(function (payload, message) {
            expect(payload).to.equal("midd");
            msngr.unmiddleware("forcedTest");
            done();
        }).emit("test");
    });

    it("msngr.middleware() - Doesn't execute non-forced middleware over all messages", function (done) {
        msngr.middleware("nonforcedTest", function (payload, message, async) {
            return "middle";
        }, false);

        msngr("mytopic").on(function (payload, message) {
            expect(payload).to.equal("test");
            msngr.unmiddleware("nonforcedTest");
            done();
        }).emit("test");
    });

    it("msngr.middleware() - Doesn't execute async, non-forced middleware over all messages", function (done) {
        msngr.middleware("nonforcedTest", function (payload, message, async) {
            async()("wut");
        }, false);

        msngr("mytopic").on(function (payload, message) {
            expect(payload).to.equal("test");
            msngr.unmiddleware("nonforcedTest");
            done();
        }).emit("test");
    });

    it("msngr.middleware() - Executes optional middleware over specified message", function (done) {
        msngr.middleware("middleTest", function (payload, message, async) {
            return "middle";
        }, false);

        msngr("mytopic").use("middleTest").on(function (payload, message) {
            expect(payload).to.equal("middle");
            msngr.unmiddleware("middleTest");
            done();
        }).emit("test");
    });

    it("msngr.middleware() - Executes optional, async middleware over specified message", function (done) {
        msngr.middleware("middleTest", function (payload, message, async) {
            async()("wutwut");
        }, false);

        msngr("mytopic").use("middleTest").on(function (payload, message) {
            expect(payload).to.equal("wutwut");
            msngr.unmiddleware("middleTest");
            done();
        }).emit("test");
    });
});
