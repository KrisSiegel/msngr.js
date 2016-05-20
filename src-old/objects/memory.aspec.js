if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./objects/memory.js", function() {
    "use strict";

    before(function() {
        msngr.debug = true;
    });

    after(function() {
        msngr.debug = false;
    });

    it("msngr.internal.store.index(message) - indexes a message with only a topic", function() {
        var memory = msngr.internal.objects.memory();

        var message = {
            topic: "TestTopic1"
        };

        expect(memory.count).to.equal(0);
        var id = memory.index(message);
        expect(id).to.exist;
        expect(memory.count).to.equal(1);
    });

    it("msngr.internal.store.index(message) - indexes a message with a topic and category", function() {
        var memory = msngr.internal.objects.memory();

        var message = {
            topic: "TestTopic1",
            category: "TestCategory1"
        };

        expect(memory.count).to.equal(0);
        var id = memory.index(message);
        expect(id).to.exist;
        expect(memory.count).to.equal(1);
    });

    it("msngr.internal.store.index(message) - indexes a message with a topic and subcategory", function() {
        var memory = msngr.internal.objects.memory();

        var message = {
            topic: "TestTopic1",
            subcategory: "TestSubCategory1"
        };

        expect(memory.count).to.equal(0);
        var id = memory.index(message);
        expect(id).to.exist;
        expect(memory.count).to.equal(1);
    });

    it("msngr.internal.store.index(message) - indexes a message with a topic, category and subcategory", function() {
        var memory = msngr.internal.objects.memory();

        var message = {
            topic: "TestTopic1",
            category: "TestCategory1",
            subcategory: "TestSubCategory1"
        };

        expect(memory.count).to.equal(0);
        var id = memory.index(message);
        expect(id).to.exist;
        expect(memory.count).to.equal(1);
    });

    it("msngr.internal.store.index(message) - invalid message shouldn't index", function() {
        var memory = msngr.internal.objects.memory();

        var message = {
            cookie: "monster"
        };

        expect(memory.count).to.equal(0);
        var id = memory.index(message);
        expect(id).to.not.exist;
        expect(memory.count).to.equal(0);
    });

    it("msngr.internal.store.delete(uuid) - deletes a valid uuid", function() {
        var memory = msngr.internal.objects.memory();

        var message = {
            topic: "TestTopic1",
            category: "TestCategory1",
            subcategory: "TestSubCategory1"
        };

        var id = memory.index(message);
        expect(id).to.exist;

        var result = memory.delete(id);
        expect(result).to.exist;
        expect(result).to.equal(true);
        expect(memory.count).to.equal(0);
    });

    it("msngr.internal.store.delete(uuid) - doesn't delete an invalid uuid", function() {
        var memory = msngr.internal.objects.memory();

        var result = memory.delete("sldfjslkfjlwrjlskdfjs");
        expect(result).to.exist;
        expect(result).to.equal(false);
        expect(memory.count).to.equal(0);
    });

    it("msngr.internal.store.query(message) - Correctly gets one result for a query on a topic", function() {
        var memory = msngr.internal.objects.memory();

        var message = {
            topic: "TestTopic1"
        };

        var id = memory.index(message);
        expect(id).to.exist;

        var result = memory.query({
            topic: "TestTopic1"
        });

        expect(result).to.exist;
        expect(result.length).to.equal(1);
    });

    it("msngr.internal.store.query(message) - Correctly gets zero results for a query on a topic that doesn't exist", function() {
        var memory = msngr.internal.objects.memory();

        var result = memory.query({
            topic: "TestTopic1"
        });

        expect(result).to.exist;
        expect(result.length).to.equal(0);
    });

    it("msngr.internal.store.query(message) - Correctly gets one result for a query on a topic and category", function() {
        var memory = msngr.internal.objects.memory();

        var message = {
            topic: "TestTopic1",
            category: "TestCategory1"
        };

        var id = memory.index(message);
        expect(id).to.exist;

        var result = memory.query({
            topic: "TestTopic1",
            category: "TestCategory1"
        });

        expect(result).to.exist;
        expect(result.length).to.equal(1);
    });

    it("msngr.internal.store.query(message) - Correctly gets zero results for a query on a topic and category that doesn't exist", function() {
        var memory = msngr.internal.objects.memory();

        var result = memory.query({
            topic: "TestTopic1",
            category: "TestCategory1"
        });

        expect(result).to.exist;
        expect(result.length).to.equal(0);
    });

    it("msngr.internal.store.query(message) - Correctly gets one result for a query on a topic, category and subcategory", function() {
        var memory = msngr.internal.objects.memory();

        var message = {
            topic: "TestTopic1",
            category: "TestCategory1",
            subcategory: "TestSubCategory1"
        };

        var id = memory.index(message);
        expect(id).to.exist;

        var result = memory.query({
            topic: "TestTopic1",
            category: "TestCategory1",
            subcategory: "TestSubCategory1"
        });

        expect(result).to.exist;
        expect(result.length).to.equal(1);
    });

    it("msngr.internal.store.query(message) - Correctly gets zero results for a query on a topic, category and subcategory that doesn't exist", function() {
        var memory = msngr.internal.objects.memory();

        var result = memory.query({
            topic: "TestTopic1",
            category: "TestCategory1",
            subcategory: "TestSubCategory1"
        });

        expect(result).to.exist;
        expect(result.length).to.equal(0);
    });

    it("msngr.internal.store.query(message) - Correctly gets zero results for a query on a topic, category and subcategory where category doesn't exist", function() {
        var memory = msngr.internal.objects.memory();

        var message = {
            topic: "TestTopic1",
            category: "TestCategory1",
            subcategory: "TestSubCategory1"
        };

        var id = memory.index(message);
        expect(id).to.exist;

        var result = memory.query({
            topic: "TestTopic1",
            category: "TestCategory2",
            subcategory: "TestSubCategory1"
        });

        expect(result).to.exist;
        expect(result.length).to.equal(0);
    });

    it("msngr.internal.store.query(message) - Correctly gets zero results for a query on a topic, category and subcategory where subcategory doesn't exist", function() {
        var memory = msngr.internal.objects.memory();

        var message = {
            topic: "TestTopic1",
            category: "TestCategory1",
            subcategory: "TestSubCategory1"
        };

        var id = memory.index(message);
        expect(id).to.exist;

        var result = memory.query({
            topic: "TestTopic1",
            category: "TestCategory1",
            subcategory: "TestSubCategory2"
        });

        expect(result).to.exist;
        expect(result.length).to.equal(0);
    });

    it("msngr.internal.store.query(message) - Correctly gets zero results for a query on a topic, category and subcategory where topic doesn't exist", function() {
        var memory = msngr.internal.objects.memory();

        var message = {
            topic: "TestTopic1",
            category: "TestCategory1",
            subcategory: "TestSubCategory1"
        };

        var id = memory.index(message);
        expect(id).to.exist;

        var result = memory.query({
            topic: "TestTopic2",
            category: "TestCategory1",
            subcategory: "TestSubCategory1"
        });

        expect(result).to.exist;
        expect(result.length).to.equal(0);
    });

    it("msngr.internal.store.clear() - Clears all indexed messages", function() {
        var memory = msngr.internal.objects.memory();

        var ids = [];
        ids.push(memory.index({
            topic: "chicken"
        }));
        ids.push(memory.index({
            topic: "table",
            category: "50"
        }));
        ids.push(memory.index({
            topic: "stairs",
            category: "10",
            subcategory: "food"
        }));
        ids.push(memory.index({
            topic: "whatevea",
            subcategory: "punk"
        }));

        expect(memory.count).to.equal(4);
        expect(memory.clear()).to.equal(true);
        expect(memory.query({
            topic: "chicken"
        }).length).to.equal(0);
        expect(memory.query({
            topic: "stairs",
            category: "10",
            subcategory: "food"
        }).length).to.equal(0);
    });

    it("msngr.internal.store.count - Returns a correct count", function() {
        var memory = msngr.internal.objects.memory();

        expect(memory.count).to.equal(0);
        memory.index({
            topic: "chicken"
        });
        expect(memory.count).to.equal(1);
        memory.index({
            topic: "table",
            category: "50"
        });
        expect(memory.count).to.equal(2);
        memory.index({
            topic: "stairs",
            category: "10",
            subcategory: "food"
        });
        expect(memory.count).to.equal(3);
        expect(memory.clear()).to.equal(true);
        expect(memory.count).to.equal(0);
        memory.index({
            topic: "whatevea",
            subcategory: "punk"
        });
        expect(memory.count).to.equal(1);

    });
});
