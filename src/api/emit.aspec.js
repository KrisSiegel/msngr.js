if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("api/emit.js", function () {
    var uniqueKey = Math.floor(Math.random() * 1000);

    it("msngr.emit() throws", function (done) {
        expect(msngr.emit).to.throw();
        done();
    });

    it("msngr.emit() with topic", function (done) {
        msngr.register("test_" + uniqueKey, function () {
            done();
        }, this);
        msngr.emit("test_" + uniqueKey);
    });

    it("msngr.emit() with topic and category but only register topic", function (done) {
        msngr.register("test_" + uniqueKey, function () {
            done();
        }, this);
        var msg = { topic: "test_" + uniqueKey, category: "testCat_" + uniqueKey };
        console.log(msngr.utils.indexer.query(msg));

        msngr.emit(msg);
    });

    it("msngr.emit() with topic and category", function (done) {
        var msg = {
            topic: "test2_" + uniqueKey,
            category: "test2Cat_" + uniqueKey
        };
        msngr.register(msg, function () {
            done();
        }, this);

        msngr.emit(msg);
    });

    it("msngr.emit() with topic, category and dataType", function (done) {
        var msg = {
            topic: "test3_" + uniqueKey,
            category: "test3Cat_" + uniqueKey,
            dataType: "test3Type_" + uniqueKey
        };
        msngr.register(msg, function () {
            done();
        }, this);

        msngr.emit(msg);
    });

    it("msngr.emit() with topic and partial, matching category", function (done) {
        msngr.register({
            topic: "test4_" + uniqueKey,
            category: "test4Cat_" + uniqueKey + "test"
        }, function () {
            done();
        }, this);

        msngr.emit({
            topic: "test4_" + uniqueKey,
            category: "test4Cat_" + uniqueKey + "*"
        });
    });

    it("msngr.emit() with topic, category and partial, matching dataType", function (done) {;
        msngr.register({
            topic: "test5_" + uniqueKey,
            category: "test5Cat_" + uniqueKey,
            dataType: "test5Type_" + uniqueKey + "test"
        }, function () {
            done();
        }, this);

        msngr.emit({
            topic: "test5_" + uniqueKey,
            category: "test5Cat_" + uniqueKey,
            dataType: "test5Type_" + uniqueKey + "*"
        });
    });
});
