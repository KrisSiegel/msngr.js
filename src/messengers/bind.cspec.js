if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe.skip("./messengers/bind.js", function () {

    beforeEach(function (done) {
        msngr.dropAll();
        done();
    });

    it("msngr.bind(element, event, topic) - Binds and sends with just a topic", function (done) {
        var div = document.createElement("div");

        msngr.bind(div, "testEvent", "MyTopic");

        msngr.on("MyTopic", function (payload) {
            expect(payload).to.exist;
            done();
        });

        var testEvent = document.createEvent("CustomEvent");
        testEvent.initCustomEvent("testEvent", false, false, null);
        div.dispatchEvent(testEvent);
    });

    it("msngr.bind(element, event, topic, category) - Binds and sends with a topic and category", function (done) {
        var div = document.createElement("div");

        msngr.bind(div, "testEvent", "MyTopic", "MyCategory");

        msngr.on("MyTopic", "MyCategory", function (payload) {
            expect(payload).to.exist;
            done();
        });

        var testEvent = document.createEvent("CustomEvent");
        testEvent.initCustomEvent("testEvent", false, false, null);
        div.dispatchEvent(testEvent);
    });

    it("msngr.bind(element, event, topic, category, dataType) - Binds and sends with a topic, category and dataType", function (done) {
        var div = document.createElement("div");

        msngr.bind(div, "testEvent", "MyTopic", "MyCategory", "MyDataType");

        msngr.on("MyTopic", "MyCategory", "MyDataType", function (payload) {
            expect(payload).to.exist;
            done();
        });

        var testEvent = document.createEvent("CustomEvent");
        testEvent.initCustomEvent("testEvent", false, false, null);
        div.dispatchEvent(testEvent);
    });

    it("msngr.bind(element, event, message) - Binds and sends with a message object with a topic, category and dataType", function (done) {
        var div = document.createElement("div");

        msngr.bind(div, "testEvent", { topic: "MyTopic", category: "MyCategory", dataType: "MyDataType" });

        msngr.on("MyTopic", "MyCategory", "MyDataType", function (payload) {
            expect(payload).to.exist;
            done();
        });

        var testEvent = document.createEvent("CustomEvent");
        testEvent.initCustomEvent("testEvent", false, false, null);
        div.dispatchEvent(testEvent);
    });

    it("msngr.bind(element, event, topic, category) - Binds and sends with a topic and category", function (done) {
        var div = document.createElement("div");

        msngr.bind(div, "testEvent", "MyTopic", "MyCategory");

        msngr.on("MyTopic", "MyCategory", function (payload) {
            expect(payload).to.exist;
            done();
        });

        var testEvent = document.createEvent("CustomEvent");
        testEvent.initCustomEvent("testEvent", false, false, null);
        div.dispatchEvent(testEvent);
    });

    it("msngr.bind(element, event, topic, category) - Bind then remove doesn't emit message", function (done) {
        var div = document.createElement("div");

        msngr.bind(div, "testEvent", "MyTopic", "MyCategory");
        var flag = false;
        msngr.on("MyTopic", "MyCategory", function (payload) {
            flag = true;
            expect(flag).to.equal(false);
            done();
        });

        var testEvent = document.createEvent("CustomEvent");
        testEvent.initCustomEvent("testEvent", false, false, null);

        msngr.unbind(div, "testEvent");

        div.dispatchEvent(testEvent);

        setTimeout(function () {
            expect(flag).to.equal(false);
            done();
        }, 250);
    });

    it("msngr.unbind(element, event) - Unbind and ensure the message originally bound does not get sent", function (done) {
        var div = document.createElement("div");

        msngr.bind(div, "testEvent1", "MyTopic1", "MyCategory1");
        msngr.bind(div, "testEvent2", "MyTopic2", "MyCategory2");
        var flag = false;

        msngr.on("MyTopic1", "MyCategory1", function () {
            flag = true;
        });

        msngr.on("MyTopic2", "MyCategory2", function () {
            flag = true;
        });

        var testEvent1 = document.createEvent("CustomEvent");
        testEvent1.initCustomEvent("testEven1", false, false, null);

        var testEvent2 = document.createEvent("CustomEvent");
        testEvent2.initCustomEvent("testEven1", false, false, null);

        msngr.unbind(div, "testEvent1");
        msngr.unbind(div, "testEvent2");

        div.dispatchEvent(testEvent1);
        div.dispatchEvent(testEvent2);

        setTimeout(function () {
            expect(flag).to.equal(false);
            done();
        }, 250);
    });

    it("msngr.getBindCount() - Accurately tracks the bind count", function () {
        var div = document.createElement("div");

        var start = msngr.getBindCount();
        msngr.bind(div, "testEvent1", "MyTopic1", "MyCategory1");
        msngr.bind(div, "testEvent2", "MyTopic2", "MyCategory2");

        expect(msngr.getBindCount()).to.equal(start + 2);

        msngr.unbind(div, "testEvent1");

        expect(msngr.getBindCount()).to.equal(start + 1);
    });
});
