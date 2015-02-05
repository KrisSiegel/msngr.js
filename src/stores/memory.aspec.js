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
        expect(id).to.exist();
        expect(msngr.stores.memory.count()).to.equal(1);
    });

    it("msngr.stores.memory.delete(uuid)", function () {
        var message = {
            topic: "TestTopic1",
            category: "TestCategory1",
            dataType: "TestDataType1"
        };

        var id = msngr.stores.memory.index(message);
        expect(id).to.exist();

        var result = msngr.stores.memory.delete(id);
        expect(result).to.exist();
        expect(result).to.equal(true);
        expect(msngr.stores.memory.count()).to.equal(0);
    });

    it.skip("msngr.stores.memory.query(message)", function () {
        var message = {
            topic: "TestTopic1",
            category: "TestCategory1",
            dataType: "TestDataType1"
        };


    });
});
