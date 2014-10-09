if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("binders/dom.js", function () {
    it("At least one binder is registered", function () {
        expect((msngr.registry.binders.count() > 0)).to.equal(true);
    });

    it("msngr.bind works as expected in single event", function (done) {
        var div = document.createElement("div");

        msngr.bind(div, "testEvent1", "testEvent1");

        msngr.register("testEvent1", function (e) {
            expect(e).to.not.equal(undefined);
            done();
        });

        var event1 = document.createEvent('CustomEvent');
        event1.initCustomEvent('testEvent1', false, false, null);
        div.dispatchEvent(event1);
    });

    it("msngr.unbind works as expected", function () {
        var div = document.createElement("div");

        msngr.bind(div, "testEvent2", "testEvent2");

        var count = 0;
        for (var i = 0; i < msngr.registry.binders.count(); ++i) {
            count = count + msngr.registry.binders.get(i).count();
        }

        msngr.unbind(div, "testEvent2", "testEvent2");

        var count2 = 0;
        for (var i = 0; i < msngr.registry.binders.count(); ++i) {
            count2 = count2 + msngr.registry.binders.get(i).count();
        }

        expect(count - count2).to.equal(1);
    });
});
