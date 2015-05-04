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

    it("msngr(topic).bind(element, event) - Binds and sends with just a topic", function (done) {
        var div = document.createElement("div");

        msngr("MyTopic").bind(div, "testEvent").on(function (payload) {
            expect(payload).to.exist;
            done();
        });

        var testEvent = document.createEvent("CustomEvent");
        testEvent.initCustomEvent("testEvent", false, false, null);
        div.dispatchEvent(testEvent);
    });

    it("msngr(topic, category).bind(element, event) - Binds and sends with a topic and category", function (done) {
        var div = document.createElement("div");

        msngr("MyTopic", "MyCategory").bind(div, "testEvent").on(function (payload) {
            expect(payload).to.exist;
            done();
        });

        var testEvent = document.createEvent("CustomEvent");
        testEvent.initCustomEvent("testEvent", false, false, null);
        div.dispatchEvent(testEvent);
    });

    it("msngr(topic, category, dataType).bind(element, event) - Binds and sends with a topic, category and dataType", function (done) {
        var div = document.createElement("div");

        msngr("MyTopic", "MyCategory", "MyDataType").bind(div, "testEvent").on(function (payload) {
            expect(payload).to.exist;
            done();
        });

        var testEvent = document.createEvent("CustomEvent");
        testEvent.initCustomEvent("testEvent", false, false, null);
        div.dispatchEvent(testEvent);
    });

    it("msngr(topic, category).bind(element, event) - Bind then remove doesn't emit message", function (done) {
        var div = document.createElement("div");
        var flag = false;

        msngr("MyTopic", "MyCategory").bind(div, "testEvent").on(function (payload) {
            flag = true;
            expect(flag).to.equal(false);
            done();
        });

        var testEvent = document.createEvent("CustomEvent");
        testEvent.initCustomEvent("testEvent", false, false, null);

        msngr("MyTopic", "MyCategory").unbind(div, "testEvent");

        div.dispatchEvent(testEvent);

        setTimeout(function () {
            expect(flag).to.equal(false);
            done();
        }, 250);
    });

    it("msngr(topic, category).unbind(element, event) - Unbind and ensure the message originally bound does not get sent", function (done) {
        var div = document.createElement("div");
        var flag = false;

        msngr("MyTopic1", "MyCategory1").bind(div, "testEvent1").on(function () {
            flag = true;
        }).unbind(div, "testEvent1");

        msngr("MyTopic2", "MyCategory2").bind(div, "testEvent2").on(function () {
            flag = true;
        }).unbind(div, "testEvent2");

        var testEvent1 = document.createEvent("CustomEvent");
        testEvent1.initCustomEvent("testEven1", false, false, null);

        var testEvent2 = document.createEvent("CustomEvent");
        testEvent2.initCustomEvent("testEven1", false, false, null);

        div.dispatchEvent(testEvent1);
        div.dispatchEvent(testEvent2);

        setTimeout(function () {
            expect(flag).to.equal(false);
            done();
        }, 250);
    });

    it("msngr.internal.boundCount - Accurately tracks the bind count", function () {
        var div = document.createElement("div");

        var start = msngr.internal.boundCount;
        msngr("MyTopic1", "MyCategory1").bind(div, "testEvent1");
        msngr("MyTopic2", "MyCategory2").bind(div, "testEvent2");

        expect(msngr.internal.boundCount).to.equal(start + 2);

        msngr("MyTopic1", "MyCategory1").unbind(div, "testEvent1");

        expect(msngr.internal.boundCount).to.equal(start + 1);
    });

});
