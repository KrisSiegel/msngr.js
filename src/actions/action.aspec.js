if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./actions/action.js", function () {
    "use strict";

    beforeEach(function (done) {
        msngr.dropAll();
        done();
    });

    it("msngr.action(property, function () { }) - adds an action which successfully acts on a message payload", function (done) {
        msngr.on("TestTopic", function (payload) {
            expect(payload).to.exist;
            expect(payload).to.equal("Payload Poke!");

            expect(msngr.getActionCount()).to.exist;
            var c = msngr.getActionCount();
            msngr.inaction("poke");
            expect(msngr.getActionCount()).to.equal(c - 1);

            done();
        });

        expect(msngr.getActionCount()).to.exist;
        msngr.action("poke", function (message, wrap) {
            wrap.payload = wrap.payload + " Poke!";
        });

        msngr.emit({ topic: "TestTopic" , poke: true }, "Payload");
    });

    it("msngr.action(property, function () { }) - adds multiple actions which all successfully act on a message payload", function (done) {
        msngr.on("TestTopic", function (payload) {
            expect(payload).to.exist;
            expect(payload.numbers).to.exist;
            expect(payload.numbers.length).to.equal(3);
            expect(payload.words).to.exist;
            expect(payload.words.length).to.equal(3);
            expect(payload.original).to.exist;
            expect(payload.original).to.equal("TestBorg");

            msngr.inaction("numbers");
            msngr.inaction("words");

            done();
        });

        var start = msngr.getActionCount();
        expect(start).to.exist;
        msngr.action("numbers", function (message, wrap) {
            wrap.payload.numbers = [12, 15, 97];
        });

        msngr.action("words", function (message, wrap) {
            wrap.payload.words = ["float", "chicken", "springs"];
        });
        expect(msngr.getActionCount()).to.equal(start + 2);

        msngr.emit({ topic: "TestTopic" , numbers: true, words: true }, { original: "TestBorg" });
    });

    it("msngr.action(property, function () { }) - adds multiple actions but only one acts on a message payload", function (done) {
        msngr.on("TestTopic", function (payload) {
            expect(payload).to.exist;
            expect(payload.numbers).to.exist;
            expect(payload.numbers.length).to.equal(3);
            expect(payload.words).to.not.exist;
            expect(payload.original).to.exist;
            expect(payload.original).to.equal("TestBorg");

            msngr.inaction("numbers");
            msngr.inaction("words");

            done();
        });

        var start = msngr.getActionCount();
        expect(start).to.exist;
        msngr.action("numbers", function (message, wrap) {
            wrap.payload.numbers = [12, 15, 97];
        });

        msngr.action("words", function (message, wrap) {
            wrap.payload.words = ["float", "chicken", "springs"];
        });
        expect(msngr.getActionCount()).to.equal(start + 2);

        msngr.emit({ topic: "TestTopic" , numbers: true }, { original: "TestBorg" });
    });

    it("msngr.getActionCount() - Returns the correct amount of actions", function () {
        var start = msngr.getActionCount();
        
        msngr.action("chicken", function (message, wrap) {
            // Nothing here necessary
        });

        expect(msngr.getActionCount()).to.equal(start + 1);
        msngr.inaction("chicken");
        expect(msngr.getActionCount()).to.equal(start);
    });

    it.skip("msngr.action(property, function () { }) - Prevents reserved properties from being used", function (done) {
        var topicFn = function () {
            msngr.action("topic", function (message, wrap) { });
        };

        var categoryFn = function () {
            msngr.action("category", function (message, wrap) { });
        };

        var dataTypeFn = function () {
            msngr.action("dateType", function (message, wrap) { });
        };

        var payloadFn = function () {
            msngr.action("payload", function (message, wrap) { });
        };

        expect(topicFn).to.throw();
        expect(categoryFn).to.throw();
        expect(dataTypeFn).to.throw();
        expect(payloadFn).to.throw();
    });

    it.skip("msngr.action(property, function () { }) - adds an async action which successfully acts on a message payload", function (done) {
        var happenedInAsync = false;
        msngr.on("TestTopic", function (payload) {
            expect(payload).to.exist;
            expect(payload).to.equal("Payload Poll!");

            expect(msngr.getActionCount()).to.exist;
            var c = msngr.getActionCount();
            msngr.inaction("poll");
            expect(msngr.getActionCount()).to.equal(c - 1);

            done();
        });

        expect(msngr.getActionCount()).to.exist;
        msngr.action("poll", function (message, wrap) {
            var done = wrap.async();
            wrap.payload = wrap.payload + " Poll!";
            setTimeout(function () {
                happenedInAsync = true;
                done();
            }, 25);
        });

        msngr.emit({ topic: "TestTopic" , poke: true }, "Payload");
    });

});
