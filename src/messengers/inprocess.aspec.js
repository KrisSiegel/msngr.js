if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./messengers/inprocess.js", function () {
    it("msngr.emit(message, payload) / msngr.register(message, callback)", function (done) {
        var message1 = {
            topic: "TestingTopic1",
            category: "TestingCategory1",
            dataType: "TestingDataType1"
        };

        var message2 = {
            topic: "TestingTopic1"
        };

        var message3 = {
            topic: "TestingTopic1",
            dataType: "TestingDataType1"
        };

        var message4 = {
            topic: "TestingTopic1",
            category: "TestingCategory1"
        };

        var hitCount = 0;

        msngr.register(message1, function (payload) {
            expect(payload).to.exist;
            expect(payload).to.equal("testing");
            hitCount++;

            if (hitCount === 4) {
                done();
            }
        });

        msngr.register(message2, function (payload) {
            expect(payload).to.exist;
            expect(payload).to.equal("testing");
            hitCount++;

            if (hitCount === 4) {
                done();
            }
        });

        msngr.emit(message1, "testing");
        msngr.emit(message2, "testing");
        msngr.emit(message3, "testing");
        msngr.emit(message4, "testing");
    });

    it("msngr.unregister(message)", function () {
        var message1 = {
            topic: "ATest1",
            category: "ATestCat1",
            dataType: "ATestType1"
        };

        var message2 = {
            topic: "ATest1",
            category: "ATestCat2",
            dataType: "ATestType2"
        };

        msngr.register(message1, function () { });
        msngr.register(message2, function () { });

        var startDelCount = msngr.getDelegateCount();
        var startInxCount = msngr.stores.memory.count();

        expect(startDelCount).to.exist;
        expect(startInxCount).to.exist;

        msngr.unregister({ topic: "ATest1" });

        var endDelCount = msngr.getDelegateCount();
        var endInxCount = msngr.stores.memory.count();

        expect(endDelCount).to.exist;
        expect(endDelCount).to.not.equal(startDelCount);

        expect(endInxCount).to.exist;
        expect(endInxCount).to.not.equal(startInxCount);

    });

    it("msngr.unregisterAll()", function() {
        var message1 = {
            topic: "ATest1",
            category: "ATestCat1",
            dataType: "ATestType1"
        };

        var message2 = {
            topic: "ATest2",
            category: "ATestCat2",
            dataType: "ATestType2"
        };

        msngr.register(message1, function () { });
        msngr.register(message2, function () { });

        var startDelCount = msngr.getDelegateCount();
        var startInxCount = msngr.stores.memory.count();

        expect(startDelCount).to.exist;
        expect(startInxCount).to.exist;

        msngr.unregisterAll();

        var endDelCount = msngr.getDelegateCount();
        var endInxCount = msngr.stores.memory.count();

        expect(endDelCount).to.exist;
        expect(endDelCount).to.equal(0);

        expect(endInxCount).to.exist;
        expect(endInxCount).to.equal(0);
    });
});
