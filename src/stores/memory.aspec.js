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
        msngr.stores.memory.clear();
    });

    it("msngr.stores.memory.index(message)", function () {
        var message = {
            topic: "TestTopic1",
            category: "TestCategory1",
            dataType: "TestDataType1"
        };

        var id = msngr.stores.memory.index(message);
        expect(id).to.exist;
        expect(msngr.stores.memory.count()).to.equal(1);
    });

    it("msngr.stores.memory.delete(uuid)", function () {
        var message = {
            topic: "TestTopic1",
            category: "TestCategory1",
            dataType: "TestDataType1"
        };

        var id = msngr.stores.memory.index(message);
        expect(id).to.exist;

        var result = msngr.stores.memory.delete(id);
        expect(result).to.exist;
        expect(result).to.equal(true);
        expect(msngr.stores.memory.count()).to.equal(0);
    });

    it("msngr.stores.memory.query(message)", function () {
        var message = {
            topic: "TestTopic1",
            category: "TestCategory1",
            dataType: "TestDataType1"
        };

        var id = msngr.stores.memory.index(message);
        expect(id).to.exist;

        var result1 = msngr.stores.memory.query({ topic: "TestTopic1" });
        var result2 = msngr.stores.memory.query({ topic: "TestTopical" });
        var result3 = msngr.stores.memory.query({ topic: "TestTopic1", category: "TestCategory1" });
        var result4 = msngr.stores.memory.query({ topic: "TestTopic1", category: "TestCategoral" });
        var result5 = msngr.stores.memory.query({ topic: "TestTopic1", category: "TestCategory1", dataType: "TestDataType1" });
        var result6 = msngr.stores.memory.query({ topic: "TestTopic1", category: "TestCategory1", dataType: "TestDataTypal" });

        expect(result1).to.exist;
        expect(result2).to.exist;
        expect(result3).to.exist;
        expect(result4).to.exist;
        expect(result5).to.exist;
        expect(result6).to.exist;

        expect(result1.length).to.equal(1);
        expect(result2.length).to.equal(0);
        expect(result3.length).to.equal(1);
        expect(result4.length).to.equal(0);
        expect(result5.length).to.equal(1);
        expect(result6.length).to.equal(0);
    });
});
