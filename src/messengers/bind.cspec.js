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
});
