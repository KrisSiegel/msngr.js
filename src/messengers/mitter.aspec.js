if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./messengers/mitter.js", function () {
    "use strict";

    beforeEach(function (done) {
        msngr.dropAll();
        done();
    });

    it("msngr.emit('TestTopic', { str: 'Hello, World Payload!' }) is received by msngr.on('TestTopic', function (payload))", function (done) {
        expect(msngr.getMessageCount()).to.exist;
        expect(msngr.getMessageCount()).to.equal(0);

        msngr.on("TestTopic", function (payload) {
            expect(payload).to.exist;
            expect(payload.str).to.equal("Hello, World Payload!");

            done();
        });

        msngr.emit("TestTopic", { str: "Hello, World Payload!" });
    });

    it("msngr.emit('TestTopic', 'TestCategory', { str: 'MyPayload' }) is received by msngr.on('TestTopic', 'TestCategory', function (payload))", function (done) {
        expect(msngr.getMessageCount()).to.exist;
        expect(msngr.getMessageCount()).to.equal(0);

        msngr.on("TestTopic", "TestCategory", function (payload) {
            expect(payload).to.exist;
            expect(payload.str).to.equal("MyPayload");

            done();
        });

        msngr.emit("TestTopic", "TestCategory", { str: "MyPayload" });
    });

    it("msngr.emit('TestTopic', 'TestCategory', 'TestDataType', { str: 'AnotherPayload' }) is received by msngr.on('TestTopic', 'TestCategory', 'TestDataType', function (payload))", function (done) {
        expect(msngr.getMessageCount()).to.exist;
        expect(msngr.getMessageCount()).to.equal(0);

        msngr.on("TestTopic", "TestCategory", "TestDataType", function (payload) {
            expect(payload).to.exist;
            expect(payload.str).to.equal("AnotherPayload");

            done();
        });

        msngr.emit("TestTopic", "TestCategory", "TestDataType", { str: "AnotherPayload" });
    });

    it("msngr.emit({ topic: 'TestTopic' }, 'WeePayload') is received by msngr.on({ topic: 'TestTopic' }, function (payload))", function (done) {
        expect(msngr.getMessageCount()).to.exist;
        expect(msngr.getMessageCount()).to.equal(0);

        msngr.on({ topic: "TestTopic" }, function (payload) {
            expect(payload).to.exist;
            expect(payload).to.equal("WeePayload");

            done();
        });

        msngr.emit({ topic: "TestTopic" }, "WeePayload");
    });

    it("msngr.emit({ topic: 'TestTopic', category: 'TestCategory' }, 'PayloadWUT') is received by msngr.on({ topic: 'TestTopic', category: 'TestCategory' }, function (payload))", function (done) {
        expect(msngr.getMessageCount()).to.exist;
        expect(msngr.getMessageCount()).to.equal(0);

        msngr.on({ topic: "TestTopic", category: "TestCategory" }, function (payload) {
            expect(payload).to.exist;
            expect(payload).to.equal("PayloadWUT");

            done();
        });

        msngr.emit({ topic: "TestTopic", category: "TestCategory" }, "PayloadWUT");
    });

    it("msngr.emit({ topic: 'TestTopic', category: 'TestCategory', dataType: 'TestType' }, 'MY PAYLOAD') is received by msngr.on({ topic: 'TestTopic', category: 'TestCategory', dataType: 'TestType' }, function (payload))", function (done) {
        expect(msngr.getMessageCount()).to.exist;
        expect(msngr.getMessageCount()).to.equal(0);

        msngr.on({ topic: "TestTopic", category: "TestCategory", dataType: "TestType" }, function (payload) {
            expect(payload).to.exist;
            expect(payload).to.equal("MY PAYLOAD");

            done();
        });

        msngr.emit({ topic: "TestTopic", category: "TestCategory", dataType: "TestType" }, "MY PAYLOAD");
    });

    it("msngr.emit('TestTopic1', 'TestCategory1') is received by msngr.on('TestTopic1', 'TestCategory1') and not msngr.on('TestTopic1', 'TestCategory2')", function (done) {
        expect(msngr.getMessageCount()).to.exist;
        expect(msngr.getMessageCount()).to.equal(0);

        var counter = 0;
        var cat1 = undefined;
        var cat2 = undefined;

        msngr.on("TestTopic1", "TestCategory1", function () {
            counter++;
            cat1 = true;
        });

        msngr.on("TestTopic1", "TestCategory2", function () {
            counter++;
            cat2 = true;
        });

        msngr.emit("TestTopic1", "TestCategory1");

        setTimeout(function () {
            expect(cat1).to.equal(true);
            expect(cat2).to.equal(undefined);
            expect(counter).to.equal(1);
            done();
        }, 500);
    });

    it("msngr.drop('TestTopic') drops msngr.on('TestTopic')", function (done) {
        expect(msngr.getMessageCount()).to.exist;
        expect(msngr.getMessageCount()).to.equal(0);

        msngr.on("TestTopic", function () { });

        expect(msngr.getMessageCount()).to.equal(1);

        msngr.drop("TestTopic");

        expect(msngr.getMessageCount()).to.equal(0);

        done();
    });

    it("msngr.drop('TestTopic', 'TestCategory') drops msngr.on('TestTopic', 'TestCategory')", function (done) {
        expect(msngr.getMessageCount()).to.exist;
        expect(msngr.getMessageCount()).to.equal(0);

        msngr.on("TestTopic", "TestCategory", function () { });

        expect(msngr.getMessageCount()).to.equal(1);

        msngr.drop("TestTopic", "TestCategory");

        expect(msngr.getMessageCount()).to.equal(0);

        done();
    });

    it("msngr.drop('TestTopic', 'TestCategory', 'TestDataType') drops msngr.on('TestTopic', 'TestCategory', 'TestDataType')", function (done) {
        expect(msngr.getMessageCount()).to.exist;
        expect(msngr.getMessageCount()).to.equal(0);

        msngr.on("TestTopic", "TestCategory", "TestDataType", function () { });

        expect(msngr.getMessageCount()).to.equal(1);

        msngr.drop("TestTopic", "TestCategory", "TestDataType");

        expect(msngr.getMessageCount()).to.equal(0);

        done();
    });
});
