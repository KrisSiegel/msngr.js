if (typeof chai === "undefined" && typeof window === "undefined") {
  var chai = require("chai");
}

if (typeof expect === "undefined") {
  var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
  var msngr = require("../../msngr");
}

describe("./stores/memory.js", function () {
    "use strict";

    beforeEach(function() {
        msngr.store.clear();
    });

    it("msngr.store.index(message) - indexes a message with only a topic", function () {
        var message = {
            topic: "TestTopic1"
        };

        expect(msngr.store.count()).to.equal(0);
        var id = msngr.store.index(message);
        expect(id).to.exist;
        expect(msngr.store.count()).to.equal(1);
    });

    it("msngr.store.index(message) - indexes a message with a topic and category", function () {
        var message = {
            topic: "TestTopic1",
            category: "TestCategory1"
        };

        expect(msngr.store.count()).to.equal(0);
        var id = msngr.store.index(message);
        expect(id).to.exist;
        expect(msngr.store.count()).to.equal(1);
    });

    it("msngr.store.index(message) - indexes a message with a topic and dataType", function () {
        var message = {
            topic: "TestTopic1",
            dataType: "TestDataType1"
        };

        expect(msngr.store.count()).to.equal(0);
        var id = msngr.store.index(message);
        expect(id).to.exist;
        expect(msngr.store.count()).to.equal(1);
    });

    it("msngr.store.index(message) - indexes a message with a topic, category and dataType", function () {
        var message = {
            topic: "TestTopic1",
            category: "TestCategory1",
            dataType: "TestDataType1"
        };

        expect(msngr.store.count()).to.equal(0);
        var id = msngr.store.index(message);
        expect(id).to.exist;
        expect(msngr.store.count()).to.equal(1);
    });

    it("msngr.store.index(message) - invalid message shouldn't index", function () {
        var message = {
            cookie: "monster"
        };

        expect(msngr.store.count()).to.equal(0);
        var id = msngr.store.index(message);
        expect(id).to.not.exist;
        expect(msngr.store.count()).to.equal(0);
    });

    it("msngr.store.delete(uuid) - deletes a valid uuid", function () {
        var message = {
            topic: "TestTopic1",
            category: "TestCategory1",
            dataType: "TestDataType1"
        };

        var id = msngr.store.index(message);
        expect(id).to.exist;

        var result = msngr.store.delete(id);
        expect(result).to.exist;
        expect(result).to.equal(true);
        expect(msngr.store.count()).to.equal(0);
    });

    it("msngr.store.delete(uuid) - doesn't delete an invalid uuid", function () {
        var result = msngr.store.delete("sldfjslkfjlwrjlskdfjs");
        expect(result).to.exist;
        expect(result).to.equal(false);
        expect(msngr.store.count()).to.equal(0);
    });

    it("msngr.store.query(message) - Correctly gets one result for a query on a topic", function () {
        var message = {
            topic: "TestTopic1"
        };

        var id = msngr.store.index(message);
        expect(id).to.exist;

        var result = msngr.store.query({ topic: "TestTopic1" });

        expect(result).to.exist;
        expect(result.length).to.equal(1);
    });

    it("msngr.store.query(message) - Correctly gets zero results for a query on a topic that doesn't exist", function () {
        var result = msngr.store.query({ topic: "TestTopic1" });

        expect(result).to.exist;
        expect(result.length).to.equal(0);
    });

    it("msngr.store.query(message) - Correctly gets one result for a query on a topic and category", function () {
        var message = {
            topic: "TestTopic1",
            category: "TestCategory1"
        };

        var id = msngr.store.index(message);
        expect(id).to.exist;

        var result = msngr.store.query({ topic: "TestTopic1", category: "TestCategory1" });

        expect(result).to.exist;
        expect(result.length).to.equal(1);
    });

    it("msngr.store.query(message) - Correctly gets zero results for a query on a topic and category that doesn't exist", function () {
        var result = msngr.store.query({ topic: "TestTopic1", category: "TestCategory1" });

        expect(result).to.exist;
        expect(result.length).to.equal(0);
    });

    it("msngr.store.query(message) - Correctly gets one result for a query on a topic, category and dataType", function () {
        var message = {
            topic: "TestTopic1",
            category: "TestCategory1",
            dataType: "TestDataType1"
        };

        var id = msngr.store.index(message);
        expect(id).to.exist;

        var result = msngr.store.query({ topic: "TestTopic1", category: "TestCategory1", dataType: "TestDataType1" });

        expect(result).to.exist;
        expect(result.length).to.equal(1);
    });

    it("msngr.store.query(message) - Correctly gets zero results for a query on a topic, category and dataType that doesn't exist", function () {
        var result = msngr.store.query({ topic: "TestTopic1", category: "TestCategory1", dataType: "TestDataType1" });

        expect(result).to.exist;
        expect(result.length).to.equal(0);
    });

    it("msngr.store.query(message) - Correctly gets zero results for a query on a topic, category and dataType where category doesn't exist", function () {
        var message = {
            topic: "TestTopic1",
            category: "TestCategory1",
            dataType: "TestDataType1"
        };

        var id = msngr.store.index(message);
        expect(id).to.exist;

        var result = msngr.store.query({ topic: "TestTopic1", category: "TestCategory2", dataType: "TestDataType1" });

        expect(result).to.exist;
        expect(result.length).to.equal(0);
    });

    it("msngr.store.query(message) - Correctly gets zero results for a query on a topic, category and dataType where dataType doesn't exist", function () {
        var message = {
            topic: "TestTopic1",
            category: "TestCategory1",
            dataType: "TestDataType1"
        };

        var id = msngr.store.index(message);
        expect(id).to.exist;

        var result = msngr.store.query({ topic: "TestTopic1", category: "TestCategory1", dataType: "TestDataType2" });

        expect(result).to.exist;
        expect(result.length).to.equal(0);
    });

    it("msngr.store.query(message) - Correctly gets zero results for a query on a topic, category and dataType where topic doesn't exist", function () {
        var message = {
            topic: "TestTopic1",
            category: "TestCategory1",
            dataType: "TestDataType1"
        };

        var id = msngr.store.index(message);
        expect(id).to.exist;

        var result = msngr.store.query({ topic: "TestTopic2", category: "TestCategory1", dataType: "TestDataType1" });

        expect(result).to.exist;
        expect(result.length).to.equal(0);
    });

    it("msngr.store.clear() - Clears all indexed messages", function () {
        var ids = [];
        ids.push(msngr.store.index({ topic: "chicken" }));
        ids.push(msngr.store.index({ topic: "table", category: "50" }));
        ids.push(msngr.store.index({ topic: "stairs", category: "10", dataType: "food" }));
        ids.push(msngr.store.index({ topic: "whatevea", dataType: "punk" }));

        expect(msngr.store.count()).to.equal(4);
        expect(msngr.store.clear()).to.equal(true);
        expect(msngr.store.query({ topic: "chicken" }).length).to.equal(0);
        expect(msngr.store.query({ topic: "stairs", category: "10", dataType: "food" }).length).to.equal(0);
    });

    it("msngr.store.count() - Returns a correct count", function () {
        expect(msngr.store.count()).to.equal(0);
        msngr.store.index({ topic: "chicken" });
        expect(msngr.store.count()).to.equal(1);
        msngr.store.index({ topic: "table", category: "50" });
        expect(msngr.store.count()).to.equal(2);
        msngr.store.index({ topic: "stairs", category: "10", dataType: "food" });
        expect(msngr.store.count()).to.equal(3);
        expect(msngr.store.clear()).to.equal(true);
        expect(msngr.store.count()).to.equal(0);
        msngr.store.index({ topic: "whatevea", dataType: "punk" });
        expect(msngr.store.count()).to.equal(1);
 
    });
});
