if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("utils/indexer.js", function () {
    it("msngr.utils.indexer.index", function () {
        msngr.utils.indexer.index({ topic: "atestTopic1" }, msngr.utils.id());
        msngr.utils.indexer.index({ topic: "atestTopic2", category: "atestCat1" }, msngr.utils.id());
        msngr.utils.indexer.index({ topic: "atestTopic3", dataType: "atestDataType1" }, msngr.utils.id());
        msngr.utils.indexer.index({ topic: "atestTopic4", category: "atestCat2", dataType: "atestDataType2" }, msngr.utils.id());

    });

    it("msngr.utils.indexer.query", function () {
        msngr.utils.indexer.index({ topic: "btestTopic1" }, msngr.utils.id());
        msngr.utils.indexer.index({ topic: "btestTopic2", category: "btestCat1" }, msngr.utils.id());
        msngr.utils.indexer.index({ topic: "btestTopic3", dataType: "btestDataType1" }, msngr.utils.id());
        msngr.utils.indexer.index({ topic: "btestTopic4", category: "btestCat2", dataType: "btestDataType2" }, msngr.utils.id());

        expect(msngr.utils.indexer.query({ topic: "btestTopic4" }).count).to.equal(1);
        expect(msngr.utils.indexer.query({ topic: "btestTopic*" }).count).to.equal(4);
    });

    it("msngr.utils.indexer.remove", function () {
        var id = msngr.utils.id();
        msngr.utils.indexer.index({ topic: "ctestTopic1" }, id);

        var results = msngr.utils.indexer.query({ topic: "ctestTopic1" });

        expect(results).to.not.equal(undefined);
        expect(results.count).to.equal(1);

        msngr.utils.indexer.remove(id);

        var results2 = msngr.utils.indexer.query({ topic: "ctestTopic1" });

        expect(results2).to.not.equal(undefined);
        expect(results2.count).to.equal(0);
    });

    it("msngr.utils.deprecatedIndexer.index", function () {
        var uniqueKey = Math.floor(Math.random() * 1000);

        msngr.utils.deprecatedIndexer.index({
            topic: "test1555_" + uniqueKey
        }, "skjdsd" + uniqueKey);
        msngr.utils.deprecatedIndexer.index({
            topic: "test2555_" + uniqueKey,
            category: "sdfsdg"
        }, "skjdsdfd" + uniqueKey);
        msngr.utils.deprecatedIndexer.index({
            topic: "test4555_" + uniqueKey,
            category: "ncvx",
            dataType: "sdlajdasd"
        }, "skjfhfhdsd" + uniqueKey);
    });
});
