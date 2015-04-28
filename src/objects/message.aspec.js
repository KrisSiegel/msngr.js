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

    it("msngr.internal.objects.message - handles a message object as expected", function () {
        var m = msngr.internal.objects.message({ topic: "MyTopic", category: "MyCategory", dataType: "MyDataType" });
        expect(m).to.exist;
        expect(m.message).to.exist;
        expect(m.message.topic).to.exist;
        expect(m.message.topic).to.equal("MyTopic");
        expect(m.message.category).to.exist;
        expect(m.message.category).to.equal("MyCategory");
        expect(m.message.dataType).to.exist;
        expect(m.message.dataType).to.equal("MyDataType");
    });

    it("msngr.internal.objects.message() - converts single string into message object with a topic", function () {
        var m = msngr.internal.objects.message("MyTopic");
        expect(m).to.exist;
        expect(m.message).to.exist;
        expect(m.message.topic).to.exist;
        expect(m.message.topic).to.equal("MyTopic");
    });

    it("msngr.internal.objects.message() - converts two strings into message object with a topic and category", function () {
        var m = msngr.internal.objects.message("MyTopic", "MyCategory");
        expect(m).to.exist;
        expect(m.message).to.exist;
        expect(m.message.topic).to.exist;
        expect(m.message.topic).to.equal("MyTopic");
        expect(m.message.category).to.exist;
        expect(m.message.category).to.equal("MyCategory");
    });

    it("msngr.internal.objects.message() - converts three strings into message object with a topic, category and dataType", function () {
        var m = msngr.internal.objects.message("MyTopic", "MyCategory", "MyDataType");
        expect(m).to.exist;
        expect(m.message).to.exist;
        expect(m.message.topic).to.exist;
        expect(m.message.topic).to.equal("MyTopic");
        expect(m.message.category).to.exist;
        expect(m.message.category).to.equal("MyCategory");
        expect(m.message.dataType).to.exist;
        expect(m.message.dataType).to.equal("MyDataType");
    });

    it("msngr.internal.objects.message() - multiple copies do not share message objects", function () {
        var m1 = msngr.internal.objects.message("MyTopic1");
        var m2 = msngr.internal.objects.message("MyTopic2", "MyCategory2");
        var m3 = msngr.internal.objects.message("MyTopic3", "MyCategory3", "MyDataType3");
        var m4 = msngr.internal.objects.message("MyTopic4", "MyCategory4");
        var m5 = msngr.internal.objects.message("MyTopic5");

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

    it("msngr.internal.objects.message().emit() / on() - Successfully emits and handles a topic only message", function (done) {
        var msg = msngr.internal.objects.message("MyTopic");
        msg.on(function (payload) {
            expect(payload).to.exist;
            expect(payload).to.equal("MyPayload");
            done();
        });

        msg.emit("MyPayload");
    });

    it("msngr.internal.objects.message().emit() / on() - Successfully emits and handles a topic and category message", function (done) {
        var msg = msngr.internal.objects.message("MyTopic", "MyCategory");
        msg.on(function (payload) {
            expect(payload).to.exist;
            expect(payload).to.equal("AnotherPayload");
            done();
        });

        msg.emit("AnotherPayload");
    });

    it("msngr.internal.objects.message().emit() / on() - Successfully emits and handles a topic, category and dataType message", function (done) {
        var msg = msngr.internal.objects.message("MyTopic", "MyCategory", "MyDataType");
        msg.on(function (payload) {
            expect(payload).to.exist;
            expect(payload).to.equal("WeePayloads!");
            done();
        });

        msg.emit("WeePayloads!");
    });

    it("msngr.internal.objects.message().emit() / on() - Setup three handlers, both receive emit payload", function (done) {
        var handled = 0;

        var msg = msngr.internal.objects.message("MyTopic", "MyCategory", "MyDataType");
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

    it("msngr.internal.objects.message().emit() / on() - Setup two handlers, delete one and the other still receives", function (done) {
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

        var msg = msngr.internal.objects.message("MyTopic", "MyCategory", "MyDataType");

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

    it("msngr.internal.objects.message().emit() / on() - Multiple handlers, callback on emit aggregates results", function (done) {
        var handled = 0;

        var msg = msngr.internal.objects.message("MyTopic", "MyCategory", "MyDataType");
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
});
