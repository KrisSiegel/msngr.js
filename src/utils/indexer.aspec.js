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
