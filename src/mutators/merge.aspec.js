if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./mutators/merge.js", function () {
    "use strict";

    it("msngr.merge() - expect merge() method to exist", function () {
        expect(msngr.merge).to.exist;
    });

    it("msngr.merge() - expect merge() to combine two flat objects correctly", function () {
        var obj1 = {
            mystr: "str-yo",
            mybool: true,
            mynum: 5
        };

        var obj2 = {
            mystr: "chicken",
            other: 15,
            mybool: false
        };

        var combined = msngr.merge(obj1, obj2);

        expect(combined).to.exist;
        expect(combined.mystr).to.equal("chicken");
        expect(combined.mybool).to.equal(false);
        expect(combined.other).to.equal(15);
    });

});
