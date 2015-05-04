if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./objects/message.js", function () {
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

    it("msngr - handles a message object as expected", function () {
        var m = msngr({ topic: "MyTopic", category: "MyCategory", dataType: "MyDataType" });
        expect(m).to.exist;
        expect(m.message).to.exist;
        expect(m.message.topic).to.exist;
        expect(m.message.topic).to.equal("MyTopic");
        expect(m.message.category).to.exist;
        expect(m.message.category).to.equal("MyCategory");
        expect(m.message.dataType).to.exist;
        expect(m.message.dataType).to.equal("MyDataType");
    });

    it("msngr() - converts single string into message object with a topic", function () {
        var m = msngr("MyTopic");
        expect(m).to.exist;
        expect(m.message).to.exist;
        expect(m.message.topic).to.exist;
        expect(m.message.topic).to.equal("MyTopic");
    });

    it("msngr() - converts two strings into message object with a topic and category", function () {
        var m = msngr("MyTopic", "MyCategory");
        expect(m).to.exist;
        expect(m.message).to.exist;
        expect(m.message.topic).to.exist;
        expect(m.message.topic).to.equal("MyTopic");
        expect(m.message.category).to.exist;
        expect(m.message.category).to.equal("MyCategory");
    });

    it("msngr() - converts three strings into message object with a topic, category and dataType", function () {
        var m = msngr("MyTopic", "MyCategory", "MyDataType");
        expect(m).to.exist;
        expect(m.message).to.exist;
        expect(m.message.topic).to.exist;
        expect(m.message.topic).to.equal("MyTopic");
        expect(m.message.category).to.exist;
        expect(m.message.category).to.equal("MyCategory");
        expect(m.message.dataType).to.exist;
        expect(m.message.dataType).to.equal("MyDataType");
    });

    it("msngr.internal.handlerCount - returns the correct count of registered messages", function () {
        expect(msngr.internal.handlerCount).to.exist;
        expect(msngr.internal.handlerCount).to.equal(0);
        msngr("MyTopic").on(function () { });
        expect(msngr.internal.handlerCount).to.equal(1);
        msngr("AnotherTopic").on(function () { });
        expect(msngr.internal.handlerCount).to.equal(2);
    });

    it("msngr() - multiple copies do not share message objects", function () {
        var m1 = msngr("MyTopic1");
        var m2 = msngr("MyTopic2", "MyCategory2");
        var m3 = msngr("MyTopic3", "MyCategory3", "MyDataType3");
        var m4 = msngr("MyTopic4", "MyCategory4");
        var m5 = msngr("MyTopic5");

        expect(m1).to.exist;
        expect(m2).to.exist;
        expect(m3).to.exist;
        expect(m4).to.exist;
        expect(m5).to.exist;

        expect(m1.message.topic).to.not.equal(m2.message.topic);
        expect(m2.message.topic).to.not.equal(m3.message.topic);
        expect(m3.message.topic).to.not.equal(m4.message.topic);
        expect(m4.message.topic).to.not.equal(m5.message.topic);
        expect(m5.message.topic).to.not.equal(m1.message.topic);

        expect(m2.message.category).to.not.equal(m3.message.category);
        expect(m3.message.dataType).to.not.equal(m4.message.dataType);
    });

    it("msngr().emit() / on() - Successfully emits and handles a topic only message", function (done) {
        var msg = msngr("MyTopic");
        msg.on(function (payload) {
            expect(payload).to.exist;
            expect(payload).to.equal("MyPayload");
            done();
        });

        msg.emit("MyPayload");
    });

    it("msngr().emit() / on() - Successfully emits and handles a topic and category message", function (done) {
        var msg = msngr("MyTopic", "MyCategory");
        msg.on(function (payload) {
            expect(payload).to.exist;
            expect(payload).to.equal("AnotherPayload");
            done();
        });

        msg.emit("AnotherPayload");
    });

    it("msngr().emit() / on() - Successfully emits and handles a topic, category and dataType message", function (done) {
        var msg = msngr("MyTopic", "MyCategory", "MyDataType");
        msg.on(function (payload) {
            expect(payload).to.exist;
            expect(payload).to.equal("WeePayloads!");
            done();
        });

        msg.emit("WeePayloads!");
    });

    it("msngr().emit() / on() - Setup three handlers, both receive emit payload", function (done) {
        var handled = 0;

        var msg = msngr("MyTopic", "MyCategory", "MyDataType");
        msg.on(function (payload) {
            ++handled;
            expect(payload).to.exist;
            expect(payload).to.equal("ThreeHandlers");
        });

        msg.on(function (payload) {
            ++handled;
            expect(payload).to.exist;
            expect(payload).to.equal("ThreeHandlers");
        });

        msg.on(function (payload) {
            ++handled;
            expect(payload).to.exist;
            expect(payload).to.equal("ThreeHandlers");
        });

        msg.emit("ThreeHandlers");

        setTimeout(function () {
            expect(handled).to.equal(3);
            done();
        }, 250);
    });

    it("msngr().emit() / on() - Setup two handlers, delete one and the other still receives", function (done) {
        var handled = 0;
        var answer = undefined;
        var onHandler1 = function (payload) {
            ++handled;
            answer = 1;
            expect(payload).to.exist;
            expect(payload).to.equal("TwoThenOne");
        };

        var onHandler2 = function (payload) {
            ++handled;
            answer = 5;
            expect(payload).to.exist;
            expect(payload).to.equal("TwoThenOne");
        };

        var msg = msngr("MyTopic", "MyCategory", "MyDataType");

        msg.on(onHandler1);
        msg.on(onHandler2);

        msg.drop(onHandler1);

        msg.emit("TwoThenOne");

        setTimeout(function () {
            expect(handled).to.equal(1);
            expect(answer).to.exist;
            expect(answer).to.equal(5);
            done();
        }, 250);
    });

    it("msngr().emit() / on() - Multiple handlers, callback on emit aggregates results", function (done) {
        var handled = 0;

        var msg = msngr("MyTopic", "MyCategory", "MyDataType");
        msg.on(function (payload) {
            ++handled;
            expect(payload).to.exist;
            expect(payload).to.equal("ThreeHandlers");
            return "testering";
        });

        msg.on(function (payload, async) {
            var finished = async();
            ++handled;
            expect(payload).to.exist;
            expect(payload).to.equal("ThreeHandlers");
            finished(42);
        });

        msg.on(function (payload) {
            ++handled;
            expect(payload).to.exist;
            expect(payload).to.equal("ThreeHandlers");
            return true;
        });

        msg.emit("ThreeHandlers", function (results) {
            expect(handled).to.equal(3);
            expect(results).to.exist;
            expect(results.length).to.equal(3);
            expect(results.indexOf("testering")).to.not.equal(-1);
            expect(results.indexOf(42)).to.not.equal(-1);
            expect(results.indexOf(true)).to.not.equal(-1);
            done();
        });
    });

    it("msngr().emit() / once() - once is only called one time for handling the same message", function (done) {
        var handledCount = 0;

        var msg = msngr("MyTopicTest");
        msg.once(function (payload) {
            ++handledCount;
        });

        msg.emit();
        msg.emit();
        msg.emit();
        msg.emit();

        setTimeout(function () {
            expect(handledCount).to.equal(1);
            done();
        }, 250);
    });
    
});