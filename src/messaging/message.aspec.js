if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./src/messaging/message.js", function() {
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

    it("msngr() - throws an exception for invalid input", function() {
        expect(msngr.bind([])).to.throw();
        expect(msngr.bind()).to.throw();
        expect(msngr.bind("")).to.throw();
        expect(msngr.bind(123)).to.throw();
        expect(msngr.bind((new Date()))).to.throw();
    });

    it("msngr() - handles a message object as expected", function() {
        var m = msngr({
            topic: "MyTopic",
            category: "MyCategory",
            subcategory: "MySubCategory"
        });
        expect(m).to.exist;
        expect(m.message).to.exist;
        expect(m.message.topic).to.exist;
        expect(m.message.topic).to.equal("mytopic");
        expect(m.message.category).to.exist;
        expect(m.message.category).to.equal("mycategory");
        expect(m.message.subcategory).to.exist;
        expect(m.message.subcategory).to.equal("mysubcategory");
    });

    it("msngr() - converts single string into message object with a topic", function() {
        var m = msngr("MyTopic");
        expect(m).to.exist;
        expect(m.message).to.exist;
        expect(m.message.topic).to.exist;
        expect(m.message.topic).to.equal("mytopic");
    });

    it("msngr() - converts two strings into message object with a topic and category", function() {
        var m = msngr("MyTopic", "MyCategory");
        expect(m).to.exist;
        expect(m.message).to.exist;
        expect(m.message.topic).to.exist;
        expect(m.message.topic).to.equal("mytopic");
        expect(m.message.category).to.exist;
        expect(m.message.category).to.equal("mycategory");
    });

    it("msngr() - converts three strings into message object with a topic, category and subcategory", function() {
        var m = msngr("MyTopic", "MyCategory", "MySubCategory");
        expect(m).to.exist;
        expect(m.message).to.exist;
        expect(m.message.topic).to.exist;
        expect(m.message.topic).to.equal("mytopic");
        expect(m.message.category).to.exist;
        expect(m.message.category).to.equal("mycategory");
        expect(m.message.subcategory).to.exist;
        expect(m.message.subcategory).to.equal("mysubcategory");
    });

    it("msngr.internal.handlerCount - returns the correct count of registered messages", function() {
        expect(msngr.internal.handlerCount).to.exist;
        expect(msngr.internal.handlerCount).to.equal(0);
        msngr("MyTopic").on(function() {});
        expect(msngr.internal.handlerCount).to.equal(1);
        msngr("AnotherTopic").on(function() {});
        expect(msngr.internal.handlerCount).to.equal(2);
    });

    it("msngr() - multiple copies do not share message objects", function() {
        var m1 = msngr("MyTopic1");
        var m2 = msngr("MyTopic2", "MyCategory2");
        var m3 = msngr("MyTopic3", "MyCategory3", "MySubCategory3");
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
        expect(m3.message.subcategory).to.not.equal(m4.message.subcategory);
    });

    it("msngr().emit() / on() - Successfully emits specific message to generic handler and gets the emitted message object", function(done) {
        msngr("HighlyTopical").on(function(payload, message) {
            expect(payload).to.exist;
            expect(payload).to.equal("stuff");
            expect(message).to.exist;
            expect(message.topic).to.equal("highlytopical");
            expect(message.category).to.equal("mycats");
            expect(message.subcategory).to.equal("othercats");
            done();
        });

        msngr("HighlyTopical", "MyCats", "OtherCats").emit("stuff");
    });

    it("msngr().emit() / on() - Successfully emits and handles a topic only message", function(done) {
        var msg = msngr("MyTopic");
        msg.on(function(payload) {
            expect(payload).to.exist;
            expect(payload).to.equal("MyPayload");
            done();
        });

        msg.emit("MyPayload");
    });

    it("msngr().emit() / on() - Successfully emits and handles a topic and category message", function(done) {
        var msg = msngr("MyTopic", "MyCategory");
        msg.on(function(payload) {
            expect(payload).to.exist;
            expect(payload).to.equal("AnotherPayload");
            done();
        });

        msg.emit("AnotherPayload");
    });

    it("msngr().emit() / on() - Successfully emits and handles a topic, category and subcategory message", function(done) {
        var msg = msngr("MyTopic", "MyCategory", "MySubCategory");
        msg.on(function(payload) {
            expect(payload).to.exist;
            expect(payload).to.equal("WeePayloads!");
            done();
        });

        msg.emit("WeePayloads!");
    });

    it("msngr().emit() / on() - Successfully emits topic, category to a handler set to handle topic", function(done) {
        msngr("MyTopic").on(function(payload) {
            expect(payload).to.exist;
            expect(payload).to.equal("WeePayloads!");
            done();
        });

        msngr("MyTopic", "MyCategory").emit("WeePayloads!");
    });

    it("msngr().emit() / on() - Successfully emits topic, category and subcategory to a handler set to handle topic and category", function(done) {
        msngr("MyTopic", "MyCategory").on(function(payload) {
            expect(payload).to.exist;
            expect(payload).to.equal("WeePayloads!");
            done();
        });

        msngr("MyTopic", "MyCategory", "MySubcategory").emit("WeePayloads!");
    });

    it("msngr().emit() / on() - Setup three handlers, both receive emit payload", function(done) {
        var handled = 0;

        var msg = msngr("MyTopic", "MyCategory", "MySubCategory");
        msg.on(function(payload) {
            ++handled;
            expect(payload).to.exist;
            expect(payload).to.equal("ThreeHandlers");
        });

        msg.on(function(payload) {
            ++handled;
            expect(payload).to.exist;
            expect(payload).to.equal("ThreeHandlers");
        });

        msg.on(function(payload) {
            ++handled;
            expect(payload).to.exist;
            expect(payload).to.equal("ThreeHandlers");
        });

        msg.emit("ThreeHandlers");

        setTimeout(function() {
            expect(handled).to.equal(3);
            done();
        }, 250);
    });

    it("msngr().emit() / on() - Setup two handlers, delete one and the other still receives", function(done) {
        var handled = 0;
        var answer = undefined;
        var onHandler1 = function(payload) {
            ++handled;
            answer = 1;
            expect(payload).to.exist;
            expect(payload).to.equal("TwoThenOne");
        };

        var onHandler2 = function(payload) {
            ++handled;
            answer = 5;
            expect(payload).to.exist;
            expect(payload).to.equal("TwoThenOne");
        };

        var msg = msngr("MyTopic", "MyCategory", "MySubCategory");

        msg.on(onHandler1);
        msg.on(onHandler2);

        msg.drop(onHandler1);

        msg.emit("TwoThenOne");

        setTimeout(function() {
            expect(handled).to.equal(1);
            expect(answer).to.exist;
            expect(answer).to.equal(5);
            done();
        }, 250);
    });

    it("msngr().emit() / on() - Multiple handlers, callback on emit aggregates results", function(done) {
        var handled = 0;

        var msg = msngr("MyTopic", "MyCategory", "MySubCategory");
        msg.on(function(payload) {
            ++handled;
            expect(payload).to.exist;
            expect(payload).to.equal("ThreeHandlers");
            return "testering";
        });

        msg.on(function(payload, message, async) {
            var finished = async();
            ++handled;
            expect(payload).to.exist;
            expect(message).to.exist;
            expect(message.topic).to.equal("mytopic");
            expect(message.category).to.equal("mycategory");
            expect(message.subcategory).to.equal("mysubcategory");
            expect(payload).to.equal("ThreeHandlers");
            finished(42);
        });

        msg.on(function(payload) {
            ++handled;
            expect(payload).to.exist;
            expect(payload).to.equal("ThreeHandlers");
            return true;
        });

        msg.emit("ThreeHandlers", function(results) {
            expect(handled).to.equal(3);
            expect(results).to.exist;
            expect(results.length).to.equal(3);
            expect(results.indexOf("testering")).to.not.equal(-1);
            expect(results.indexOf(42)).to.not.equal(-1);
            expect(results.indexOf(true)).to.not.equal(-1);
            done();
        });
    });

    it("msngr().emit() / once() - once is only called one time for handling the same message", function(done) {
        var handledCount = 0;

        var msg = msngr("MyTopicTest");
        msg.once(function(payload) {
            ++handledCount;
        });

        msg.emit();
        msg.emit();
        msg.emit();
        msg.emit();

        setTimeout(function() {
            expect(handledCount).to.equal(1);
            done();
        }, 250);
    });

    it("msngr().emit(func) - if a method is passed in as first argument then that is used as callback", function(done) {
        var msg = msngr("TestTopical");
        var hitOn = false;
        msg.on(function() {
            hitOn = true;
        });
        msg.emit(function() {
            expect(hitOn).to.equal(true);
            done();
        });
    });

    it("msngr().persist().on() - persist stores and re-emits data with new on registrations", function(done) {
        var handledCount = 0;

        var msg = msngr("AnotherTopic");
        msg.persist("PayloadTwo");
        msg.on(function(payload) {
            ++handledCount;
            expect(payload).to.exist;
            expect(payload).to.equal("PayloadTwo");
            expect(handledCount).to.equal(1);
            done();
        });
        msg.cease();
    });

    it("msngr().on().persist() - registers handler then receives persisted payload", function(done) {
        var handledCount = 0;

        var msg = msngr("MyTestingTopic");
        msg.on(function(payload) {
            ++handledCount;
            expect(payload).to.exist;
            expect(payload).to.equal("MyPayload");
            expect(handledCount).to.equal(1);
            done();
        });
        msg.persist("MyPayload");
        msg.cease();

    });

    it("msngr().once().persist() - registers handler then receives persisted payload", function(done) {
        var handledCount = 0;

        var msg = msngr("MyTestingTopic");
        msg.once(function(payload) {
            ++handledCount;
            expect(payload).to.exist;
            expect(payload).to.equal("MyPayload");
            expect(handledCount).to.equal(1);
            done();
        });
        msg.persist("MyPayload");
        msg.cease();

    });

    it("msngr().persist().cease().on() - registers a payload, unregisters a payload then registers a handler", function(done) {
        var handledCount = 0;

        var msg = msngr("MyTestingTopic");
        msg.persist("MyPayload");
        msg.cease();
        msg.on(function(payload) {
            ++handledCount;
        });

        setTimeout(function() {
            expect(handledCount).to.equal(0);
            done();
        }, 250);

    });

    it("msngr().persist() - complex merging of persisted objects for ultimate ready status", function(done) {
        var msg = msngr("MyCoolTopic", "MyCat");
        var d = false;
        msg.on(function(payload) {
            // Check to make sure ready state is across the board
            expect(payload).to.exist;
            if (payload.ready1 === true && payload.ready2 === true && payload.ready3 === true && payload.ready4 === true && d === false) {
                // All statuses have come in ready!
                d = true;
                done();
            }
        });

        msg.persist({
            ready1: true
        });
        msg.persist({
            ready2: true
        });
        msg.persist({
            ready3: true
        });
        msg.persist({
            ready4: true
        });
    });

    it("msngr().persist() - passing in nothing still conducts a proper persisting of message execution in later 'on's", function(done) {
        msngr("Server", "Ready").persist();

        var calls = 0;
        msngr("Server", "Ready").on(function() {
            ++calls;
        });

        msngr("Server", "Ready").on(function() {
            ++calls;
        });

        msngr("Server", "Ready").on(function() {
            ++calls;
        });

        setTimeout(function() {
            expect(calls).to.equal(3);
            done();
        }, 250);
    });

    it("msngr().handlers - returns a correct subscriber count", function() {
        var msg = msngr("test", "whateves");
        expect(msg.handlers).to.equal(0);
        msg.on(function() { });
        expect(msg.handlers).to.equal(1);
        msg.dropAll();
        expect(msg.handlers).to.equal(0);
    });

    it("msngr().on() / emit() - messages are case insensitive", function(done) {
        var flagTop = false;
        var flagCat = false;
        var flagSub = false;
        var flagAll = false;

        msngr("MyToPiC").on(function() {
            flagTop = true;
        });

        msngr("anothertopic", "MyCaTeGoRy").on(function() {
            flagCat = true;
        });

        msngr("atop", "cat", "MySuBcAtEgOrY").on(function() {
            flagSub = true;
        });

        msngr("aBcDe", "FgHi", "JkLmNo").on(function() {
            flagAll = true;
        })

        msngr("MYTOPIC").emit();
        msngr("anothertopic", "MYCATEGORY").emit();
        msngr("atop", "cat", "MYSUBCATEGORY").emit();
        msngr("ABCDE", "FGHI", "JKLMNO").emit();

        setTimeout(function() {
            expect(flagTop).to.equal(true);
            expect(flagCat).to.equal(true);
            expect(flagSub).to.equal(true);
            expect(flagAll).to.equal(true);
            done();
        }, 250);
    });

});
